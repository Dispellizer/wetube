import express from "express";
import routes from "../routes";
import {
  videoDetail,
  deleteVideo,
  getUpload,
  postUpload,
  getEditVideo,
  postEditVideo
} from "../controllers/videoController";
import { uploadVideo, onlyPriate } from "../middlewares";

const videoRouter = express.Router();

// Upload
videoRouter.get(routes.upload, onlyPriate, getUpload);
videoRouter.post(routes.upload, onlyPriate, uploadVideo, postUpload);

// Video Detail
videoRouter.get(routes.videoDetail(), videoDetail);

// Edit Video
videoRouter.get(routes.editVideo(), onlyPriate, getEditVideo);
videoRouter.post(routes.editVideo(), onlyPriate, postEditVideo);

// Delete Video
videoRouter.get(routes.deleteVideo(), onlyPriate, deleteVideo);

export default videoRouter;
