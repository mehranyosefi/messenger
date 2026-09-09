import { Types } from "mongoose";

import { ContactModel } from "./contact.model";
import User from "../users/user.model";
import { AppError } from "../../utils/appError";

export class ContactService {
  async create(ownerId: Types.ObjectId, contactId: Types.ObjectId) {
    if (ownerId.equals(contactId)) {
      throw new AppError("You cannot add yourself as a contact", 400);
    }

    const userExists = await User.exists({
      _id: contactId,
    });

    if (!userExists) {
      throw new AppError("User not found", 404);
    }

    try {
      return await ContactModel.create({
        owner: ownerId,
        contact: contactId,
      });
    } catch (error: any) {
      if (error.code === 11000) {
        throw new AppError("User is already in your contacts", 409);
      }

      throw error;
    }
  }

  async findAll(ownerId: Types.ObjectId) {
    return ContactModel.find({
      owner: ownerId,
    })
      .populate({
        path: "contact",
        select: "_id username displayName avatar",
      })
      .sort({
        createdAt: -1,
      })
      .lean();
  }

  async findOne(ownerId: Types.ObjectId, contactId: Types.ObjectId) {
    const contact = await ContactModel.findOne({
      _id: contactId,
      owner: ownerId,
    })
      .populate({
        path: "contact",
        select: "_id username displayName avatar",
      })
      .lean();

    if (!contact) {
      throw new AppError("Contact not found", 404);
    }

    return contact;
  }

  async update(
    ownerId: Types.ObjectId,
    contactId: Types.ObjectId,
    data: {
      nickname?: string | null;
      favorite?: boolean;
      blocked?: boolean;
    },
  ) {
    const contact = await ContactModel.findOneAndUpdate(
      {
        _id: contactId,
        owner: ownerId,
      },
      {
        $set: data,
      },
      {
        new: true,
        runValidators: true,
      },
    ).populate({
      path: "contact",
      select: "_id username displayName avatar",
    });

    if (!contact) {
      throw new AppError("Contact not found", 404);
    }

    return contact;
  }

  async delete(ownerId: Types.ObjectId, contactId: Types.ObjectId) {
    const result = await ContactModel.deleteOne({
      _id: contactId,
      owner: ownerId,
    });

    if (result.deletedCount === 0) {
      throw new AppError("Contact not found", 404);
    }
  }
}

export const contactService = new ContactService();
