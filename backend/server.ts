import express, { Express } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { validationIsLogggedIn } from "./middlewares/checkIsLoggedIn";
import authenticationRouter from "./routes/authentication";
import dashboardRouter from "./routes/dashboard";
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

app.use("/auth", authenticationRouter);
app.use("/dashboard", validationIsLogggedIn, dashboardRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server is up and ready at PORT ${process.env.PORT}`);
});
