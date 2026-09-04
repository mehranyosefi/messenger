import { Request, Response, NextFunction } from "express";
import User from "../models/UserModel";

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

    //1: Check token and check of it;s there
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

    //2: Verification token
    const decoded = verifyAccessToken(token) as {
      id: string;
      iat: number;
      exp: number
    };
    console.log('decoded', decoded)

    //3: Check if user still exist
    const currentUser = await User.findById(decoded.id)
    if(!currentUser) return next(
        new AppError(
          "Invalid or expired access token",
          401
        )
      );

    //4: check if user change password after the token was issued
    if(currentUser.changedPawwordAfter(decoded.iat))
      return next(new AppError('User recently change password! please login againg', 401))
    
    // Grant access to protected route
    req.user = currentUser
    next()

  }
);


export default protect;