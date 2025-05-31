import User from "../models/user.model.js";
import ApiError from "../util/ApiError.js";
import Apiresponse from "../util/ApiResponse.js";
import asyncHandler from "../util/asyncHandler.js";
import uploadOnCloudinary from "../util/cloudinary.js";

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

export { registerUser };
