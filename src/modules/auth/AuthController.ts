import { Request, Response, NextFunction } from "express";
import User from "../users/user.model";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt";

import catchAsync from "../../utils/catchAsync";
import { AppError } from "../../utils/appError";


// ------------------------------------
// Helper
// ------------------------------------
const createTokens = (userId: string) => {
  const accessToken = signAccessToken(userId);
  const refreshToken = signRefreshToken(userId);

  return {
    accessToken,
    refreshToken,
  };
};

// ------------------------------------
// SIGN UP
// ------------------------------------

export const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      name,
      email,
      password,
      passwordConfirm
    }: { 
        name: string;
        email: string;
        password: string;
        passwordConfirm: string;
    } = req.body;


    // Basic validation
    if (!name || !email || !password || !passwordConfirm) {
      return next(
        new AppError(
          "Name, email and password are required",
          400
        )
      );
    }


    // Check existing user
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });


    if (existingUser) {
      return next(
        new AppError(
          "User with this email already exists",
          409
        )
      );
    }


    // Create user
    const user = await User.create({
      name,
      email,
      password,
      passwordConfirm
    });


    // Create JWT
    const {
      accessToken,
      refreshToken,
    } = createTokens(user._id.toString());


    res.status(201).json({
      status: "success",

      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },

        session: {
          access_token: accessToken,
          refresh_token: refreshToken,
        },
      },
    });
  }
);

// ------------------------------------
// LOGIN
// ------------------------------------
export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      email,
      password,
    } = req.body;

    if (!email || !password) {
      return next(
        new AppError(
          "Email and password are required",
          400
        )
      );
    }
    // password has select:false
    // so explicitly request it here
    const user = await User.findOne({
      email: email.toLowerCase(),
    }).select("+password");

    const passwordIsCorrect = await user?.comparePassword(password, user?.password)


    if (!user || !passwordIsCorrect) {
      return next(
        new AppError(
          "Invalid email or password",
          401
        )
      );
    }


    const {
      accessToken,
      refreshToken,
    } = createTokens(user._id.toString());


    res.status(200).json({
      status: "success",

      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },

        session: {
          access_token: accessToken,
          refresh_token: refreshToken,
        },
      },
    });
  }
);

// ------------------------------------
// LOGOUT
// ------------------------------------


// ------------------------------------
// REFRESH TOKEN
// ------------------------------------
export const refreshToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { refresh_token } = req.body;
    if (!refresh_token) {
      return next(
        new AppError(
          "Refresh token is required",
          401
        )
      );
    }

    let decoded;
    try {
      decoded = verifyRefreshToken(refresh_token);
    } catch {
      return next(
        new AppError(
          "Invalid or expired refresh token",
          401
        )
      );
    }


    const user = await User.findById(decoded.id);


    if (!user) {
      return next(
        new AppError(
          "User no longer exists",
          401
        )
      );
    }


    const accessToken = signAccessToken(
      user._id.toString()
    );


    res.status(200).json({
      status: "success",

      data: {
        access_token: accessToken,
      },
    });
  }
);


// ------------------------------------
// GET CURRENT USER
// ------------------------------------
export const getMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {

    // req.user will be populated by auth middleware
    const user = await User.findById(req.user.id);


    if (!user) {
      return next(
        new AppError(
          "User not found",
          404
        )
      );
    }


    res.status(200).json({
      status: "success",

      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
    });
  }
);