import { NextResponse } from "next/server"
import { getCourseCurriculum } from "@/lib/course-service"

// Enable ISR with 1 hour revalidation
export const revalidate = 3600

/**
 * Course Contents Endpoint
 * GET: Fetch course sections and lessons from LearnWorlds
 * Includes caching for performance
 */
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const courseId = params.id

    // جلب المنهاج من الكاش أو من LearnWorlds API
    const curriculum = await getCourseCurriculum(courseId)

    if (!curriculum || curriculum.length === 0) {
      return NextResponse.json({
        sections: [],
        contents: [],
        success: true,
        message: "No curriculum found for this course",
      })
    }

    // تحويل البيانات لصيغة متوافقة مع الواجهة
    const sections = curriculum.map((section) => ({
      id: section.id,
      title: section.title,
      description: section.description,
      position: section.position,
      learning_units: section.lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        name: lesson.title,
        type: lesson.type,
        description: lesson.description,
        duration: lesson.duration,
        position: lesson.position,
        free_preview: lesson.freePreview,
        video_url: lesson.videoUrl,
        content_url: lesson.contentUrl,
        resources: lesson.resources?.map((r) => ({
          id: r.id,
          title: r.title,
          name: r.title,
          type: r.type,
          url: r.url,
          size: r.size,
        })),
      })),
    }))

    return NextResponse.json({
      sections,
      contents: sections,
      success: true,
      cached: true,
      revalidateAt: new Date(Date.now() + 3600 * 1000).toISOString(),
    })
  } catch (err: any) {
    console.error("[Course Contents API] Error:", err.message)
    return NextResponse.json(
      {
        error: err.message,
        success: false,
      },
      { status: 500 },
    )
  }
}
