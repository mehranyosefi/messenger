import type {
  Request,
  Response,
} from "express";

import MessageServices from "./message.services";

import catchAsync from "../../utils/catchAsync";

import type {
  CreateMessageBody,
  ConversationMessagesParams,
  ConversationMessagesQuery,
  MessageIdParams,
  UpdateMessageBody,
  UpdateMessageParams,
} from "./message.validation";

class MessageController {
  private readonly messageServices =
    new MessageServices();

  create = catchAsync(
    async (
      req: Request<
        Record<string, never>,
        unknown,
        CreateMessageBody
      >,
      res: Response
    ) => {
      const message =
        await this.messageServices.createMessage(
          req.user.id,
          req.body.conversationId,
          req.body.content
        );

      res.status(201).json({
        data: message,
      });
    }
  );

  getConversationMessages = catchAsync(
    async (
      req: Request<
        ConversationMessagesParams,
        unknown,
        unknown,
        ConversationMessagesQuery
      >,
      res: Response
    ) => {
      const result =
        await this.messageServices.getConversationMessages(
          req.user.id,
          req.params.conversationId,
          req.query.limit,
          req.query.before
        );

      res.status(200).json({
        data: result.messages,
        meta: {
          hasMore: result.hasMore,
        },
      });
    }
  );

  getOne = catchAsync(
    async (
      req: Request<MessageIdParams>,
      res: Response
    ) => {
      const message =
        await this.messageServices.getMessageById(
          req.user.id,
          req.params.id
        );

      res.status(200).json({
        data: message,
      });
    }
  );

  update = catchAsync(
    async (
      req: Request<
        UpdateMessageParams,
        unknown,
        UpdateMessageBody
      >,
      res: Response
    ) => {
      const message =
        await this.messageServices.updateMessage(
          req.user.id,
          req.params.id,
          req.body.content
        );

      res.status(200).json({
        data: message,
      });
    }
  );

  delete = catchAsync(
    async (
      req: Request<MessageIdParams>,
      res: Response
    ) => {
      await this.messageServices.deleteMessage(
        req.user.id,
        req.params.id
      );

      res.status(204).send();
    }
  );
}

export default MessageController;