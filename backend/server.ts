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
import { pool } from "./db/db";
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

app.get("/download", async (req, res) => {
  const token = req.query.token;
  const fileId = req.query.fileId;
  const projectID = Number(req.query.projectID);
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
          "INSERT INTO activitylog (UserID, ProjectID, Activity) VALUES (?,?,'Download') ",
          [userID, projectID]
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
app.use("/auth", authenticationRouter);
app.use("/dashboard", validationIsLogggedIn, dashboardRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server is up and ready at PORT ${process.env.PORT}`);
});
