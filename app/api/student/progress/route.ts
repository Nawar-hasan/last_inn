import { NextResponse } from "next/server"
import { fetchCourseProgress } from "@/lib/learnworlds-client"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")
    const courseId = searchParams.get("courseId")

    console.log("[v0] Progress API called with:", { userId, courseId })

    if (!userId || !courseId) {
      console.log("[v0] Missing required parameters")
      return NextResponse.json({ error: "Missing userId or courseId" }, { status: 400 })
    }

    if (courseId === "undefined" || courseId === "null") {
      console.log("[v0] Invalid courseId:", courseId)
      return NextResponse.json(
        {
          error: "Invalid courseId",
          progress: { completed: 0, total: 0, percent: 0 },
          success: false,
        },
        { status: 400 },
      )
    }

    console.log("[v0] Fetching progress:", { userId, courseId })

    const progress = await fetchCourseProgress(userId, courseId)

    console.log("[v0] Progress fetched successfully:", progress)
    return NextResponse.json({
      progress: progress || { completed: 0, total: 0, percent: 0 },
      success: true,
    })
  } catch (err: any) {
    console.error("[v0] Progress API Exception:", err.message)
    return NextResponse.json(
      {
        error: err.message,
        progress: { completed: 0, total: 0, percent: 0 },
        success: false,
      },
      { status: 200 },
    )
  }
}
