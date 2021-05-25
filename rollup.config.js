import { babel } from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import pkg from "./package.json";

export default {
  input: "src/index.js",
  external: [/@babel\/runtime/],
  output: [
    {
      file: pkg.module,
      format: "es",
    },
    {
      file: pkg.main,
      format: "cjs",
      exports: "default",
    },
    // {
    //   file: pkg.browser,
    //   format: "umd",
    //   name: "EnumHub",
    // },
  ],
  plugins: [
    resolve(),
    babel({
      exclude: "node_modules/**",
      babelHelpers: "runtime",
    }),
  ],
};
