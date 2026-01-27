import { apiLogger } from "./api-logger"
import { createErrorResponse } from "./security-utils"

export class APIError extends Error {
  constructor(
    public message: string,
    public statusCode = 500,
    public code?: string,
    public details?: any,
  ) {
    super(message)
    this.name = "APIError"
  }
}

export function handleAPIError(error: unknown, endpoint: string, method: string): Response {
  // Log the error
  apiLogger.log({
    level: "error",
    endpoint,
    method,
    error: error instanceof Error ? error.message : "Unknown error",
    metadata: error instanceof APIError ? { code: error.code, details: error.details } : undefined,
  })

  // Handle different error types
  if (error instanceof APIError) {
    return createErrorResponse(error.message, error.statusCode, {
      code: error.code,
      ...error.details,
    })
  }

  if (error instanceof Error) {
    // Known error
    return createErrorResponse(error.message, 500)
  }

  // Unknown error
  return createErrorResponse("An unexpected error occurred", 500)
}

// Common error creators
export const errors = {
  unauthorized: (message = "Unauthorized") => new APIError(message, 401, "UNAUTHORIZED"),
  forbidden: (message = "Forbidden") => new APIError(message, 403, "FORBIDDEN"),
  notFound: (message = "Not found") => new APIError(message, 404, "NOT_FOUND"),
  badRequest: (message = "Bad request", details?: any) => new APIError(message, 400, "BAD_REQUEST", details),
  conflict: (message = "Conflict") => new APIError(message, 409, "CONFLICT"),
  tooManyRequests: (message = "Too many requests") => new APIError(message, 429, "TOO_MANY_REQUESTS"),
  internal: (message = "Internal server error") => new APIError(message, 500, "INTERNAL_ERROR"),
  serviceUnavailable: (message = "Service unavailable") => new APIError(message, 503, "SERVICE_UNAVAILABLE"),
}
