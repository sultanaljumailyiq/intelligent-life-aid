import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: Record<string, any>;
  };
  timestamp: string;
}

/**
 * Standard error codes for API responses
 */
export enum ErrorCode {
  VALIDATION_ERROR = "VALIDATION_ERROR",
  AUTHENTICATION_ERROR = "AUTHENTICATION_ERROR",
  AUTHORIZATION_ERROR = "AUTHORIZATION_ERROR",
  NOT_FOUND = "NOT_FOUND",
  CONFLICT = "CONFLICT",
  INTERNAL_ERROR = "INTERNAL_ERROR",
  SERVICE_UNAVAILABLE = "SERVICE_UNAVAILABLE",
  BAD_REQUEST = "BAD_REQUEST",
  UNAUTHORIZED = "UNAUTHORIZED",
}

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: ErrorCode,
    message: string,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Send standardized success response
 */
export function sendSuccess<T>(
  res: Response,
  data: T,
  statusCode: number = 200
): Response {
  return res.status(statusCode).json({
    success: true,
    data,
    timestamp: new Date().toISOString(),
  } as ApiResponse<T>);
}

/**
 * Send standardized error response
 */
export function sendError(
  res: Response,
  statusCode: number,
  code: ErrorCode,
  message: string,
  details?: Record<string, any>
): Response {
  return res.status(statusCode).json({
    success: false,
    error: {
      message,
      code,
      ...(details && { details }),
    },
    timestamp: new Date().toISOString(),
  } as ApiResponse);
}

/**
 * Global error handling middleware
 */
export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error("Error caught by error handler:", err);

  // Handle custom API errors
  if (err instanceof ApiError) {
    sendError(res, err.statusCode, err.code, err.message, err.details);
    return;
  }

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const errors: Record<string, string[]> = {};
    for (const issue of err.issues) {
      const path = issue.path.join(".");
      if (!errors[path]) {
        errors[path] = [];
      }
      errors[path].push(issue.message);
    }
    sendError(
      res,
      400,
      ErrorCode.VALIDATION_ERROR,
      "Request validation failed",
      errors
    );
    return;
  }

  // Handle standard errors
  if (err instanceof Error) {
    const message = err.message || "An unexpected error occurred";

    // Database errors
    if (message.includes("UNIQUE constraint failed")) {
      sendError(
        res,
        409,
        ErrorCode.CONFLICT,
        "A record with this data already exists",
        { originalError: message }
      );
      return;
    }

    if (message.includes("FOREIGN KEY constraint failed")) {
      sendError(
        res,
        400,
        ErrorCode.BAD_REQUEST,
        "Invalid reference to related record",
        { originalError: message }
      );
      return;
    }

    // Default error
    sendError(
      res,
      500,
      ErrorCode.INTERNAL_ERROR,
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : message,
      process.env.NODE_ENV === "production" ? undefined : { originalError: message }
    );
    return;
  }

  // Unknown error type
  sendError(
    res,
    500,
    ErrorCode.INTERNAL_ERROR,
    "An unexpected error occurred"
  );
}

/**
 * Async route wrapper to catch and pass errors to error handler
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
