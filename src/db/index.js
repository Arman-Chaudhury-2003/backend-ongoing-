import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const conn = `${process.env.MONGODB_URL}/${DB_NAME}`;
    // console.log(conn);
    const connectionInstance = await mongoose.connect(conn);
    console.log(
      `MONGO DB connected!! Host: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MONGO_DB connection error", error);
    process.exit(1);
  }
};

export default connectDB;
