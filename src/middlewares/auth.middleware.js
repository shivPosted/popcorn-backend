import User from "../models/user.model.js";
import ApiError from "../util/ApiError.js";
import asyncHandler from "../util/asyncHandler.js";
import jwt from "jsonwebtoken";

const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const recievedToken =
      req.cookies?.accessToken ||
      req.headers("Authorization")?.split(" ")?.[1] ||
      null;

    if (!recievedToken)
      throw new ApiError(400, "No access token recieved or expired token");
    const decodedToken = jwt.verify(
      recievedToken,
      process.env.ACCESS_TOKEN_SECRET,
    );

    if (!decodedToken)
      throw new ApiError(404, "Invalid or expired token, please log in again");

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken",
    );

    if (!user)
      throw new ApiError(
        400,
        "problem with verifying token please log in again",
      );

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(400, error.message || "Can not verify jwt");
  }
});
export default verifyJWT;
