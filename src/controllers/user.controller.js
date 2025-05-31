import User from "../models/user.model.js";
import ApiError from "../util/ApiError.js";
import Apiresponse from "../util/ApiResponse.js";
import asyncHandler from "../util/asyncHandler.js";
import uploadOnCloudinary from "../util/cloudinary.js";
import bcrypt from "bcrypt";

const cookieOptions = {
  httpOnly: true,
  secure: true,
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

  const localAvatarPath = req.file?.path;

  if (!localAvatarPath) throw new ApiError(400, "Avatar file is required");

  const avatar = await uploadOnCloudinary(localAvatarPath);

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

  return res.status(201).json(
    new Apiresponse("User created successfully", 201, {
      ...createdUser.toObject(),
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

export { registerUser, loginUser };
