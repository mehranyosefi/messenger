import {
  Schema,
  model,
  type Model,
} from "mongoose";

import type { IConversation } from "./conversation.types";

const conversationSchema = new Schema<IConversation>(
  {
    type: {
      type: String,
      enum: ["direct"],
      required: true,
      default: "direct",
    },
    participants: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      required: true,
      validate: {
        validator: (value: unknown[]) => value.length === 2,
        message: "A direct conversation must have exactly 2 participants",
      },
    },

    conversationKey: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);
//NotUn
conversationSchema.index({
  participants: 1,
});

const ConversationModel: Model<IConversation> = model<IConversation>("Conversation", conversationSchema);

export default ConversationModel;