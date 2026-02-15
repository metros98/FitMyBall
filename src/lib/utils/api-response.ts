// API response helper utilities
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import type { ApiError } from "@/types/api";

/**
 * Create a successful API response
 */
export function apiSuccess<T>(data: T, status: number = 200): NextResponse {
  return NextResponse.json(data, {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

/**
 * Create an error API response
 */
export function apiError(
  message: string,
  details?: unknown,
  status: number = 500
): NextResponse {
  const error: ApiError = {
    error: message,
    status,
  };

  if (details) {
    error.details = details;
  }

  return NextResponse.json(error, {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

/**
 * Format Zod validation errors into a user-friendly response
 */
export function validationError(error: ZodError): NextResponse {
  const formattedErrors = error.issues.map((err) => ({
    field: err.path.join("."),
    message: err.message,
  }));

  return apiError(
    "Validation failed",
    {
      errors: formattedErrors,
    },
    400
  );
}

/**
 * Common HTTP error responses
 */
export const HttpError = {
  notFound: (resource: string = "Resource"): NextResponse =>
    apiError(`${resource} not found`, undefined, 404),

  unauthorized: (message: string = "Unauthorized"): NextResponse =>
    apiError(message, undefined, 401),

  forbidden: (message: string = "Forbidden"): NextResponse =>
    apiError(message, undefined, 403),

  badRequest: (message: string, details?: unknown): NextResponse =>
    apiError(message, details, 400),

  serverError: (message: string = "Internal server error"): NextResponse =>
    apiError(message, undefined, 500),

  gone: (message: string = "Resource no longer available"): NextResponse =>
    apiError(message, undefined, 410),
};
