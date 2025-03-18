/*wherever we need to upload a file we inject multer*/

import multer from "multer";

//we save in disk storage not in memory cause memory might get filled
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

export const upload = multer({
  storage,
});
//we will call this method in those routes where we will recieve files as a middleware
