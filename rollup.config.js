import { babel } from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
// import html from "@rollup/plugin-html";
// import serve from "rollup-plugin-serve";
// import { uglify } from "rollup-plugin-uglify";
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
    {
      file: pkg.browser,
      format: "umd",
      name: "EnumHub",
    },
  ].map((opt) => ({
    globals: {
      "@babel/runtime/regenerator": "regeneratorRuntime",
      "@babel/runtime/helpers/asyncToGenerator": "asyncToGenerator",
      "@babel/runtime/helpers/classCallCheck": "classCallCheck",
      "@babel/runtime/helpers/createClass": "createClass",
      "@babel/runtime/helpers/defineProperty": "defineProperty",
    },
    ...opt,
  })),

  plugins: [
    // serve({
    //   port: "3000",
    // }),
    resolve(),
    babel({
      exclude: "node_modules/**",
      babelHelpers: "runtime",
    }),
    // process.env.NODE_ENV === "production" ? uglify() : null,
  ],
};
