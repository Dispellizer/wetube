"use strict";

var _passport = _interopRequireDefault(require("passport"));

var _passportGithub = _interopRequireDefault(require("passport-github"));

var _passportNaver = _interopRequireDefault(require("passport-naver"));

var _User = _interopRequireDefault(require("./models/User"));

var _userController = require("./controllers/userController");

var _routes = _interopRequireDefault(require("./routes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_passport["default"].use(_User["default"].createStrategy());

_passport["default"].use(new _passportGithub["default"]({
  clientID: process.env.GH_ID,
  clientSecret: process.env.GH_SECRET,
  callbackURL: "http://localhost:4000".concat(_routes["default"].githubCallback)
}, _userController.githubLoginCallback) //  githubLoginCallback은 사용자가 깃헙으로 갔다가 돌아오면서
//  사용자 정보를 가져오면 이 함수가 실행된다.
//  모든것이 다 정상적으로 작동할때 githubLoginCallback를 실행
);

_passport["default"].use(new _passportNaver["default"]({
  clientID: process.env.NAVER_ID,
  clientSecret: process.env.NAVER_SECRET,
  callbackURL: "http://localhost:4000".concat(_routes["default"].naverCallback)
}, _userController.naverLoginCallback));

_passport["default"].serializeUser(_User["default"].serializeUser()); // passport에게 쿠키는 오직 user.id만 담아서 보내라는 뜻


_passport["default"].deserializeUser(_User["default"].deserializeUser());