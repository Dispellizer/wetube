import passport from "passport";
import GithubStrategy from "passport-github";
import NaverStrategy from "passport-naver";
import User from "./models/User";
import {
  githubLoginCallback,
  naverLoginCallback
} from "./controllers/userController";
import routes from "./routes";

passport.use(User.createStrategy());

passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GH_ID,
      clientSecret: process.env.GH_SECRET,
      callbackURL: `http://localhost:4000${routes.githubCallback}`
    },
    githubLoginCallback
  )
  //  githubLoginCallback은 사용자가 깃헙으로 갔다가 돌아오면서
  //  사용자 정보를 가져오면 이 함수가 실행된다.
  //  모든것이 다 정상적으로 작동할때 githubLoginCallback를 실행
);

passport.use(
  new NaverStrategy(
    {
      clientID: process.env.NAVER_ID,
      clientSecret: process.env.NAVER_SECRET,
      callbackURL: `http://localhost:4000${routes.naverCallback}`
    },
    naverLoginCallback
  )
);

passport.serializeUser(User.serializeUser());
// passport에게 쿠키는 오직 user.id만 담아서 보내라는 뜻
passport.deserializeUser(User.deserializeUser());
