import { type NextRequest, NextResponse } from "next/server"
import { getUserProgress, LearnWorldsError } from "@/lib/learnworlds-service"
import { learnworldsClient } from "@/lib/learnworlds-client"

const API_BASE_URL = "https://api.learnworlds.com/v2"
const API_KEY = process.env.LEARNWORLD_ADMIN_TOKEN
const CLIENT_ID = process.env.LEARNWORLD_CLIENT_ID

/**
 * Progress API
 * GET: جلب تقدم المستخدم في دورة
 * POST: تحديث تقدم المستخدم (إكمال درس)
 * يستخدم retry logic للتعامل مع الأخطاء المؤقتة
 */

// Get student progress
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const courseId = searchParams.get("courseId")

    if (!userId || !courseId) {
      return NextResponse.json(
        { error: "userId and courseId required", success: false }, 
        { status: 400 }
      )
    }

    console.log("[Progress API] Fetching progress:", { userId, courseId })

    // جلب التقدم مع retry logic
    const data = await getUserProgress(userId, courseId)

    // تحويل البيانات لصيغة موحدة
    const formattedProgress = {
      id: data.id || `${userId}-${courseId}`,
      userId,
      courseId,
      completionPercentage: data.completed_percent || data.completion_percentage || 0,
      lessonsCompleted: data.completed_units || data.lessons_completed || 0,
      lessonsTotal: data.total_units || data.lessons_total || 0,
      quizzesCompleted: data.completed_assessments || data.quizzes_completed || 0,
      quizzesTotal: data.total_assessments || data.quizzes_total || 0,
      certificateIssued: data.certificate_issued || false,
      enrolledAt: data.enrolled_at || null,
      lastAccessedAt: data.last_activity_at || data.last_accessed_at || null,
      status: data.status || (data.completed_percent >= 100 ? "completed" : "in_progress"),
      success: true,
    }

    return NextResponse.json(formattedProgress)
  } catch (error: any) {
    console.error("[Progress API] Error:", error)
    
    const statusCode = error instanceof LearnWorldsError ? error.statusCode || 500 : 500
    
    return NextResponse.json(
      { 
        error: error.message || "Failed to fetch progress",
        code: error instanceof LearnWorldsError ? error.code : "UNKNOWN_ERROR",
        success: false 
      }, 
      { status: statusCode }
    )
  }
}

// Update lesson completion
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, courseId, unitId, completed } = body

    if (!userId || !courseId || !unitId) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 })
    }

    if (!API_KEY || !CLIENT_ID) {
      console.log("[Progress API] Mock mode - progress update")
      return NextResponse.json({
        success: true,
        message: "Progress updated (Mock Mode)",
      })
    }

    // Update progress in LearnWorlds
    const url = `${API_BASE_URL}/users/${userId}/courses/${courseId}/units/${unitId}/complete?client_id=${CLIENT_ID}`
    console.log("[Progress API] Updating:", url)

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ completed: completed !== false }),
    })

    const text = await response.text()
    console.log("[Progress API] Update status:", response.status)
    console.log("[Progress API] Update response:", text.substring(0, 500))

    if (!response.ok) {
      return NextResponse.json({ error: `Failed to update progress: ${response.status}` }, { status: response.status })
    }

    return NextResponse.json({
      success: true,
      message: "Progress updated successfully",
    })
  } catch (error) {
    console.error("[Progress API] Update error:", error)
    return NextResponse.json({ error: "Failed to update progress" }, { status: 500 })
  }
}
