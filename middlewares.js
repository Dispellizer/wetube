import multer from "multer";
import routes from "./routes";

export const multerVideo = multer({ dest: "uploads/videos/" });

export const localsMiddleWare = (req, res, next) => {
  res.locals.siteName = "WeTube";
  res.locals.routes = routes;
  res.locals.user = req.user || null;
  // passport가 object를 요청(request)에도 올려준다.
  console.log(req.user);
  next();
};

export const uploadVideo = multerVideo.single("videoFile");
