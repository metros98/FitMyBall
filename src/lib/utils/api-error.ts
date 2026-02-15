// API error handling utilities
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { NextResponse } from "next/server";
import { apiError } from "./api-response";

/**
 * Custom API error class
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Handle and format API errors
 */
export function handleApiError(error: unknown): NextResponse {
  console.error("API Error:", error);

  // Custom ApiError
  if (error instanceof ApiError) {
    return apiError(error.message, error.details, error.statusCode);
  }

  // Zod validation errors
  if (error instanceof ZodError) {
    const formattedErrors = error.issues.map((err) => ({
      field: err.path.join("."),
      message: err.message,
    }));

    return apiError(
      "Validation failed",
      { errors: formattedErrors },
      400
    );
  }

  // Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return handlePrismaError(error);
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return apiError("Invalid data format", undefined, 400);
  }

  // Generic Error
  if (error instanceof Error) {
    // Don't expose internal error messages in production
    const message =
      process.env.NODE_ENV === "development"
        ? error.message
        : "An unexpected error occurred";

    return apiError(message, undefined, 500);
  }

  // Unknown error type
  return apiError("An unexpected error occurred", undefined, 500);
}

/**
 * Handle Prisma-specific errors
 */
function handlePrismaError(
  error: Prisma.PrismaClientKnownRequestError
): NextResponse {
  switch (error.code) {
    case "P2002":
      // Unique constraint violation
      return apiError(
        "A record with this value already exists",
        { field: error.meta?.target },
        409
      );

    case "P2025":
      // Record not found
      return apiError("Record not found", undefined, 404);

    case "P2003":
      // Foreign key constraint violation
      return apiError(
        "Related record not found",
        { field: error.meta?.field_name },
        400
      );

    case "P2014":
      // Invalid ID
      return apiError("Invalid ID format", undefined, 400);

    default:
      // Other Prisma errors
      return apiError(
        process.env.NODE_ENV === "development"
          ? `Database error: ${error.message}`
          : "A database error occurred",
        process.env.NODE_ENV === "development" ? { code: error.code } : undefined,
        500
      );
  }
}

/**
 * Convenience error creators
 */
export const notFound = (resource: string = "Resource"): ApiError =>
  new ApiError(`${resource} not found`, 404);

export const unauthorized = (message: string = "Unauthorized"): ApiError =>
  new ApiError(message, 401);

export const forbidden = (message: string = "Forbidden"): ApiError =>
  new ApiError(message, 403);

export const badRequest = (message: string, details?: unknown): ApiError =>
  new ApiError(message, 400, details);

export const serverError = (message: string = "Internal server error"): ApiError =>
  new ApiError(message, 500);

export const gone = (message: string = "Resource no longer available"): ApiError =>
  new ApiError(message, 410);
