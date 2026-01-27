import { NextResponse } from "next/server"
import { fetchUserEnrollments } from "@/lib/learnworlds-client"
import { getValidatedSession } from "@/app/api/auth/session/route"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 })
    }

    const session = await getValidatedSession()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    if (session.user.id !== userId) {
      console.log("[v0] Security: User tried to access another user's enrollments", {
        sessionUserId: session.user.id,
        requestedUserId: userId,
      })
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 })
    }

    console.log("[v0] Fetching enrollments for user:", userId)

    const enrollments = await fetchUserEnrollments(userId)

    console.log("[v0] Enrollments fetched successfully:", enrollments.length)
    return NextResponse.json({
      enrollments,
      count: enrollments.length,
      success: true,
    })
  } catch (err: any) {
    console.error("[v0] Enrollments API error:", err.message)
    return NextResponse.json(
      {
        error: err.message,
        enrollments: [],
        success: false,
      },
      { status: 500 },
    )
  }
}
