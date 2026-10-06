import type { Request, Response } from "express";

import ConversationServices from "./conversation.services";
import catchAsync from "../../utils/catchAsync";

interface CreateConversationBody {
  participantId: string;
}

interface ConversationParams {
  id: string;
}

class ConversationController {
  private readonly conversationService = new ConversationServices();

  create = catchAsync(
    async (
      req: Request<Record<string, never>, unknown, CreateConversationBody>,
      res: Response,
    ) => {
      const conversation =
        await this.conversationService.createDirectConversation(
          req.user.id,
          req.body.participantId,
        );

      res.status(201).json({
        data: conversation,
      });
    },
  );

  getAll = catchAsync(async (req: Request, res: Response) => {
    const conversations = await this.conversationService.getUserConversations(
      req.user.id,
    );

    res.status(200).json({
      data: conversations,
    });
  });

  getOne = catchAsync(
    async (req: Request<ConversationParams>, res: Response) => {
      const conversation = await this.conversationService.getConversationById(
        req.params.id,
        req.user.id,
      );

      res.status(200).json({
        data: conversation,
      });
    },
  );

  delete = catchAsync(async(req: Request<ConversationParams>, res: Response)=>{
    await this.conversationService.deleteConversationById(req.params.id, req.user.id)
    res.status(204).send();
  });
}

export default ConversationController;
