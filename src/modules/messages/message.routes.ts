import { Router } from "express";

import MessageController from "./message.controller";

import {
  createMessageSchema,
  conversationMessagesSchema,
  messageIdSchema,
  updateMessageSchema,
} from "./message.validation";

import protect from "../../middleware/protectMiddleware";

import { validate } from "../../utils/middleware/validate.middleware";

const router = Router();

const messageController = new MessageController();

router.use(protect);

//POST /api/v1/messages
router.post("/", validate(createMessageSchema), messageController.create);
//GET /api/v1/messages/conversation/65f123456789abcdef123456?limit=50
//GET /api/v1/messages/conversation/:conversationId?limit=50&before=<oldestMessageId>
router.get(
  "/conversation/:conversationId",
  validate(conversationMessagesSchema),
  messageController.getConversationMessages,
);

router.get("/:id", validate(messageIdSchema), messageController.getOne);

//PATCH /api/v1/messages/:messageId
router.patch("/:id", validate(updateMessageSchema), messageController.update);

//DELETE /api/v1/messages/:messageId
router.delete("/:id", validate(messageIdSchema), messageController.delete);

export default router;
