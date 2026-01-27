import { type NextRequest, NextResponse } from "next/server"
import { learnworldsClient } from "@/lib/learnworlds-client"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized - No token provided" }, { status: 401 })
    }

    const token = authHeader.substring(7)

    if (!learnworldsClient.isConfigured()) {
      console.error("[Auth Me] LearnWorlds API not configured")
      return NextResponse.json({ error: "Authentication service not configured" }, { status: 503 })
    }

    try {
      const response = await learnworldsClient.getCurrentUser(token)

      const student = {
        id: response.id,
        email: response.email,
        firstName: response.first_name || response.username,
        lastName: response.last_name || "",
        avatar: response.avatar_url || null,
        enrolledCourses: response.enrollments?.map((e: any) => e.course_id) || [],
        createdAt: response.created_at,
      }

      return NextResponse.json({ student })
    } catch (apiError: any) {
      console.error("[Auth Me] LearnWorlds API error:", apiError.message)

      if (apiError.message?.includes("unauthorized") || apiError.message?.includes("token")) {
        return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 })
      }

      return NextResponse.json({ error: "Authentication failed" }, { status: 401 })
    }
  } catch (error) {
    console.error("[Auth Me] Unexpected error:", error)
    return NextResponse.json({ error: "Authentication verification failed" }, { status: 500 })
  }
}
