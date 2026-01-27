import { NextResponse } from "next/server"
import { getCourseByIdOrSlug } from "@/lib/course-service"

// Enable ISR with 1 hour revalidation
export const revalidate = 3600

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const courseId = params.id

    // جلب الدورة من الكاش أو من LearnWorlds API
    const course = await getCourseByIdOrSlug(courseId)

    if (!course) {
      return NextResponse.json(
        {
          error: "Course not found",
          success: false,
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      course,
      success: true,
      cached: true,
      revalidateAt: new Date(Date.now() + 3600 * 1000).toISOString(),
    })
  } catch (err: any) {
    console.error("[Course Details API] Exception:", err)
    return NextResponse.json(
      {
        error: err.message,
        success: false,
      },
      { status: 500 },
    )
  }
}
