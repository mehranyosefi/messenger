import { APIFeatures } from "../../utils/apiFeatures";
import User from "./user.model";
import catchAsync from "../../utils/catchAsync";
import { AppError } from "../../utils/appError";
import type { Request, Response, NextFunction } from "express";

export default class UserController {
  getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const features = new APIFeatures(User.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const users = await features.query;
    res.status(200).json({
      status: "success",
      data: {
        users,
      },
    });
  });

  getUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const user = await User.findById(req.params.id);
      if (!user) return next(new AppError(`No user found with this ID`, 404));
      res.status(200).json({
        status: "success",
        data: {
          user,
        },
      });
    },
  );

  createUser = catchAsync(async (req: Request, res: Response) => {
    const {
      name,
      email,
      password,
      passwordConfirm,
    }: {
      name: string;
      email: string;
      password: string;
      passwordConfirm: string;
    } = req.body;

    const user = await User.create({
      name,
      email,
      password,
      passwordConfirm,
    });
    res.status(201).json({
      status: "success",
      data: {
        user,
      },
    });
  });
  async updateUser(req: Request, res: Response) {}
  async deleteUser(req: Request, res: Response) {}
}
