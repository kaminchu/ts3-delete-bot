import babel from "rollup-plugin-babel";
import babelrc from "babelrc-rollup";
import { uglify } from "rollup-plugin-uglify";

export default {
  entry: "src/index.js",
  dest: "index.js",
  format: "umd",
  plugins: [
    babel(babelrc()),
    uglify()
  ]
}