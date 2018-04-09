import * as t from "assert";
import { benchmark } from "./index";

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function work(n: number) {
  let result = 0;
  for (let i = 0; i < n; i++) {
    result = i + 1;
  }
  return result;
}

describe("Benchmark", () => {
  it("should run test cases", async () => {
    const res = [];
    res[0] = await benchmark("foo", () => work(1));
    res[1] = await benchmark("foo2", () => work(10));
    t.equal(res[0].hz > res[1].hz, true);
  });

  it("should run tests asynchronously", async () => {
    const res = [];
    res[0] = await benchmark("foo", () => delay(1));
    res[1] = await benchmark("foo2", () => delay(2));
    t.equal(res[0].hz > res[1].hz, true);
  });
});
