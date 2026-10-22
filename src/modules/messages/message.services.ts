import { Types } from "mongoose";

import MessageModel from "./message.model";

import ConversationModel from "../conversations/conversation.model";

import { AppError } from "../../utils/appError";

import type { IMessage } from "./message.types";

interface GetConversationMessagesResult {
  messages: IMessage[];
  hasMore: boolean;
}

export default class MessageServices {
  async createMessage(
    senderId: string,
    conversationId: string,
    content: string,
  ): Promise<IMessage> {
    console.log("conversationId", conversationId);
    const conversation = await ConversationModel.findOne({
      _id: new Types.ObjectId(conversationId),
      participants: new Types.ObjectId(senderId),
    })
      .select("_id")
      .lean()
      .exec();

    if (!conversation) {
      throw new AppError("Conversation not found", 404);
    }

    const message = await MessageModel.create({
      conversation: new Types.ObjectId(conversationId),
      sender: new Types.ObjectId(senderId),
      type: "text",
      content,
      status: "sent",
    });
    //TODO for a more robust system, you may eventually use a MobgoDB transaction: create message + update conversation
    await ConversationModel.updateOne(
      {
        _id: conversation._id,
      },
      {
        $set: {
          updatedAt: new Date(),
        },
      },
    ).exec();

    return message;
  }

  async getConversationMessages(
    userId: string,
    conversationId: string,
    limit: number,
    before?: string,
  ): Promise<GetConversationMessagesResult> {
    console.log("limit", limit);
    const conversation = await ConversationModel.findOne({
      _id: new Types.ObjectId(conversationId),
      participants: new Types.ObjectId(userId),
    })
      .select("_id")
      .lean()
      .exec();

    if (!conversation) {
      throw new AppError("Conversation not found", 404);
    }

    const filter: {
      conversation: Types.ObjectId;
      _id?: {
        $lt: Types.ObjectId;
      };
    } = {
      conversation: new Types.ObjectId(conversationId),
    };

    if (before) {
      filter._id = {
        $lt: new Types.ObjectId(before),
      };
    }

    const messages = await MessageModel.find(filter)
      // .sort({
      //   createdAt: -1,
      // })
      .limit(parseInt(String(limit)) + 1)
      .exec();

    const hasMore = messages.length > limit;

    if (hasMore) {
      messages.pop();
    }

    return {
      messages,
      hasMore,
    };
  }

  async getMessageById(userId: string, messageId: string): Promise<IMessage> {
    const message = await MessageModel.findOne({
      _id: new Types.ObjectId(messageId),
    }).exec();

    if (!message) {
      throw new AppError("Message not found", 404);
    }

    const conversation = await ConversationModel.findOne({
      _id: message.conversation,

      participants: new Types.ObjectId(userId),
    })
      .select("_id")
      .lean()
      .exec();

    if (!conversation) {
      throw new AppError("Message not found", 404);
    }

    return message;
  }

  async updateMessage(
    userId: string,
    messageId: string,
    content: string,
  ): Promise<IMessage> {
    const message = await MessageModel.findOne({
      _id: new Types.ObjectId(messageId),
    }).exec();

    if (!message) {
      throw new AppError("Message not found", 404);
    }

    if (message.sender.toString() !== userId) {
      throw new AppError("You can only edit your own messages", 403);
    }

    const conversation = await ConversationModel.findOne({
      _id: message.conversation,

      participants: new Types.ObjectId(userId),
    })
      .select("_id")
      .lean()
      .exec();

    if (!conversation) {
      throw new AppError("Message not found", 404);
    }

    message.content = content;

    await message.save();

    return message;
  }

  async deleteMessage(userId: string, messageId: string): Promise<void> {
    const message = await MessageModel.findOne({
      _id: new Types.ObjectId(messageId),
    }).exec();

    if (!message) {
      throw new AppError("Message not found", 404);
    }

    if (message.sender.toString() !== userId) {
      throw new AppError("You can only delete your own messages", 403);
    }

    const conversation = await ConversationModel.findOne({
      _id: message.conversation,

      participants: new Types.ObjectId(userId),
    })
      .select("_id")
      .lean()
      .exec();

    if (!conversation) {
      throw new AppError("Message not found", 404);
    }

    await MessageModel.deleteOne({
      _id: message._id,
    }).exec();
  }
}
