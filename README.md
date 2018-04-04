# minibench

`minibench` is a tiny benchmarking library inspired by preact's minimal
benchmark suite and Google Chrome's v8 performance measurement code. Under the
hood it uses the recently introduced [performance.now](https://developer.mozilla.org/en-US/docs/Web/API/Performance/now)
api.

Before any measuring is done, `minibench` automatically warms up the JIT-cache
guaranting stable results. Many other benchmarking don't do this, leading to
misleading measurements, where the first one will always be faster than all
later measurements.

Compared to [benchmark.js](https://github.com/bestiejs/benchmark.js/) it has a
much needed promise-based api and is faster to run/bundle.

**_Note:_** _Due to the recent `Meltdown` and `Spectre` attacks, high-resolution
timers are not really high resolution anymore. This affects all browsers. Some
round the measured time to 2ms, others introduce slight randomness. So don't
compare the results to the last digits. Keep this in mind when benchmarking in
browser environments._

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
  await bench("foo", () => 1 * 1);
  await bench("bar", () => 2 + 2);
}
perf();
// logs (will be colorized in a true TTY):
// foo x 6,926 ops/s (258 ticks)
// bar x 5,128 ops/s (343 ticks)
```

Or if you do not want to log out to the console:

```js
import { benchmark } from "@marvinh/minibench";

benchmark("foo", () => 1 * 1).then(result => {
  // result contains raw data about the benchmark
});
```

## License

`MIT`, see [LICENSE file](./LICENSE.md).
