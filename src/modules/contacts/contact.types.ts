import type { Types } from "mongoose";

export interface CreateContactInput {
  ownerId: Types.ObjectId;
  contactId: Types.ObjectId;
}

export interface UpdateContactInput {
  nickname?: string | null;
  favorite?: boolean;
  blocked?: boolean;
}