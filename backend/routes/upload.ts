import express, { Request, Response } from "express";
import multer from "multer";
import { pool } from "../db/db";
const uploadRouter = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, "file" + file.fieldname + Date.now());
  },
});

const upload = multer({ storage: storage }); //directory for upload files

uploadRouter.post(
  "/documents",
  upload.single("file"),
  async (req, res, next) => {
    if (req.file) {
      const name = req.file.originalname;
      const type = req.file.mimetype;
      const userID = req.userId;
      const size = req.file.size;
      const path = req.file.path;
      const ProjectID = req.body.selectedProject;
      let result = await pool.query(
        "INSERT INTO fileuploads (Name, FileType,UploadUserID,Size, Path,ProjectID) VALUES(?,?,?,?,?,?)",
        [name, type, userID, size, path, ProjectID]
      );
      if (result) {
        res.json({
          message: `${result.affectedRows} file has successfully uploaded`,
          status: "success",
        });
      } else {
        res.json({
          message: "Internal Server Error at uploading",
          status: "error",
        });
      }
    }
  }
);

uploadRouter.get("/fileList", async (req, res) => {
  const selectedProject = req.query.ProjectID;
  let [result] = await pool.query(
    `SELECT fileuploads.ID, Name, FileType, FirstName,UploadDate,Size 
    FROM fileuploads 
    LEFT join user on fileuploads.UploadUserID = user.ID WHERE Deleted_at IS NULL AND ProjectID =?`,
    [selectedProject]
  );
  if (result) {
    try {
      res.json({ message: "successfully loaded data", result: result });
    } catch (error) {
      res.json({ message: error, status: "error" });
    }
  }
});

export default uploadRouter;
