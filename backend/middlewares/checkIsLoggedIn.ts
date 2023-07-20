import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "config";
interface DecodedToken {
  userId: string;
}

export function validationIsLogggedIn(
  req: Request | any,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    try {
      const decoded = jwt.verify(
        token,
        config.get("jwt.passphase")!
      ) as DecodedToken;
      req.userId = decoded.userId;
      return next();
    } catch (err) {
      console.error(err);
    }
  }
  next("UNAUTHORIZED ACTION");
}
