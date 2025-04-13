import { ACCESS_TOKEN_SECRET } from "../config";
import { ApiError } from "../utils/APIError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken";
import { user } from "../models/user.models";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, ACCESS_TOKEN_SECRET);

    const user = await user
      .findById(decodedToken?._id)
      .select("-password -refreshToken");

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }
    req.user = user;
    next(); //when we do this next() it means after this we outta execute the next one
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});
