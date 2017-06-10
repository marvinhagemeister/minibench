import { assert as t } from "chai";
import Benchmark, { Result } from "../index";

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const noop = () => {
  /* noop */
};

describe("Benchmark", () => {
  it("should run test cases", async () => {
    const res = await new Benchmark({ iterations: 2, logger: noop })
      .add("test1", () => 1)
      .add("test2", () => 2)
      .run();

    t.equal(res[0].time < res[1].time, true);
  });

  it("should run tests asynchronously", async () => {
    const res = await new Benchmark({ iterations: 2, logger: noop })
      .add("test1", () => delay(1))
      .add("test2", () => delay(2))
      .run();

    t.equal(res[0].time < res[1].time, true);
  });

  it("should print result", async () => {
    let result = "";
    const logger = (msg?: string) => {
      result += msg + "\n";
    };

    await new Benchmark({ iterations: 2, logger })
      .add("test2", () => 2)
      .add("test1", () => 1)
      .run();

    t.equal(/Fastest/g.test(result), true);
  });
});
