import { performance } from "perf_hooks";
import { yellow, gray } from "@marvinh/minichalk";

function test(fn: () => any, n: number) {
  let result;
  for (let i = 0; i < n; ++i) {
    result = fn();
  }
  return result;
}

async function testAsync(fn: () => Promise<any>, n: number) {
  let result;
  for (let i = 0; i < n; ++i) {
    result = await fn();
  }
  return result;
}

function returnsPromise(fn: () => any) {
  const res = fn();
  return res !== undefined && typeof res.then === "function";
}

function getMax(runtime: number) {
  // Dynamically set n by checking if a size of 30 (used for t-distribution)
  // is possible in 2s, otherwise increase n.
  const max = 2000;
  return runtime * 30 > max ? 30 : Math.round(max / runtime);
}

/**
 * Returned for each test run
 */
export interface Result {
  name: string;
  /** aka operations per second */
  hz: number;
  /** Collected sample size */
  samples: number;
  /** nicley formatted + colored message */
  message: string;
}

function getResult(name: string, duration: number, n: number): Result {
  const time = duration / n;
  const hz = 1000 / time;
  const message = format(name, hz, n);
  return { hz, name, samples: n, message };
}

const noop = (x: any) => x;

/**
 * Measure the exectuion time of a synchronous function
 * @param name Test case name
 * @param fn Function that is measured
 */
export function measure(name: string, fn: () => any): Result {
  // Warmup
  test(noop as any, 10);

  const preStart = performance.now();
  test(fn, 10);
  const runtime = (performance.now() - preStart) / 10;

  const n = getMax(runtime);
  for (let i = 0; i < 10; i++) {
    test(fn, 50);
  }

  // JIT is warmed up, begin actual measuring
  const start = performance.now();
  const o = test(fn, n);
  const end = performance.now();

  return getResult(name, end - start, n);
}

const noopAsync = (x: any) => Promise.resolve(x);

/**
 * Measure the exectuion time of an asynchronous function (a function
 * that returns a `Promise`). Note that callback based functions are
 * not supported
 * @param name Test case name
 * @param fn Function that is measured
 */
export async function measureAsync(name: string, fn: () => Promise<any>) {
  // Warmup
  await testAsync(noopAsync as any, 10);

  const preStart = performance.now();
  await testAsync(fn, 10);
  const runtime = (performance.now() - preStart) / 10;

  const n = getMax(runtime);
  // JIT is warmed up, begin actual measuring
  const start = performance.now();
  const o = await testAsync(fn, n);
  const end = performance.now();

  return getResult(name, end - start, n);
}

export function format(name: string, hz: number, n: number) {
  const ops = yellow(
    new Intl.NumberFormat("en", {
      maximumFractionDigits: 3,
      useGrouping: true
    }).format(hz)
  );

  const opsFormat = yellow(ops) + gray(" ops/s ");
  const samples = gray(`(${n} samples)`);
  return name + gray(" x ") + opsFormat + samples;
}

/**
 * Measure the execution time of a function
 */
export async function benchmark(name: string, fn: () => any): Promise<Result> {
  const isAsync = await returnsPromise(fn);
  return isAsync ? measureAsync(name, fn) : measure(name, fn);
}

/**
 * Measure the execution time of a function and log the results to console
 */
export async function bench(name: string, fn: () => any): Promise<void> {
  const result = await benchmark(name, fn);
  // tslint:disable-next-line no-console
  console.log(result.message);
}
