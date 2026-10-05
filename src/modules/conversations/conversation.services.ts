import { Types } from "mongoose";

import ConversationModel from "./conversation.model";
import { createConversationKey } from "./conversation.utils";
import { AppError } from "../../utils/appError";

import type { IConversation } from "./conversation.types";

export default class ConversationServices {
  async createDirectConversation(
    ownerId: string,
    participantId: string
  ): Promise<IConversation> {
    if (ownerId === participantId) {
      throw new AppError(
        "You cannot create a conversation with yourself",
        400
      );
    }

    const conversationKey = createConversationKey(
      ownerId,
      participantId
    );

    const existingConversation =
      await ConversationModel.findOne({
        conversationKey,
      }).exec();

    if (existingConversation) {
      return existingConversation;
    }

    try {
      const conversation =
        await ConversationModel.create({
          type: "direct",
          participants: [
            new Types.ObjectId(ownerId),
            new Types.ObjectId(participantId),
          ],
          conversationKey,
        });

      return conversation;
    } catch (error: unknown) {
      if (this.isDuplicateKeyError(error)) {
        const conversation =
          await ConversationModel.findOne({
            conversationKey,
          }).exec();

        if (conversation) {
          return conversation;
        }
      }

      throw error;
    }
  }

  async getUserConversations(
    userId: string
  ): Promise<IConversation[]> {
    return ConversationModel.find({
      participants: new Types.ObjectId(userId),
    })
      .sort({ updatedAt: -1 })
      .exec();
  }

  async getConversationById(
    conversationId: string,
    userId: string
  ): Promise<IConversation> {
    const conversation =
      await ConversationModel.findOne({
        _id: new Types.ObjectId(conversationId),
        participants: new Types.ObjectId(userId),
      }).exec();

    if (!conversation) {
      throw new AppError(
        "Conversation not found",
        404
      );
    }

    return conversation;
  }

  private isDuplicateKeyError(
    error: unknown
  ): error is { code: number } {
    if (
      typeof error !== "object" ||
      error === null
    ) {
      return false;
    }

    return (
      "code" in error &&
      (error as { code?: unknown }).code === 11000
    );
  }
}