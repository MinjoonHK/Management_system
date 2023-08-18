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

app.use(
  cors({
    origin: "*", //http://192.168.31.137:3000
    methods: ["GET", "POST"],
  })
);

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
      const userID = req.userId;
      const senderEmail = decoded.Email;
      const [projectInfo] = await pool.execute(
        "SELECT ProjectName, End, Description FROM project WHERE ID = ?",
        [selectedProject]
      );
      const [projectJoinedUsers] = await pool.execute(
        "SELECT Joined_User_Email FROM projectpeople WHERE project_ID =?",
        [selectedProject]
      );
      const existChecker = projectJoinedUsers.find((u: any) => {
        return u.Joined_User_Email == InviteEmail;
      });
      if (existChecker != undefined) {
        res.json({ message: "user is already in the project!", status: false });
      } else if (existChecker === undefined) {
        const response = await sendProjectInvitation({
          Deadline: dayjs(projectInfo[0].End).format("YYYY-MMM-DD"),
          TaskName: projectInfo[0].ProjectName,
          Description: projectInfo[0].Description,
          From: senderEmail,
          to: InviteEmail,
          URL: process.env.URL,
        });
        if (response === true) {
          await pool.execute(
            `
          INSERT INTO projectpeople (Joined_User_Email,project_ID) VALUES(?,?)
          `,
            [InviteEmail, selectedProject]
          );
          res.json({
            message: `successfully sent invitation to ${InviteEmail}`,
            status: true,
          });
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
