import { Router } from "express";
import catchAsync from "../../utils/catchAsync";
import User from "./user.model";
import { AppError } from "../../utils/appError";
const router = Router();

router.param("userId", (req, res, next, userId) => {
  return catchAsync(async (req, res, next) => {
    const user = await User.findById(userId);
    if (!user) return next(new AppError(`No user found with this ID`, 404));
    req.user = user;
    next();
  });
});
