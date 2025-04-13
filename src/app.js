import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { CORS_ORIGIN } from "./config.js";
import userRouter from "./routes/user.routes.js";
const app = express();

//always use app.use for middleware functions
app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
  }) //this is like cors er nijer obj ache jekhane origin set kora jabe and many more (CTRL+space for more commands)
);

app.use(express.json({ limit: "16kb" })); //json theke jokhon data asbe(like forms) otr limit
app.use(express.urlencoded({ extended: true, limit: "16kb" })); //url theke jokhon data asbe.
app.use(express.static("public")); //images and all
app.use(cookieParser()); //CRUD options on cookies given by users

//routes import

//routes declaration
app.use("/api/v1/users", userRouter);

export { app };
