import { NextResponse } from "next/server";
import { z } from "zod";
import { isDevelopment } from "@/env";
import {
  type ApiErrorResponse,
  type ApiSuccessResponse,
  NotFoundError,
  ValidationError,
} from "./errors";
import { logger } from "./logger";

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
