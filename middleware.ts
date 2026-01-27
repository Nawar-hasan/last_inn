import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { rateLimiter, rateLimitConfigs, getClientIdentifier } from "@/lib/rate-limiter"

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Security headers
  response.headers.set("X-DNS-Prefetch-Control", "on")
  response.headers.set("X-Frame-Options", "SAMEORIGIN")
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("Referrer-Policy", "origin-when-cross-origin")
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()")

  // Apply rate limiting on API routes
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const identifier = getClientIdentifier(request)

    // Determine rate limit config based on endpoint
    let config = rateLimitConfigs.api

    if (request.nextUrl.pathname.startsWith("/api/auth/")) {
      config = rateLimitConfigs.auth
    } else if (request.nextUrl.pathname.startsWith("/api/webhooks/")) {
      config = rateLimitConfigs.webhook
    }

    const result = rateLimiter.check(identifier, config)

    // Add rate limit headers
    response.headers.set("X-RateLimit-Limit", config.maxRequests.toString())
    response.headers.set("X-RateLimit-Remaining", result.remaining.toString())
    response.headers.set("X-RateLimit-Reset", new Date(result.resetTime).toISOString())

    if (!result.allowed) {
      return new NextResponse(
        JSON.stringify({
          error: "Too many requests",
          message: "Rate limit exceeded. Please try again later.",
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": Math.ceil((result.resetTime - Date.now()) / 1000).toString(),
          },
        },
      )
    }
  }

  // Only check admin routes, not the login page
  if (
    request.nextUrl.pathname === "/admin" ||
    (request.nextUrl.pathname.startsWith("/admin/") && !request.nextUrl.pathname.startsWith("/admin/login"))
  ) {
    // Check for admin session cookie
    const adminSession = request.cookies.get("admin-session")

    if (!adminSession || adminSession.value !== "authenticated") {
      // Redirect to login if not authenticated
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  return response
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
}
