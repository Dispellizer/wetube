const path = require("path");
const ExtractCSS = require("extract-text-webpack-plugin");
// 이게 있기 때문에 webpack에게 css를 가지고 뭘 어떻게 할지 알려준다.

const MODE = process.env.WEBPACK_ENV;
// WEBPACK_ENV는 package.jsion 에서 사용했던 이름과 같은 이름이어야 한다.
const ENRTY_FILE = path.resolve(__dirname, "assets", "js", "main.js");
const OUTPUT_DIR = path.join(__dirname, "static");

const config = {
  entry: ENRTY_FILE,
  mode: MODE,
  module: {
    rules: [
      {
        test: /\.(scss)$/, // scss 파일만 찾는 정규식
        use: ExtractCSS.extract([
          // scss파일을 찾고나서 해야할 것들을 use에 적어준다
          {
            loader: "css-loader"
            // 이 loader는 webpack이 css를 이해할 수 있도록 한다
          },
          {
            loader: "postcss-loader"
          },
          {
            loader: "sass-loader"
          }
        ])
      }
    ]
  },
  output: {
    path: OUTPUT_DIR,
    filename: "[name].[format]"
  }
};

module.exports = config;
