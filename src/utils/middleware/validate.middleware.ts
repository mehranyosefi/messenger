import type { RequestHandler } from "express";
import type { ZodObject } from "zod";

export const validate = (
  schema: ZodObject<any>
): RequestHandler => {
  return (req, res, next) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      return res.status(400).json({
        status: "fail",
        message: "Validation failed",
        errors: result.error.flatten(),
      });
    }

    if (result.data.body !== undefined) {
      req.body = result.data.body;
    }

    next();
  };
};