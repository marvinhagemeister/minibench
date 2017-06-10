# MiniBench

Minimal benchmark library for nodejs.

## Installation

```bash
# npm
npm install --dev  minibench

# yarn
yarn add --dev minibench
```

## Usage

```js
// optional options
const options {
  iterations: 1000,
  logger: console.log,
};

new Benchmark(options) // options are optional
  .add("test1", () => foo())
  .add("test2", () => bar())
  .run()
```
