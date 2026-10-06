import { z } from "zod";
import type { ParamsDictionary } from "express-serve-static-core";
import type { ParsedQs } from "qs";

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

// Types
export type CreateMessageBody = z.infer<typeof createMessageSchema>["body"];

export type MessageIdParams = z.infer<typeof messageIdSchema>["params"] & ParamsDictionary;

export type ConversationMessagesParams = z.infer<
  typeof conversationMessagesSchema
>["params"] & ParamsDictionary;

export type ConversationMessagesQuery = z.infer<
  typeof conversationMessagesSchema
>["query"] & ParsedQs;

export type UpdateMessageParams = z.infer<
  typeof updateMessageSchema
>["params"] & ParamsDictionary;

export type UpdateMessageBody = z.infer<typeof updateMessageSchema>["body"];
