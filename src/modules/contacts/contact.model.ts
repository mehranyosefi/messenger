import {
  Schema,
  model,
  Types,
  HydratedDocument,
} from "mongoose";

export interface IContact {
  owner: Types.ObjectId;
  contact: Types.ObjectId;

  nickname: string | null;

  favorite: boolean;
  blocked: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export type ContactDocument = HydratedDocument<IContact>;

const contactSchema = new Schema<IContact>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    contact: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    nickname: {
      type: String,
      trim: true,
      maxlength: 100,
      default: null,
    },

    favorite: {
      type: Boolean,
      default: false,
    },

    blocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

contactSchema.index(
  {
    owner: 1,
    contact: 1,
  },
  {
    unique: true,
  }
);

contactSchema.index({
  owner: 1,
  createdAt: -1,
});

export const ContactModel = model<IContact>(
  "Contact",
  contactSchema
);