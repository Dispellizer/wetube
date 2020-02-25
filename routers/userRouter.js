import express from "express";
import routes from "../routes";
import {
  userDetail,
  editProfile,
  changePassword
} from "../controllers/userController";
import { onlyPriate } from "../middlewares";

const userRouter = express.Router();

userRouter.get(routes.editProfile, onlyPriate, editProfile);
userRouter.get(routes.changePassword, onlyPriate, changePassword);
userRouter.get(routes.userDetail(), userDetail);

export default userRouter;
