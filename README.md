# minibench

`minibench` is a tiny benchmarking library inspired by preact's minimal
benchmark suite and Google Chrome's v8 performance measurement code. Under the
hood it uses the recently introduced [performance.now](https://developer.mozilla.org/en-US/docs/Web/API/Performance/now)
api.

Before any measuring is done, `minibench` automatically warms up the JIT-cache
guaranting stable results. Many other benchmarking don't do this, leading to
misleading measurements, where the first one will always be faster than all
later measurements.

## Installation

```bash
# npm
npm install --dev @marvinh/minibench

# yarn
yarn add -D @marvinh/minibench
```

## Usage

```js
import { perf } from "@marvinh/minibench";

async function perf() {
  await bench("foo", () => doSomething());
  await bench("bar", () => doSomethingElse());
}
perf();
// logs (will be colorized in a true TTY):
// foo x 6,926 ops/s (258 samples)
// bar x 5,128 ops/s (343 samples)
```

Or if you do not want to log out to the console:

```js
import { benchmark } from "@marvinh/minibench";

benchmark("foo", () => doSomething()).then(result => {
  // result contains raw data about the benchmark
});
```

## FAQ

### Why should I use this instead of benchmarkjs?

[benchmark.js](https://github.com/bestiejs/benchmark.js/) is awesome and the main inspirations for minibench. They both share the same goal, but differ quite a bit in the approach they choose. The most noticeable difference is a much nicer api for async tests and native support for `Promises`.

`minibench` runs the code exactly as in the real world and doesn't do any black magic with function bodies. It deliberately leaves out the typical t-distribution based analysis, because they give a false sense of accuracy in a heavily jitted language such as JavaScript, where the population is very different for each single benchmark run.

### How should I interpret the results?

As always, when looking at performance you should look out for a minimal improvement of `2-3x` before even thinking about rewriting your app/algorithm. Everthing below that threshold is most likely not worth the effort.

### How do I know that I measure the right thing?

Benchmarking a jitted language is not always straightforward. Make sure that your test code actually runs something and is not optimized away by the engine. If that happens you are only measuring how fast the engine detects that your code does nothing. This is mostly caused by unused variables or unused code inside for loops. Watch this excellent [talk by Vyacheslav Egorov](https://www.youtube.com/watch?v=g0ek4vV7nEA) (a v8 engineer) about how to properly write benchmarks for JavaScript.

### How does Meltdown and Spectre affect benchmarking?

Due to the recent `Meltdown` and `Spectre` attacks, high-resolution
timers are not really high resolution anymore. This affects all browsers. Some
round the measured time to 2ms, others introduce slight randomness. So don't
compare the results to the last digits. Keep this in mind when benchmarking in
browser environments.

## License

`MIT`, see [LICENSE file](./LICENSE.md).
