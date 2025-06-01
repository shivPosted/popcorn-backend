import { Router } from "express";

import {
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
} from "../controllers/user.controller.js";

import { upload } from "../middlewares/multer.middleware.js";
import verifyJWT from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.route("/register").post(upload.single("avatar"), registerUser);
userRouter.route("/login").post(loginUser);

//secured routes
userRouter.route("/refreshToken").post(verifyJWT, refreshAccessToken);

userRouter.route("/logout").post(verifyJWT, logoutUser);
export default userRouter;
