import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import passport from "passport";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import { localsMiddleWare } from "./middlewares";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import globalRouter from "./routers/globalRouter";
import routes from "./routes";

import "./passport";

const app = express();

const CookieStore = MongoStore(session);

app.use(helmet());
app.set("view engine", "pug");
app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("static"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    // 무작위 문자열로 쿠키에 들어있는 session ID를 암호화 하기 위한것
    resave: true,
    // 세션을 강제로 저장하게 합니다
    saveUninitialized: false,
    // 초기화 하지 않은(uninitialized)세션을 저장소에 저장합니다
    store: new CookieStore({ mongooseConnection: mongoose.connection })
    // 이 쿠키 저장소에 저장, 이 저장소를 mongo와 연결시켜줘야함
  })
);
app.use(passport.initialize());
// passport 초기화
app.use(passport.session());
// session에 저장

app.use(localsMiddleWare);

app.use(routes.home, globalRouter);
app.use(routes.users, userRouter);
app.use(routes.videos, videoRouter);

export default app;
