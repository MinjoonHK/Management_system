import express, { Express } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import {
  DecodedToken,
  validationIsLogggedIn,
} from "./middlewares/checkIsLoggedIn";
import authenticationRouter from "./routes/authentication";
import dashboardRouter from "./routes/dashboard";
import jwt from "jsonwebtoken";
import config from "config";
import fs from "fs";
import { sendProjectInvitation } from "./managers/mail.manager";
import { pool } from "./db/db";
import { sendEmailForm } from "./models/forms/sendEmail.form";
import { validate } from "class-validator";
import dayjs from "dayjs";

declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}
const app: Express = express();

dotenv.config(); // Read .env File
app.use(express.json());
app.use(cookieParser());

let corsOptions = {
  origin: (origin: any, callback: any) => {
    callback(null, true);
  },
};

app.use(cors(corsOptions));

app.post("/sendEmail", async (req, res) => {
  const { InviteEmail, Role, selectedProject, token } = req.body;
  let form = new sendEmailForm();
  form.InviteEmail = InviteEmail;
  form.Role = Role;
  form.selectedProject = selectedProject;
  form.token = token;
  let error = await validate(form);
  if (error.length > 0) {
    //if there is error
    res.status(400).json({
      success: false,
      error: "validation_error",
      message: error,
    });
    return;
  }
  if (token) {
    try {
      const decoded = jwt.verify(
        token.toString(),
        config.get("jwt.passphase")!
      ) as DecodedToken;
      req.userId = decoded.ID;
      const senderEmail = decoded.Email;
      const [existingUserList] = await pool.execute(
        `SELECT ID FROM user WHERE Email = ?`,
        [InviteEmail]
      );
      const [projectInfo] = await pool.execute(
        "SELECT ProjectName, End, Description FROM project WHERE ID = ?",
        [selectedProject]
      );
      const [projectJoinedUsers] = await pool.execute(
        "SELECT Joined_User_Email,Deleted_At FROM projectpeople WHERE project_ID =?",
        [selectedProject]
      );
      const existChecker = projectJoinedUsers.find((u: any) => {
        return u.Joined_User_Email == InviteEmail;
      });
      if (existChecker != undefined) {
        //if user exist in project
        if (existChecker.Deleted_At != null) {
          const [reJoinProject] = await pool.execute(
            `UPDATE projectpeople SET Deleted_At = NULL WHERE Joined_User_Email = ?`,
            [existChecker.Joined_User_Email]
          );
          if (reJoinProject) {
            res.json({
              message: "user has rejoined the project!",
              status: true,
            });
          }
        } else {
          res.json({
            message: "user is already in the project!",
            status: false,
          });
        }
      } else if (existChecker === undefined) {
        //if user does not exist in project
        if (existingUserList.length > 0) {
          //if user is in system but not in project
          const response = await pool.execute(
            `
                  INSERT INTO projectpeople (Joined_User_Email,project_ID,Role,Status) VALUES(?,?,?,"Active")
                  `,
            [InviteEmail, selectedProject, Role]
          );
          console.log(response);
          if (response) {
            res.json({
              message: "user successfully joined the project!",
              status: true,
            });
          }
        } else if (existingUserList.length == 0) {
          console.log("TEST");
          //if user does not exist in system
          const response = await sendProjectInvitation({
            Deadline: dayjs(projectInfo[0].End).format("YYYY-MMM-DD"),
            TaskName: projectInfo[0].ProjectName,
            Description: projectInfo[0].Description,
            From: senderEmail,
            to: InviteEmail,
            URL: process.env.URL,
          });
          if (response) {
            const response = await pool.execute(
              `
                  INSERT INTO projectpeople (Joined_User_Email,project_ID,Role) VALUES(?,?,?)
                  `,
              [InviteEmail, selectedProject, Role]
            );
            if (response) {
              res.json({
                message: "user has susccessfully invited to the project!",
                status: true,
              });
            }
          }
        }
      }
    } catch (err) {
      console.error(err);
      res.sendStatus(404);
    }
  }
});

app.get("/download", async (req, res) => {
  const token = req.query.token;
  const fileId = req.query.fileId;
  const projectID = Number(req.query.projectID);
  const taskID = Number(req.query.taskID);
  if (token) {
    try {
      const decoded = jwt.verify(
        token.toString(),
        config.get("jwt.passphase")!
      ) as DecodedToken;
      req.userId = decoded.ID;
      const userID = req.userId;
      const result = await pool.execute(
        "SELECT * FROM fileuploads WHERE ID = ? ",
        [fileId]
      );
      if (result[0].length) {
        const updateLog = await pool.execute(
          "INSERT INTO activitylog (UserID, ProjectID, Activity,taskID,FileID) VALUES (?,?,'Download',?,?) ",
          [userID, projectID, taskID, fileId]
        );
        res.setHeader(
          "Content-disposition",
          "attachment; filename=" + result[0][0].Name
        );
        res.setHeader("Content-type", result[0][0].FileType);
        var filestream = fs.createReadStream(result[0][0].Path);
        filestream.pipe(res);
      } else {
        res.sendStatus(404);
      }
    } catch (err) {
      console.error(err);
      res.sendStatus(404);
    }
  }
});

/**Routers  */
app.use("/auth", authenticationRouter);
app.use("/dashboard", validationIsLogggedIn, dashboardRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server is up and ready at PORT ${process.env.PORT}`);
});
