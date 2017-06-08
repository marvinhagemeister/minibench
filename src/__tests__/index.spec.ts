import { assert as t } from "chai";
import Benchmark, { Result } from "../index";

function normalize(res: Result) {
  if (res.displayTime.length > 3) {
    res.displayTime = "100 ms";
  }

  if (res.time > 0) {
    res.time = 1;
  }
  return res;
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe("Benchmark", () => {
  it("should run test cases", async () => {
    const bench = await new Benchmark(2)
      .add("test1", () => 1)
      .add("test2", () => 2)
      .run();

    const res = bench.results.map(normalize);

    t.deepEqual(res, [
      {
        displayTime: "100 ms",
        name: "test1",
        time: 1,
      },
      {
        displayTime: "100 ms",
        name: "test2",
        time: 1,
      },
    ]);
  });

  it("should run tests asynchronously", async () => {
    const bench = await new Benchmark(2)
      .add("test1", () => delay(1))
      .add("test2", () => delay(2))
      .run();

    const res = bench.results.map(normalize);

    t.deepEqual(res, [
      {
        displayTime: "100 ms",
        name: "test1",
        time: 1,
      },
      {
        displayTime: "100 ms",
        name: "test2",
        time: 1,
      },
    ]);
  });

  it("should print result", async () => {
    const bench = await new Benchmark(2)
      .add("test2", () => 2)
      .add("test1", () => 1)
      .run();

    let result = "";
    const logger = (msg?: string) => {
      result += msg + "\n";
    };

    bench.print(logger);

    t.equal(/Fastest/g.test(result), true);
  });
});
