import { gray, yellow } from "@marvinh/minichalk";
import { performance } from "perf_hooks";

async function loop(fn: () => void, time: number) {
  const start = performance.now();
  let count = 0;

  while (performance.now() - start < time) {
    count++;
    await fn();
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

export async function benchmark(name: string, fn: () => void): Promise<Result> {
  let a = 0;
  function noop() {
    try {
      a++;
    } finally {
      a += Math.random();
    }
  }

  // warmup
  for (let i = 100; i--; ) noop(), await fn();

  const count = 2;
  const time = 500;
  const noops = await loop(noop, time);

  let passes = 0;
  let iterations = 0;
  while (++passes !== count) {
    iterations += await loop(fn, time);
  }

  const ticks = Math.round(noops / iterations * count);
  const hz = iterations / count / time * 1000;

  return { name, iterations, noops, count, time, ticks, hz };
}

export function format({ hz, name, ticks }: Result) {
  const ops = yellow(
    Intl !== undefined
      ? new Intl.NumberFormat("en", {
          maximumFractionDigits: 3,
          useGrouping: true,
        }).format(hz)
      : "" + hz,
  );

  return `${name} ${gray("x")} ${ops} ${gray("ops/s")} ${gray(
    `(${ticks} ticks)`,
  )}`;
}

// tslint:disable no-console
export const bench = (name: string, fn: () => void) =>
  benchmark(name, fn).then(res => console.log(format(res)));
