import { Types } from "mongoose";

export type ConversationType = "direct";

export interface IConversation {
  _id: Types.ObjectId;
  type: ConversationType;
  participants: Types.ObjectId[];
  /**
   * Deterministic identifier for a direct conversation.
   *
   * Example:
   * userA:userB
   * and prevent duplicate conversations
   */
  conversationKey: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface CreateConversationBody {
  participantId: string;
}

export interface ConversationParams {
  id: string;
}
