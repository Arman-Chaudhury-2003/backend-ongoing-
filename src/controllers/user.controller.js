import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/APIError.js";
import { user } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/coludinary.js";
import { ApiResponse } from "../utils/APIResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  // validation - not empty
  // check if user already exists: username, email
  // check for images and avatar
  // upload avatar on cloudinary
  // create user object - create entry in db
  // remove password and refresh token from response
  // check for user creation
  // return res

  const { fullName, email, username, password } = req.body;
  console.log("email: ", email);

  //checks the field is empty or not for all the emements in the array
  //which ever field returns true means its empty
  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All feilds are required");
  }

  //if user exists throw error
  const existedUser = user.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "User Already Exists");
  }

  //if no avatar/coverimage is given give path and throw error
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.fils?.avatar[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "avatar needed");
  }
  //await cause upload hote time lage
  //upload hobr por server e save hoy
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "avatar needed");
  }

  //user database is being created
  const User = await user.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });
  //this does not display the mentioned feilds like password and refresh token is this case
  const createdUser = await User.findById(User._id).select(
    "-password -refreshtoken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User is successfully registered"));
});

export { registerUser };
