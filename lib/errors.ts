export class ValidationError extends Error {
  public readonly code: string;

  constructor(message: string, code = "VALIDATION_ERROR") {
    super(message);
    this.name = "ValidationError";
    this.code = code;
  }
}

export class DatabaseError extends Error {
  public readonly code: string;

  constructor(
    message: string,
    public readonly originalError?: unknown,
    code = "DATABASE_ERROR"
  ) {
    super(message);
    this.name = "DatabaseError";
    this.code = code;
  }
}

export class NotFoundError extends Error {
  public readonly code: string;

  constructor(resource: string, code = "NOT_FOUND") {
    super(`${resource} not found`);
    this.name = "NotFoundError";
    this.code = code;
  }
}

export interface ApiErrorResponse {
  message: string;
  code: string;
  details?: string[];
  timestamp: string;
}

export interface ApiSuccessResponse<T = unknown> {
  data: T;
  timestamp: string;
}
