import type { Types } from "mongoose";

export interface CreateContactInput {
  ownerId: Types.ObjectId;
  contactId: Types.ObjectId;
}

export interface UpdateContactInput {
  name?: string | null;
  favorite?: boolean;
  blocked?: boolean;
}
