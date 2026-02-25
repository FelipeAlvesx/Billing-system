// src/shared/errors.ts
export type ErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHENTICATED"
  | "FORBIDDEN"
  | "FEATURE_NOT_ALLOWED"
  | "USAGE_LIMIT_EXCEEDED"
  | "NOT_FOUND"
  | "CONFLICT"
  | "INTERNAL_ERROR";

export class AppError extends Error {
  public readonly status: number;
  public readonly code: ErrorCode;
  public readonly details?: unknown;

  constructor(opts: { status: number; code: ErrorCode; message: string; details?: unknown }) {
    super(opts.message);
    this.status = opts.status;
    this.code = opts.code;
    this.details = opts.details;
  }
}

// Helpers prontos (opcional)
export const Errors = {
  validation: (details?: unknown) =>
    new AppError({ status: 400, code: "VALIDATION_ERROR", message: "Invalid request data.", details }),

  unauthenticated: () =>
    new AppError({ status: 401, code: "UNAUTHENTICATED", message: "Authentication required." }),

  forbidden: () =>
    new AppError({ status: 403, code: "FORBIDDEN", message: "You don't have permission to do this." }),

  featureNotAllowed: (featureKey: string) =>
    new AppError({
      status: 403,
      code: "FEATURE_NOT_ALLOWED",
      message: `Your plan does not allow this feature: ${featureKey}.`,
      details: { featureKey },
    }),

  usageLimitExceeded: (metricKey: string, limit: number, used: number) =>
    new AppError({
      status: 429,
      code: "USAGE_LIMIT_EXCEEDED",
      message: `Monthly usage limit exceeded for ${metricKey}.`,
      details: { metricKey, limit, used },
    }),

  notFound: (resource = "Resource") =>
    new AppError({ status: 404, code: "NOT_FOUND", message: `${resource} not found.` }),

  conflict: (message = "Conflict.") => new AppError({ status: 409, code: "CONFLICT", message }),
};