import { Router } from "express";

import MessageController from "./message.controller";

import {
  createMessageSchema,
  conversationMessagesSchema,
  messageIdSchema,
  updateMessageSchema,
} from "./message.validation";

import protect from "../../middleware/protectMiddleware";

import catchAsync from "../../utils/catchAsync";

import { validate } from "../../utils/middleware/validate.middleware";

const router = Router();

const messageController =
  new MessageController();

router.use(protect);

//POST /api/v1/messages
router.post(
  "/",
  validate(createMessageSchema),
  catchAsync(messageController.create)
);
//GET /api/v1/messages/conversation/65f123456789abcdef123456?limit=50
router.get(
  "/conversation/:conversationId",
  validate(conversationMessagesSchema),
  catchAsync(
    messageController.getConversationMessages
  )
);

//GET /api/v1/messages/conversation/:conversationId?limit=50
//GET /api/v1/messages/conversation/:conversationId?limit=50&before=<oldestMessageId>
router.get(
  "/:id",
  validate(messageIdSchema),
  catchAsync(messageController.getOne)
);

//PATCH /api/v1/messages/:messageId
router.patch(
  "/:id",
  validate(updateMessageSchema),
  catchAsync(messageController.update)
);

//DELETE /api/v1/messages/:messageId
router.delete(
  "/:id",
  validate(messageIdSchema),
  catchAsync(messageController.delete)
);

export default router;