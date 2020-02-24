const path = require("path");
const autoprefixer = require("autoprefixer");
const ExtractCSS = require("extract-text-webpack-plugin");
// 이게 있기 때문에 webpack에게 css를 가지고 뭘 어떻게 할지 알려준다.

const MODE = process.env.WEBPACK_ENV;
// WEBPACK_ENV는 package.jsion 에서 사용했던 이름과 같은 이름이어야 한다.
const ENRTY_FILE = path.resolve(__dirname, "assets", "js", "main.js");
const OUTPUT_DIR = path.join(__dirname, "static");

const config = {
  entry: ["@babel/polyfill", ENRTY_FILE],
  mode: MODE,
  module: {
    // 모듈이 발견될때마다
    rules: [
      // 다음과 같은 룰을 따르라
      {
        test: /\.(js)$/,
        use: [
          {
            loader: "babel-loader"
          }
        ]
      },
      {
        test: /\.(scss)$/, // scss 파일만 찾는 정규식
        use: ExtractCSS.extract([
          // scss파일을 찾고나서 해야할 것들을 use에 적어준다
          // 이경우에는ExtractCss.extract plugin을 사용하고
          // 이 plugin 내부에서 또 plugin을 사용, scss --> css로 통역하기위해서
          {
            loader: "css-loader"
            // 이 loader는 webpack이 css를 이해할 수 있도록 한다
          },
          {
            loader: "postcss-loader",
            options: {
              plugins() {
                return [autoprefixer({ browsers: "cover 99.5%" })];
                // 99.5%의 브라우저들을 커버하도록 한다는 의미
              }
            }
            // css를 받아서 우리가 얘한테 주는 plugin을 가지고 css를 변환해줌
            // ex) postcss-loader를 사용하는데 ie에 호환되게끔 만들어줘 라고 할수있음
          },
          {
            loader: "sass-loader"
            // sass, scss를 받아서 일반 css로 바꿔준다
          }
        ])
      }
    ]
  },
  output: {
    path: OUTPUT_DIR,
    filename: "[name].js"
  },
  plugins: [new ExtractCSS("styles.css")]
};

module.exports = config;
