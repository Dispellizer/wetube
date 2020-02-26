import passport from "passport";
import GithubStrategy from "passport-github";
import User from "./models/User";
import { githubLoginCallback } from "./controllers/userController";

passport.use(User.createStrategy());

passport.use(
  new GithubStrategy({
    clientID: process.env.GH_ID,
    clientSecret: process.env.GH_SECRET,
    callbackURL: "http://localhost:4000/auth/github/callback"
  }),
  githubLoginCallback
  //  githubLoginCallback은 사용자가 깃헙으로 갔다가 돌아오면서
  //  사용자 정보를 가져오면 이 함수가 실행된다.
);

passport.serializeUser(User.serializeUser());
// passport에게 쿠키는 오직 user.id만 담아서 보내라는 뜻
passport.deserializeUser(User.deserializeUser());
