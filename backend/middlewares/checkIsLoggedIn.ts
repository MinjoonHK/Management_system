import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "config";
interface DecodedToken {
  Email: string;
  ID: number;
  Name: string;
  Role: string;
  iat: number;
  exp: number;
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
      req.userId = decoded.ID;
      return next();
    } catch (err) {
      console.error(err);
    }
  }
  return next("UNAUTHORIZED ACTION");
}
