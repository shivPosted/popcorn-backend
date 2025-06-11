import User from "../models/user.model.js";
import ApiError from "../util/ApiError.js";
import Apiresponse from "../util/ApiResponse.js";
import asyncHandler from "../util/asyncHandler.js";
import uploadOnCloudinary from "../util/cloudinary.js";
import bcrypt from "bcrypt";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // ✅ true only in production
  sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  maxAge: 3 * 24 * 60 * 60 * 1000, //for persisting cookies in browser for 3 days
};

const generateAccessAndRefreshToken = async function (userId) {
  try {
    if (!userId) return null;

    const user = await User.findById(userId);
    if (!user) throw new ApiError(500, "Can not generate access token");

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = await bcrypt.hash(refreshToken, 12);

    user.save({
      validateBeforeSave: false,
    });

    return { accessToken, refreshToken };
  } catch (error) {
    throw error;
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { userName = "", fullName = "", password = "", email = "" } = req.body;

  if (
    [userName, fullName, password, email].some(
      (field) => field.trim() === "" || field === null,
    )
  )
    throw new ApiError(400, "All the field are required");

  const userExists = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (userExists)
    throw new ApiError(400, "User already exists enter unique user info");

  // NOTE: for uploading from local path
  // const localAvatarPath = req.file?.path;
  // if (!localAvatarPath) throw new ApiError(400, "Avatar file is required");
  // const avatar = await uploadOnCloudinary(localAvatarPath);

  //NOTE: for uploading from buffer
  const avatarBuffer = req.files?.avatar?.[0].buffer;

  if (!avatarBuffer) throw new ApiError(404, "Avatar file is not found");

  const avatar = await uploadOnCloudinary(avatarBuffer);
  if (!avatar) throw new ApiError(500, "Could not upload to cloudinary");

  const avatarObj = {
    url: avatar.secure_url,
    publicId: avatar.public_id,
  };

  const user = await User.create([
    {
      fullName,
      email,
      password,
      userName: userName.toLowerCase(),
      avatar: avatarObj,
    },
  ]);

  const createdUser = await User.findById(user?.[0]._id).select(
    "-password -refreshToken",
  );

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    createdUser._id,
  ); //logging in user at succesfull creation

  return res
    .status(201)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new Apiresponse("User created and logged in successfully", 201, {
        ...createdUser.toObject(), //toObject() is an inbuilt mogodb method that helps you to create object with only relevant info
        avatar: createdUser.avatar.url,
      }),
    );
});

const loginUser = asyncHandler(async (req, res) => {
  const { userName, email, password } = req.body;

  if (!userName && !email)
    throw new ApiError(400, "username or email required");

  if (!password) throw new ApiError(400, "Please enter password");

  const user = await User.findOne({
    $or: [{ userName }, { email }],
  }).select("-refreshToken");

  if (!user) throw new ApiError(404, "User not found");

  const isUserAuthenticated = await user.isPasswordCorrect(password);
  if (!isUserAuthenticated) return new ApiError(404, "Wrong login credentials");

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id,
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new Apiresponse("User logged in successfully", 200, {
        ...loggedInUser.toObject(),
        avatar: loggedInUser.avatar.url,
      }),
    );

  return res.status(200).json(new Apiresponse("logged in succesfull"));
});

const logoutUser = asyncHandler(async (req, res) => {
  if (!req.user)
    throw new ApiError(404, "User already logged out or wrong request");

  await User.findOneAndUpdate(req.user?._id, {
    $set: {
      refreshToken: null,
    },
  });

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new Apiresponse("User logged out successfully", 200));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  if (!req.user)
    throw new ApiError(400, "No user found please log in again to continue");

  const recievedToken =
    req.cookies?.refreshToken ||
    req.headers["Authorization"]?.split(" ")?.[1] ||
    req.body?.refreshToken;

  if (!recievedToken)
    throw new ApiError(404, "Refresh token expired please log in again");

  const user = await User.findById(req.user?._id).select("-password");

  if (!user)
    throw new ApiError(
      404,
      "No user found, or access token expired please log in again",
    );

  const isUserValid = bcrypt.compare(recievedToken, user.refreshToken);

  if (!isUserValid) throw new ApiError(404, "User not found");

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id,
  );

  if (!accessToken)
    throw new ApiError(500, "Can not generate jwt, internal server error");

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(new Apiresponse("Access token succesully refreshed", 201));
});

const getUserProfile = asyncHandler(async (req, res) => {
  if (!req.user)
    throw new ApiError(404, "Authentication failed please log in again");

  const user = await User.findById(req.user?._id).select(
    "-password -refreshToken",
  );
  if (!user) throw new ApiError(404, "Invalid user, log in again");

  return res.status(200).json(
    new Apiresponse("User profile fetched", 200, {
      ...user.toObject(),
    }),
  );
});

export {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  getUserProfile,
};
