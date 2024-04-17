import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction, RequestHandler } from "express";
import redisClient from "../helper/radis/index.redis";
import { envConfig } from "../config/env.config";

export interface CustomRequest extends Request {
  token: string | JwtPayload;
  user: string | JwtPayload;
}

export const auth: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new Error();
    }
    const decoded: any = jwt.verify(token, envConfig.Jwt_Secret);
    if (decoded && decoded?.id) {
      const redisToken = await redisClient.get(`user_${decoded.id}`);
      if (token == redisToken) {
        (req as CustomRequest).user = decoded;
        next();
      } else {
        return res.status(401).json({ message: "Session Expired" });
      }
    }
  } catch (err) {
    // console.log("errerrerrerr", err);
    res.status(401).send({
      message: "Unauthorized Access / Token expired",
      status: false,
    });
  }
};

export const verifyadminToken: RequestHandler = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user as JwtPayload;
    if (user.type === "admin") {
      next();
    } else {
      throw new Error();
    }
  } catch (err) {
    // console.log("errerrerrerr", err);
    res.status(401).send({
      message: "Unauthorized Access",
      status: false,
    });
  }
};
