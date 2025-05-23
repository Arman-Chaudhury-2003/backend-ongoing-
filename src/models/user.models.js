import {
  ACCESS_TOKEN_EXPIRY,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRY,
  REFRESH_TOKEN_SECRET,
} from "../config.js";
import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken"; //bearer token
import bcrypt from "bcrypt"; //encrypt the password

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, //cloudnary url
      required: true,
    },
    coverImage: {
      type: String,
      required: true,
    },
    watchhistory: [
      {
        type: Schema.Types.ObjectID,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

//pre is a mongoose hook that does (any function) just before the data being saved(basically middleware).
//we dont have context(this.) in arrow function so we use the "function(){}"
//middleware always has the next access, so it can pass the flag to the response (req,res,"next").
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); //if password is *not* modified return to next flag

  this.password = await bcrypt.hash(this.password, 10); //else encrypt the password with 10 rounds
  next();
});

//custom method jeta amra banabo
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
  //bcrypt also compares the password from user password to the db password that is hashed
};

//signature for the fields needed
//payload_er_naam: database_theke_asa_value
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },
    ACCESS_TOKEN_SECRET,
    {
      expiresIn: ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    REFRESH_TOKEN_SECRET,
    {
      expiresIn: REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
