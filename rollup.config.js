import babel from "rollup-plugin-babel";
// import { uglify } from "rollup-plugin-uglify";
import pkg from "./package.json";
export default {
  input: "src/index.js",
  output: [
    {
      file: pkg.module,
      format: "es",
    },
    {
      file: pkg.browser,
      format: "umd",
      name: "EnumHub",
    },
  ],
  plugins: [
    babel({
      exclude: "node_modules/**",
    }),
    // process.env.NODE_ENV === "production" ? uglify() : null,
  ],
};
