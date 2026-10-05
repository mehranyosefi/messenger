import { Schema, model, type Model } from "mongoose";

import type { IMessage } from "./message.types";

const messageSchema = new Schema<IMessage>(
  {
    conversation: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },

    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["text"],
      required: true,
      default: "text",
    },

    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },

    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      required: true,
      default: "sent",
    },
  },
  {
    timestamps: true,
  },
);

messageSchema.index({
  conversation: 1,
  createdAt: -1,
});

messageSchema.index({
  sender: 1,
  createdAt: -1,
});

const MessageModel: Model<IMessage> = model<IMessage>("Message", messageSchema);

export default MessageModel;
