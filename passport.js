import passport from "passport";
import GithubStrategy from "passport-github";
import FacebookStrategy from "passport-facebook";
import User from "./models/User";
import {
  githubLoginCallback,
  facebookLoginCallback
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
  new FacebookStrategy(
    {
      clientID: process.env.FB_ID,
      clientSecret: process.env.FB_SECRET,
      callbackURL: `https://26296446.ngrok.io${routes.facebookCallback}`,
      profileFields: ["id", "displayName", "photos", "email"],
      scope: ["public_profile", "email"]
    },
    facebookLoginCallback
  )
);

passport.serializeUser(User.serializeUser());
// passport에게 쿠키는 오직 user.id만 담아서 보내라는 뜻
passport.deserializeUser(User.deserializeUser());
