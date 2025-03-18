import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

//always use app.use for middleware functions
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }) //this is like cors er nijer obj ache jekhane origin set kora jabe and many more (CTRL+space for more commands)
);

app.use(express.json({ limit: "16kb" })); //json theke jokhon data asbe(like forms) otr limit
app.use(express.urlencoded({ extended: true, limit: "16kb" })); //url theke jokhon data asbe.
app.use(express.static("public")); //images and all
app.use(cookieParser()); //CRUD options on cookies given by users
export { app };
