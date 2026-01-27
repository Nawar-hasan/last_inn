import { NextResponse } from "next/server"
import { 
  checkUserEnrollment, 
  enrollUserInCourse,
  LearnWorldsError 
} from "@/lib/learnworlds-service"

/**
 * Enrollments API
 * GET: التحقق من تسجيل المستخدم في دورة
 * POST: تسجيل المستخدم في دورة (مع idempotency)
 */

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")
    const courseId = searchParams.get("courseId")

    if (!userId || !courseId) {
      return NextResponse.json(
        { error: "Missing userId or courseId", success: false },
        { status: 400 },
      )
    }

    console.log("[Enrollments API] Checking enrollment:", { userId, courseId })

    const result = await checkUserEnrollment(userId, courseId)

    return NextResponse.json({
      ...result,
      userId,
      courseId,
      success: true,
    })
  } catch (err: any) {
    console.error("[Enrollments API] Exception:", err)
    
    const statusCode = err instanceof LearnWorldsError ? err.statusCode || 500 : 500
    
    return NextResponse.json(
      {
        error: err.message,
        code: err instanceof LearnWorldsError ? err.code : "UNKNOWN_ERROR",
        enrolled: false,
        enrollment: null,
        success: false,
      },
      { status: statusCode },
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { userId, courseId, productType = "course" } = body

    if (!userId || !courseId) {
      return NextResponse.json(
        { error: "Missing userId or courseId", success: false },
        { status: 400 },
      )
    }

    console.log("[Enrollments API] Creating enrollment:", { userId, courseId, productType })

    // الخدمة تتعامل مع idempotency تلقائياً
    const result = await enrollUserInCourse(userId, courseId, productType)

    console.log("[Enrollments API] Enrollment result:", {
      success: true,
      alreadyEnrolled: result.alreadyEnrolled || false,
    })

    return NextResponse.json({
      success: true,
      enrollment: result.enrollment || result,
      alreadyEnrolled: result.alreadyEnrolled || false,
      userId,
      courseId,
    })
  } catch (err: any) {
    console.error("[Enrollments API] Create exception:", err)
    
    const statusCode = err instanceof LearnWorldsError ? err.statusCode || 500 : 500
    
    return NextResponse.json(
      {
        error: err.message,
        code: err instanceof LearnWorldsError ? err.code : "UNKNOWN_ERROR",
        success: false,
      },
      { status: statusCode },
    )
  }
}
