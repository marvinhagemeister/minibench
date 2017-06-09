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
new Benchmark()
  .add("test1", () => foo())
  .add("test2", () => bar())
  .run()
  .print(console.log);
```
