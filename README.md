# minibench

Minimal benchmark library that supports sync and async benchmarks. Works in node
and in the browser.

## Installation

```bash
# npm
npm install --dev  minibench

# yarn
yarn add -D minibench
```

## Usage

```js
async function perf() {
  await bench("foo", () => foo());
  await bench("bar", () => bar());
}
perf();
// logs:
// foo x 6,926 ops/s (258 ticks)
// bar x 5,128 ops/s (343 ticks)
```
