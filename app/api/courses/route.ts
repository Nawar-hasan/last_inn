import { type NextRequest, NextResponse } from "next/server"
import { getAllCourses } from "@/lib/course-service"

// Enable ISR with 1 hour revalidation
export const revalidate = 3600

export async function GET(request: NextRequest) {
  try {
    // جلب جميع الدورات من الكاش أو من LearnWorlds API
    const courses = await getAllCourses()

    return NextResponse.json({
      courses,
      count: courses.length,
      success: true,
      cached: true,
      revalidateAt: new Date(Date.now() + 3600 * 1000).toISOString(),
    })
  } catch (err: any) {
    console.error("[Courses API] Exception:", err)
    return NextResponse.json(
      {
        error: err.message,
        courses: [],
        success: false,
      },
      { status: 500 },
    )
  }
}
