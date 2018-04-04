import chalk from "chalk";
import { performance } from "perf_hooks";

function loop(fn: () => void, time: number) {
  const start = performance.now();
  let count = 0;

  while (performance.now() - start < time) {
    count++;
    fn();
  }

  return count;
}

export interface Result {
  name: string;
  iterations: number;
  noops: number;
  count: number;
  time: number;
  ticks: number;
  hz: number;
}

export function benchmark(name: string, fn: () => void): Promise<Result> {
  let a = 0;
  function noop() {
    try {
      a++;
    } finally {
      a += Math.random();
    }
  }

  // warmup
  for (let i = 100; i--; ) noop(), fn();

  let count = 2;
  let time = 500;
  let passes = 0;
  let noops = loop(noop, time);
  let iterations = 0;

  return new Promise(resolve => {
    function next() {
      iterations += loop(fn, time);
      setTimeout(++passes === count ? done : next, 10);
    }

    function done() {
      let ticks = Math.round(noops / iterations * count);
      let hz = iterations / count / time * 1000;
      resolve({
        name,
        iterations,
        noops,
        count,
        time,
        ticks,
        hz,
      });
    }

    next();
  });
}

export function format({ hz, name, ticks }: Result) {
  const ops = chalk.yellow(
    new Intl.NumberFormat("en", {
      maximumFractionDigits: 3,
      useGrouping: true,
    }).format(hz),
  );

  const gray = chalk.gray;
  return `${name} ${gray("x")} ${ops} ${gray("ops/s")} ${gray(
    `(${ticks} ticks)`,
  )}`;
}

export const bench = (name: string, fn: () => void) =>
  benchmark(name, fn).then(res => console.log(format(res)));
