import { z } from "zod";

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId");

export const createMessageSchema = z.object({
  body: z.object({
    conversationId: objectIdSchema,

    content: z
      .string()
      .trim()
      .min(1, "Message content is required")
      .max(5000, "Message cannot exceed 5000 characters"),
  }),
});

export const messageIdSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
});

// GET /api/v1/messages/conversation/65...?
//     limit=50&
//     before=65abc...
export const conversationMessagesSchema = z.object({
  params: z.object({
    conversationId: objectIdSchema,
  }),

  query: z.object({
    limit: z.coerce.number().int().min(1).max(100).default(50),

    before: objectIdSchema.optional(),
  }),
});

export const updateMessageSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),

  body: z.object({
    content: z
      .string()
      .trim()
      .min(1, "Message content is required")
      .max(5000, "Message cannot exceed 5000 characters"),
  }),
});

export type CreateMessageBody = z.infer<typeof createMessageSchema>["body"];

export type MessageIdParams = z.infer<typeof messageIdSchema>["params"];

export type ConversationMessagesParams = z.infer<
  typeof conversationMessagesSchema
>["params"];

export type ConversationMessagesQuery = z.infer<
  typeof conversationMessagesSchema
>["query"];

export type UpdateMessageParams = z.infer<typeof updateMessageSchema>["params"];

export type UpdateMessageBody = z.infer<typeof updateMessageSchema>["body"];
