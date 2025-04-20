import { Router } from "express";
import {
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
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
  registerUser
);

router.route("/login").post(loginUser);

//secured routes (work done after user is logged in)
router.route("/logout").post(verifyJWT, logoutUser); //verifyJWT er por logoutUser gets executed because of the next() flag that we used ./middlewares/auth.middleware.js
router.route("/refresh-token").post(refreshAccessToken);

export default router;
