import { type NextRequest, NextResponse } from "next/server"
import { learnworldsClient } from "@/lib/learnworlds-client"
import { cookies } from "next/headers"

async function getUserIdFromSession() {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("learnworlds_session")

    if (!sessionCookie) {
      return null
    }

    const session = JSON.parse(sessionCookie.value)
    return session.user?.id || null
  } catch {
    return null
  }
}

// Get enrollment status
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = await getUserIdFromSession()

    if (!userId) {
      return NextResponse.json({ enrolled: false, message: "Not authenticated" }, { status: 401 })
    }

    const courseId = params.id

    if (!learnworldsClient.isConfigured()) {
      return NextResponse.json({ error: "Enrollment service not configured" }, { status: 503 })
    }

    try {
      const progress = await learnworldsClient.getCourseProgress(userId, courseId)

      if (!progress) {
        return NextResponse.json({
          enrolled: false,
          courseId,
        })
      }

      return NextResponse.json({
        enrolled: true,
        courseId,
        enrollmentDate: progress.enrolled_at,
        progress: progress.completion_percentage || 0,
        lastAccessed: progress.last_accessed_at,
      })
    } catch (apiError: any) {
      console.error("[Enrollment Check] API error:", apiError.message)
      return NextResponse.json({
        enrolled: false,
        courseId,
      })
    }
  } catch (error) {
    console.error("[Enrollment Check] Unexpected error:", error)
    return NextResponse.json({ error: "Failed to check enrollment status" }, { status: 500 })
  }
}

// Enroll in course
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = await getUserIdFromSession()

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const courseId = params.id

    if (!learnworldsClient.isConfigured()) {
      return NextResponse.json({ error: "Enrollment service not configured" }, { status: 503 })
    }

    try {
      const result = await learnworldsClient.enrollUser(userId, courseId)

      return NextResponse.json({
        success: true,
        enrolled: true,
        courseId,
        enrollmentDate: result.enrolled_at || new Date().toISOString(),
        message: "Successfully enrolled in course",
      })
    } catch (apiError: any) {
      console.error("[Enrollment] API error:", apiError.message)

      if (apiError.message?.includes("already enrolled")) {
        return NextResponse.json({ error: "Already enrolled in this course" }, { status: 409 })
      }

      return NextResponse.json({ error: apiError.message || "Failed to enroll in course" }, { status: 500 })
    }
  } catch (error) {
    console.error("[Enrollment] Unexpected error:", error)
    return NextResponse.json({ error: "Failed to enroll in course" }, { status: 500 })
  }
}
