import express, { Request, Response } from "express";
import multer from "multer";
import fs from "fs";
const uploadRouter = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    // fs.writeFileSync(file.fieldname + "-" + Date.now());
    cb(null, file.fieldname + "-" + Date.now());
  },
});

const upload = multer({ storage: storage }); //directory for upload files

uploadRouter.post("/documents", upload.array("file"), (req, res, next) => {
  // the code after the file uploaded
  res.send("File uploaded successfully.");
});

export default uploadRouter;
