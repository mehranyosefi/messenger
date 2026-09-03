import { Request, Response, NextFunction } from "express";

import {
  verifyAccessToken,
} from "../utils/jwt";

import { AppError } from "../utils/appError";
import catchAsync from "../utils/catchAsync";


const protect = catchAsync(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {

    let token: string | undefined;


    // Authorization: Bearer <token>

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }


    if (!token) {
      return next(
        new AppError(
          "You are not logged in",
          401
        )
      );
    }


    try {

      const decoded = verifyAccessToken(token);

      req.user = decoded;

      next();

    } catch (error) {

      return next(
        new AppError(
          "Invalid or expired access token",
          401
        )
      );

    }
  }
);


export default protect;