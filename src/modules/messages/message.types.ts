import { Types } from "mongoose";

export type MessageStatus = "sent" | "delivered" | "read";

// export type MessageType =
//   | "text"
//   | "image"
//   | "video"
//   | "audio"
//   | "file";
export type MessageType = "text";

export interface IMessage {
  _id: Types.ObjectId;
  conversation: Types.ObjectId;
  sender: Types.ObjectId;
  type: MessageType;
  content: string;
  status: MessageStatus;
  createdAt: Date;
  updatedAt: Date;
}
