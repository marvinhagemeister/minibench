import sourcemaps from "rollup-plugin-sourcemaps";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";

export default {
  input: "dist/es/index.js",
  output: {
    file: "dist/browser.js",
    format: "iife",
    name: "minibench",
    sourcemap: true,
    globals: {
      perf_hooks: "{ performance: performance }",
    },
  },
  plugins: [sourcemaps(), commonjs(), resolve()],
};
