import { z } from "zod";

export const createContactSchema = z.object({
  body: z.object({
    userId: z.string().regex(
      /^[0-9a-fA-F]{24}$/,
      "Invalid user ID"
    ),
  }),
});
const objectIdSchema = z
  .string()
  .regex(
    /^[0-9a-fA-F]{24}$/,
    "Invalid contact ID"
  );

export const updateContactSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),

  body: z
    .object({
      nickname: z
        .string()
        .trim()
        .max(100)
        .nullable()
        .optional(),

      favorite: z.boolean().optional(),

      blocked: z.boolean().optional(),
    })
    .refine(
      (data) => Object.keys(data).length > 0,
      {
        message: "At least one field is required",
      }
    ),
});