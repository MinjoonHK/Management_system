import express, { Request, Response } from "express";
import multer from "multer";
import { pool } from "../db/db";
import { updateStatusForm } from "../models/forms/updateStatusForm";
import { validate } from "class-validator";
import { ActivityLogsForm } from "../models/forms/activityLog.form";
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
      const TaskID = req.body.taskID;
      let result = await pool.query(
        "INSERT INTO fileuploads (Name, FileType,UploadUserID,Size, Path,ProjectID,TaskID) VALUES(?,?,?,?,?,?,?)",
        [name, type, userID, size, path, ProjectID, TaskID]
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

uploadRouter.get("/uploadedTasks", async (req, res) => {
  const selectedTask = Number(req.query.TaskID);
  const selectedProject = Number(req.query.projectID);
  let [result] = await pool.query(
    `SELECT fileuploads.ID,FirstName, Name, UploadDate, Status FROM fileuploads 
    LEFT JOIN user ON fileuploads.UploadUserID = user.ID
    WHERE TaskID =? AND ProjectID = ? AND DeleteDate IS NULL`,
    [selectedTask, selectedProject]
  );
  if (result) {
    try {
      res.json({ status: "true", result: result });
    } catch (error) {
      res.json({ message: "error in get uploadedTasks", error: error });
    }
  }
});

uploadRouter.post("/updateReject", async (req, res) => {
  const { ItemID } = req.body;

  let form = new updateStatusForm();
  form.ItemID = ItemID;
  const errors = await validate(form);
  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      error: "validation_error",
      message: errors,
    });
    return;
  }
  const update = await pool.query(
    `UPDATE fileuploads SET Status = 'Rejected' WHERE ID = ?`,
    [ItemID]
  );
  if (update) {
    res.json({ message: "updated", status: "success", result: update });
  } else {
    res.json({
      message: "error at updateReject",
      status: "fail",
      result: "update",
    });
  }
});

uploadRouter.post("/updateApproved", async (req, res) => {
  const { ItemID } = req.body;

  let form = new updateStatusForm();
  form.ItemID = ItemID;
  const errors = await validate(form);
  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      error: "validation_error",
      message: errors,
    });
    return;
  }
  const update = await pool.query(
    `UPDATE fileuploads SET Status = 'Approved' WHERE ID = ?`,
    [ItemID]
  );
  if (update) {
    res.json({ message: "updated", status: "success", result: update });
  } else {
    res.json({
      message: "error at updateReject",
      status: "fail",
      result: "update",
    });
  }
});

uploadRouter.post("/updateLog", async (req, res) => {
  const { TaskID, projectID } = req.body;
  const userID = req.userId;
  let form = new ActivityLogsForm();
  form.TaskID = TaskID;
  form.userID = userID;
  form.projectID = projectID;
  const errors = await validate(form);
  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      error: "validation_error",
      message: errors,
    });
    return;
  }
  const [updateLog] = await pool.execute(
    "INSERT INTO activitylog (UserID, ProjectID, Activity) VALUES(?,?,'Upload')",
    [userID, projectID]
  );
  if (updateLog) {
    res.json({
      message: "successfully updated logs",
      result: updateLog.affectedRows,
      status: true,
    });
  }
});

export default uploadRouter;
