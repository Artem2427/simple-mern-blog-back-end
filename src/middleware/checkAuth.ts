import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare module "jsonwebtoken" {
  export interface UserIDJwtPayload extends jwt.JwtPayload {
    _id: string;
  }
}

export interface AuthType {
  userId: string;
}

export default (
  req: Request<{}, {}, AuthType, {}>,
  res: Response,
  next: NextFunction
) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");

  if (token) {
    try {
      const decoded = <jwt.UserIDJwtPayload>jwt.verify(token, "secret123");

      req.body.userId = decoded._id;
      next();
    } catch (error) {
      return res.status(401).json({ message: "No authorization" });
    }
  } else {
    return res.status(401).json({ message: "No authorization" });
  }
};
