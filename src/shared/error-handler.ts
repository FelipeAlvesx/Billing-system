import type { ErrorRequestHandler } from "express";
import { AppError } from "./errors";

const isDev = process.env.NODE_ENV !== "production";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {

  if (err instanceof AppError) {
    return res.status(err.status).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details ?? undefined,
      },
    });
  }

  console.error(err);

  return res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_ERROR",
      message: "Unexpected server error.",
      details: isDev ? { name: err?.name, message: err?.message, stack: err?.stack } : undefined,
    },
  });
};