import { Router } from "express";

import {
  getUserProfile,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
} from "../controllers/user.controller.js";

import { upload } from "../middlewares/multer.middleware.js";
import verifyJWT from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser,
);

userRouter.route("/login").post(loginUser);

//secured routes
userRouter.route("/refreshToken").post(verifyJWT, refreshAccessToken);
userRouter.route("/getProfile").get(verifyJWT, getUserProfile);
userRouter.route("/logout").post(verifyJWT, logoutUser);
export default userRouter;
