import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";
import { PORT } from "./config.js";
// dotenv.config({
//   path: "./.env",
// });

connectDB()
  .then(() => {
    app.listen(PORT || 8000, () => {
      console.log(`server is running at port: ${process.env.PORT}`);
    });
  })

  .catch((err) => {
    console.log("MONGO db connection failed!! ", err);
  });
