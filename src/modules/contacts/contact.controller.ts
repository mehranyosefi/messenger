import type { Request, RequestHandler, Response } from "express";
import { Types } from "mongoose";
import { contactService } from "./contact.services";
import { AppError } from "../../utils/appError";
import User from "../users/user.model";
import catchAsync from "../../utils/catchAsync";

export default class ContactController {
  create = catchAsync(async (req:Request, res: Response, next) => {
    const ownerEmail = req.user.email;
    // const contactId = new Types.ObjectId(req.body.userId);
    //find contact by email
    const contactEmail = req.body.email;
    if (ownerEmail === contactEmail) {
      throw new AppError("You cannot add yourself as a contact", 400);
    }
    const contactExist = await User.exists({
      email: contactEmail,
    });
    if (!contactExist) {
      return next(new AppError("Contact not found", 404));
    }
    const contact = await contactService.create({
      owner: req.user._id,
      contact: contactExist._id,
      name: req.body.name
    });
    res.status(201).json({
      data: contact,
    });
  });

  getAll = catchAsync(async (req:Request, res: Response) => {
    const contacts = await contactService.findAll(req.user._id);

    res.status(200).json({
      data: contacts,
    });
  });

  getOne = catchAsync(async (req:Request, res: Response) => {
    const contactId = new Types.ObjectId(req.params.id as string);

    const contact = await contactService.findOne(req.user._id, contactId);

    res.status(200).json({
      data: contact,
    });
  });

  update = catchAsync(async (req:Request, res: Response) => {
    const contactId = new Types.ObjectId(req.params.id as string);
    const contact = await contactService.update(req.user.id, contactId, req.body);
    res.status(200).json({
      data: contact,
    });
  });

  delete = catchAsync(async (req, res) => {
    const contactId = new Types.ObjectId(req.params.id as string);
    await contactService.delete(req.user.id, contactId);

    res.status(204).send();
  }) as RequestHandler;
}
