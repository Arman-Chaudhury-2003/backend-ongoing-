import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/APIError.js";
import { user } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/APIResponse.js";

//whats going on :-
const generateAccessandRefreshTokens = async (
  userId //userID passed
) => {
  try {
    const user = await user.findById(userID); //check with user in db with this userID
    //access and refresh token generated asper the user
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    //refresh token gets saved in db (pore match korbo if refresh token genrated == the refresh token in db)
    return { accessToken, refreshToken };
    //retun
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access token"
    );
  }
};
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

  //checks the field is empty or not for all the emements in the array
  //which ever field returns true means its empty
  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All feilds are required");
  }

  //if user exists throw error
  const existedUser = await user.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(
      409,
      "User Already Exists with given email and Username"
    );
  }
  // console.log(req.body);
  // console.log(req.files);

  //if no avatar/coverimage is not given give path and throw error
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required.");
  }

  //await cause upload hote time lage
  //upload hobr por server e save hoy
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar || !avatar.url) {
    throw new ApiError(400, "Failed to upload avatar");
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
  const createdUser = await user
    .findById(User._id)
    .select("-password -refreshToken");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong");
  }

  //in response we will send the json with message and data
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User is successfully registered"));
});

const loginUser = asyncHandler(async (req, res) => {
  // req body -> data
  // username or email
  // find user
  // password check
  // access and refresh token
  // send cookies

  const { email, username, password } = req.body; //getting data from req.body
  if (!username || !email) {
    //EITHER username or email is needed to login
    throw new ApiError(400, "username or password is requird");
  }

  const user = await user.findOne({
    //find user based on username or email
    $or: [{ username }, { email }],
  });

  //if no such user is found
  if (!user) {
    throw new ApiError(404, "User dose not exist");
  }
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Password incorrect");
  }

  const { accessToken, refreshToken } = await generateAccessandRefreshTokens(
    user._ID
  );

  const loggedInUser = await user
    .findById(user._id)
    .select("-password -refreshToken");

  const options = {
    httpOnly: true,
    secure: true,
  };

  // in response we will give code 200 and get cookies from user
  return (
    res
      .status(200)
      //cookie we get in ("key", value) pair
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            user: loggedInUser,
            accessToken,
            refreshToken,
          },
          "User logged In Successfully"
        )
      )
  );
});

const logoutUser = asyncHandler(async (req, res) => {
  await user.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refresh", options)
    .json(new ApiResponse(200, {}, "User Logged Out"));
});

export { registerUser, loginUser, logoutUser };
