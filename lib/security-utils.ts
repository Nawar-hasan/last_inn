// CORS configuration
export const corsHeaders = {
  "Access-Control-Allow-Origin": process.env.NEXT_PUBLIC_APP_URL || "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
}

// Validate JWT token
export function validateAuthToken(request: Request): { valid: boolean; userId?: string; error?: string } {
  try {
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return { valid: false, error: "Missing or invalid authorization header" }
    }

    const token = authHeader.replace("Bearer ", "")

    if (!token) {
      return { valid: false, error: "Token is empty" }
    }

    // Simple token validation (you should use JWT verification in production)
    // This is a placeholder - replace with actual JWT verification
    if (token.length < 10) {
      return { valid: false, error: "Invalid token format" }
    }

    // Extract user ID from token (implement proper JWT decoding)
    const userId = token.substring(0, 24) // Placeholder

    return { valid: true, userId }
  } catch (error) {
    return { valid: false, error: "Token validation failed" }
  }
}

// Sanitize input to prevent XSS
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, "") // Remove < and >
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+=/gi, "") // Remove event handlers
    .trim()
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate password strength
export function isStrongPassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 8) {
    return { valid: false, message: "Password must be at least 8 characters long" }
  }

  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: "Password must contain at least one uppercase letter" }
  }

  if (!/[a-z]/.test(password)) {
    return { valid: false, message: "Password must contain at least one lowercase letter" }
  }

  if (!/[0-9]/.test(password)) {
    return { valid: false, message: "Password must contain at least one number" }
  }

  return { valid: true }
}

// Create standardized error response
export function createErrorResponse(message: string, statusCode = 400, details?: any): Response {
  return new Response(
    JSON.stringify({
      success: false,
      error: message,
      details,
      timestamp: new Date().toISOString(),
    }),
    {
      status: statusCode,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    },
  )
}

// Create standardized success response
export function createSuccessResponse(data: any, message?: string, statusCode = 200): Response {
  return new Response(
    JSON.stringify({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    }),
    {
      status: statusCode,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    },
  )
}

// Handle OPTIONS request for CORS
export function handleOptionsRequest(): Response {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  })
}

// Validate request body
export async function validateRequestBody<T>(
  request: Request,
  requiredFields: string[],
): Promise<{ valid: boolean; data?: T; error?: string }> {
  try {
    const body = await request.json()

    // Check for required fields
    const missingFields = requiredFields.filter((field) => !(field in body))

    if (missingFields.length > 0) {
      return {
        valid: false,
        error: `Missing required fields: ${missingFields.join(", ")}`,
      }
    }

    return { valid: true, data: body as T }
  } catch (error) {
    return { valid: false, error: "Invalid JSON body" }
  }
}

// Generate secure random token
export function generateSecureToken(length = 32): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let token = ""

  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length))
  }

  return token
}

// Check if request is from allowed origin
export function isAllowedOrigin(request: Request): boolean {
  const origin = request.headers.get("origin")
  const allowedOrigins = [process.env.NEXT_PUBLIC_APP_URL, "http://localhost:3000", "http://localhost:3001"].filter(
    Boolean,
  )

  if (!origin) return true // Allow requests without origin (same-origin)

  return allowedOrigins.includes(origin)
}
