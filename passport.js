import passport from "passport";
import User from "./models/User";

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
// passport에게 쿠키는 오직 user.id만 담아서 보내라는 뜻
passport.deserializeUser(User.deserializeUser());
