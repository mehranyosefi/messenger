import { Router } from "express";

import ConversationController from "./conversation.controller";
import { createConversationSchema } from "./conversation.validation";

import protect from "../../middleware/protectMiddleware";
import catchAsync from "../../utils/catchAsync";
import { validate } from "../../utils/middleware/validate.middleware";

const router = Router();

const conversationController = new ConversationController();

router.use(protect);

router.get("/", conversationController.getAll);

//POST /api/v1/conversations
// {
//   "participantId": "65f123456789abcdef123456"
// }
router.post(
  "/",
  validate(createConversationSchema),
  conversationController.create,
);

router.get("/:id", conversationController.getOne);
router.delete("/:id", conversationController.delete);

router.get("/get-by-contact-id/:id", conversationController.getbyContactId);

export default router;
