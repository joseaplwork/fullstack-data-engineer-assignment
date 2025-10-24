import { NextResponse } from "next/server";
import { z } from "zod";
import { isDevelopment } from "@/env";
import { logger } from "../shared/logger";
import {
  type ApiErrorResponse,
  type ApiSuccessResponse,
  NotFoundError,
  ValidationError,
} from "./errors";

/**
 * Creates a successful API response with the provided data and a timestamp.
 *
 * @param data - The data to include in the response body.
 * @param status - The HTTP status code for the response. Defaults to 200.
 * @returns A NextResponse object containing the success response with data and timestamp.
 */
export function createSuccessResponse<T>(
  data: T,
  status = 200
): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json(
    {
      data,
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}

export function createErrorResponse(
  message: string,
  code: string,
  status = 500,
  details?: string[]
): NextResponse<ApiErrorResponse> {
  const response: ApiErrorResponse = {
    message,
    code,
    timestamp: new Date().toISOString(),
  };

  if (details) {
    response.details = details;
  }

  return NextResponse.json(response, { status });
}

/**
 * Centralized error handler for all API routes.
 *
 * Error handling strategy:
 * - ValidationError → 400 Bad Request
 * - NotFoundError → 404 Not Found
 * - ZodError → 400 Bad Request with validation details
 * - Unknown errors → 500 Internal Server Error
 *
 * Security: Sanitizes error messages in production to prevent information leakage.
 * Development: Returns full error details including stack traces.
 *
 * @param error - The caught error object
 * @param context - Route path for logging context
 * @returns NextResponse with appropriate status code and error payload
 */
export function handleApiError(
  error: unknown,
  context: string
): NextResponse<ApiErrorResponse> {
  logger.error(context, error);

  if (error instanceof ValidationError) {
    return createErrorResponse(error.message, error.code, 400);
  }

  if (error instanceof z.ZodError) {
    const validationDetails = error.errors.map((err) => err.message);

    return createErrorResponse(
      "Validation failed",
      "VALIDATION_ERROR",
      400,
      validationDetails
    );
  }

  if (error instanceof NotFoundError) {
    return createErrorResponse(error.message, error.code, 404);
  }

  const errorMessage =
    isDevelopment && error instanceof Error
      ? error.message
      : "Internal server error";

  return createErrorResponse(errorMessage, "INTERNAL_SERVER_ERROR", 500);
}
