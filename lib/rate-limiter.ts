interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Max requests per window
}

interface RateLimitEntry {
  count: number
  resetTime: number
}

class RateLimiter {
  private storage = new Map<string, RateLimitEntry>()
  private cleanupInterval: NodeJS.Timeout | null = null

  constructor() {
    // Cleanup expired entries every minute
    this.cleanupInterval = setInterval(() => {
      this.cleanup()
    }, 60000)
  }

  private cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.storage.entries()) {
      if (entry.resetTime < now) {
        this.storage.delete(key)
      }
    }
  }

  check(identifier: string, config: RateLimitConfig): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now()
    const entry = this.storage.get(identifier)

    // No entry or expired entry
    if (!entry || entry.resetTime < now) {
      const newEntry: RateLimitEntry = {
        count: 1,
        resetTime: now + config.windowMs,
      }
      this.storage.set(identifier, newEntry)
      return {
        allowed: true,
        remaining: config.maxRequests - 1,
        resetTime: newEntry.resetTime,
      }
    }

    // Entry exists and not expired
    if (entry.count < config.maxRequests) {
      entry.count++
      return {
        allowed: true,
        remaining: config.maxRequests - entry.count,
        resetTime: entry.resetTime,
      }
    }

    // Rate limit exceeded
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
    }
  }

  reset(identifier: string): void {
    this.storage.delete(identifier)
  }

  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
    }
    this.storage.clear()
  }
}

export const rateLimiter = new RateLimiter()

// Predefined rate limit configurations
export const rateLimitConfigs = {
  // Auth endpoints - stricter limits
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 requests per 15 minutes
  },
  // API endpoints - moderate limits
  api: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 60, // 60 requests per minute
  },
  // Public endpoints - relaxed limits
  public: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100, // 100 requests per minute
  },
  // Webhook endpoints - very relaxed
  webhook: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 1000, // 1000 requests per minute
  },
}

// Helper function to get client identifier
export function getClientIdentifier(req: Request): string {
  // Try to get IP from headers
  const forwardedFor = req.headers.get("x-forwarded-for")
  const realIp = req.headers.get("x-real-ip")
  const ip = forwardedFor?.split(",")[0] || realIp || "unknown"

  // Try to get user ID from authorization
  const authHeader = req.headers.get("authorization")
  if (authHeader) {
    try {
      const token = authHeader.replace("Bearer ", "")
      // You can decode the JWT token here to get user ID
      return `user-${token.substring(0, 10)}`
    } catch {
      // Ignore
    }
  }

  return `ip-${ip}`
}

// Middleware function to apply rate limiting
export async function applyRateLimit(req: Request, config: RateLimitConfig): Promise<Response | null> {
  const identifier = getClientIdentifier(req)
  const result = rateLimiter.check(identifier, config)

  if (!result.allowed) {
    const resetDate = new Date(result.resetTime)
    return new Response(
      JSON.stringify({
        error: "Too many requests",
        message: "Rate limit exceeded. Please try again later.",
        resetTime: resetDate.toISOString(),
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "X-RateLimit-Limit": config.maxRequests.toString(),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": resetDate.toISOString(),
          "Retry-After": Math.ceil((result.resetTime - Date.now()) / 1000).toString(),
        },
      },
    )
  }

  // Add rate limit headers to response
  return null
}
