import type { RequestHandler } from "express";
import { Types } from "mongoose";

import { contactService } from "./contact.service";
import { AppError } from "../../utils/appError";

function getUserId(req: Parameters<RequestHandler>[0]) {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  return new Types.ObjectId(req.user._id);
}

export const contactController = {
  create: (async (req, res) => {
    const ownerId = getUserId(req);

    const contactId = new Types.ObjectId(req.body.userId);

    const contact = await contactService.create(ownerId, contactId);

    res.status(201).json({
      data: contact,
    });
  }) as RequestHandler,

  getAll: (async (req, res) => {
    const ownerId = getUserId(req);

    const contacts = await contactService.findAll(ownerId);

    res.status(200).json({
      data: contacts,
    });
  }) as RequestHandler,

  getOne: (async (req, res) => {
    const ownerId = getUserId(req);

    const contactId = new Types.ObjectId(req.params.id);

    const contact = await contactService.findOne(ownerId, contactId);

    res.status(200).json({
      data: contact,
    });
  }) as RequestHandler,

  update: (async (req, res) => {
    const ownerId = getUserId(req);

    const contactId = new Types.ObjectId(req.params.id);

    const contact = await contactService.update(ownerId, contactId, req.body);

    res.status(200).json({
      data: contact,
    });
  }) as RequestHandler,

  delete: (async (req, res) => {
    const ownerId = getUserId(req);

    const contactId = new Types.ObjectId(req.params.id);

    await contactService.delete(ownerId, contactId);

    res.status(204).send();
  }) as RequestHandler,
};
