/* tslint:disable:ban-types curly no-var-requires */
import * as chalk from "chalk";
const now = require("performance-now");

export interface Case {
  f: () => any;
  name: string;
}

export interface Result {
  name: string;
  time: number;
  displayTime: string;
}

export default class Benchmark {
  cases: Case[] = [];
  results: Result[] = [];
  iter: number;

  constructor(iter: number = 1000) {
    this.iter = iter;
  }

  add(name: string, f: () => any) {
    this.cases.push({ name, f });
    return this;
  }

  async run(iterations: number = 1000): Promise<Benchmark> {
    // Warmup
    for (let i = 0; i < 10; i++) {
      for (const item of this.cases) {
        item.f();
      }
    }

    const p = Promise.resolve();

    for (const test of this.cases) {
      const runs = [];
      for (let i = 0; i < this.iter; i++) {
        runs.push(true);
      }

      let start = 0;
      p.then(() => (start = now()));
      runs.forEach(run => p.then(() => test.f.call(null)));
      p.then(() => {
        const time = now() - start;

        this.results.push({
          name: test.name,
          time,
          displayTime: time.toFixed(5) + " ms",
        });
      });
    }

    await p;
    return this;
  }

  print(logger: (msg?: string) => any) {
    logger();

    this.results.map(res =>
      logger(res.name + ": " + chalk.yellow(res.displayTime)),
    );

    this.results = this.results.sort((a, b) => {
      if (a.time < b.time) return -1;
      if (a.time > b.time) return 1;
      return 0;
    });

    logger("\nFastest: " + chalk.green(this.results[0].name));
  }
}
