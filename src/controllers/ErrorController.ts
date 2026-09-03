import type {
  ErrorRequestHandler,
  Response,
} from "express";

import mongoose from "mongoose";

import { AppError } from "../utils/appError";


// ==========================================
// Types
// ==========================================

interface MongoDuplicateError extends Error {
  code?: number;
  keyValue?: Record<string, unknown>;
}

interface ErrorWithStatus extends Error {
  statusCode?: number;
  status?: "fail" | "error";
  isOperational?: boolean;
  code?: number;
  keyValue?: Record<string, unknown>;
}


// ==========================================
// Development Error
// ==========================================

function sendErrorDev(
  err: ErrorWithStatus,
  res: Response
) {
  res.status(err.statusCode || 500).json({
    status: err.status || "error",
    error: err,
    message: err.message,
    stack: err.stack,
  });
}


// ==========================================
// Production Error
// ==========================================

function sendErrorProd(
  err: ErrorWithStatus,
  res: Response
) {
  // Operational, trusted error
  if (err.isOperational) {
    return res.status(err.statusCode || 500).json({
      status: err.status || "error",
      message: err.message,
    });
  }


  // Programming or unknown error
  console.error("ERROR 💥", err);

  return res.status(500).json({
    status: "error",
    message: "Something went very wrong",
  });
}


// ==========================================
// Mongoose CastError
// ==========================================

function handleCastErrorDB(
  error: mongoose.Error.CastError
): AppError {

  const message =
    `Invalid ${error.path}: ${error.value}`;

  return new AppError(
    message,
    400
  );
}


// ==========================================
// Mongo Duplicate Key Error
// ==========================================

function handleDuplicateFieldsDB(
  error: MongoDuplicateError
): AppError {

  const field =
    error.keyValue
      ? Object.keys(error.keyValue)[0]
      : "field";

  const value =
    error.keyValue
      ? Object.values(error.keyValue)[0]
      : "unknown";

  const message =
    `Duplicate value "${value}" for field "${field}". Please use another value.`;

  return new AppError(
    message,
    400
  );
}


// ==========================================
// Mongoose Validation Error
// ==========================================

function handleValidationErrorDB(
  error: mongoose.Error.ValidationError
): AppError {

  const messages =
    Object.values(error.errors)
      .map((el) => el.message);

  const message =
    `Invalid input data. ${messages.join(". ")}`;

  return new AppError(
    message,
    400
  );
}


// ==========================================
// Global Error Handler
// ==========================================

const globalErrorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next
) => {

  // ----------------------------------------
  // Normalize error
  // ----------------------------------------

  const error = err as ErrorWithStatus;

  error.statusCode =
    error.statusCode || 500;

  error.status =
    error.status || "error";


  // ----------------------------------------
  // Development
  // ----------------------------------------

  if (
    process.env.NODE_ENV === "development"
  ) {

    return sendErrorDev(
      error,
      res
    );
  }


  // ----------------------------------------
  // Production
  // ----------------------------------------

  if (
    process.env.NODE_ENV === "production"
  ) {

    let productionError: ErrorWithStatus = {
      ...error,
    };


    // Mongoose CastError
    if (
      err instanceof mongoose.Error.CastError
    ) {

      productionError =
        handleCastErrorDB(err);
    }


    // Mongo duplicate key
    if (
      (err as MongoDuplicateError).code === 11000
    ) {

      productionError =
        handleDuplicateFieldsDB(
          err as MongoDuplicateError
        );
    }


    // Mongoose validation
    if (
      err instanceof mongoose.Error.ValidationError
    ) {

      productionError =
        handleValidationErrorDB(err);
    }


    return sendErrorProd(
      productionError,
      res
    );
  }


  // ----------------------------------------
  // Unknown NODE_ENV
  // ----------------------------------------

  return sendErrorProd(
    error,
    res
  );
};


export default globalErrorHandler;