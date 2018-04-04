import { bench } from "./index";
import Benchmark from "benchmarkjs-pretty";

export const delay = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));

export async function perf() {
  await bench("foo", () => 1 + 1);
  await bench("foo2", () => 1 ** 1);
  await bench("fibonacci", () => fibonacci(10));
  await bench("recfibonacci", () => recursiveFibonacci(10));
  await bench("foo3", () => delay(2));
  await new Benchmark("pretty")
    .add("foo", () => 1 + 1)
    .add("foo2", () => 1 ** 1)
    .add("fibonacci", () => fibonacci(10))
    .add("rec fibonacci", () => recursiveFibonacci(10))
    .add("foo3", () => delay(2))
    .run();
}

perf();

function fibonacci(num: number) {
  let a = 1;
  let b = 0;
  let temp;

  while (num >= 0) {
    temp = a;
    a = a + b;
    b = temp;
    num--;
  }

  return b;
}

function recursiveFibonacci(n: number): number {
  if (n === 1 || n === 2) return 1;
  return recursiveFibonacci(n - 1) + recursiveFibonacci(n - 2);
}
