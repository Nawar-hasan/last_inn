import { NextResponse } from "next/server"
import { fetchCourseContents } from "@/lib/learnworlds-client"

export async function GET(req: Request) {
  try {
    const urlObj = new URL(req.url)
    const courseId = urlObj.searchParams.get("courseId")

    if (!courseId) {
      return NextResponse.json({ error: "Missing courseId" }, { status: 400 })
    }

    console.log("[Lessons API] Fetching contents for course:", courseId)

    const sections = await fetchCourseContents(courseId)

    console.log("[Lessons API] Success:", { courseId, sectionsCount: sections.length })
    return NextResponse.json({
      courseId,
      sections,
      count: sections.length,
      success: true,
    })
  } catch (err: any) {
    console.error("[Lessons API] Exception:", err)
    return NextResponse.json(
      {
        error: err.message,
        sections: [],
        success: false,
      },
      { status: 500 },
    )
  }
}
