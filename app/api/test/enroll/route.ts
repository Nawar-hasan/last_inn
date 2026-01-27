import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { user_id, course_id } = await req.json()

    if (!user_id || !course_id) {
      return NextResponse.json({ error: "user_id and course_id are required" }, { status: 400 })
    }

    const apiUrl = process.env.LEARNWORLD_API_URL || "https://api.learnworlds.com/v2"
    const apiKey = process.env.LEARNWORLD_API_KEY
    const schoolId = process.env.LEARNWORLD_SCHOOL_ID

    if (!apiKey || !schoolId) {
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }

    console.log(`[Enroll] Enrolling user ${user_id} in course ${course_id}`)

    const res = await fetch(`${apiUrl}/users/${user_id}/enrollments`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        "Lw-Client": schoolId,
      },
      body: JSON.stringify({
        course_id,
        price: 0, // Free enrollment for testing
      }),
    })

    const text = await res.text()

    if (!res.ok) {
      console.error("[Enroll] Error:", res.status, text.substring(0, 500))

      let errorMessage = text
      try {
        const errorData = JSON.parse(text)
        errorMessage = errorData.message || errorData.error || text
      } catch {
        errorMessage = text.replace(/<[^>]*>/g, "")
      }

      return NextResponse.json({ error: errorMessage }, { status: res.status })
    }

    const data = JSON.parse(text)
    console.log(`[Enroll] Success`)

    return NextResponse.json(data)
  } catch (err: any) {
    console.error("[Enroll] Exception:", err)
    return NextResponse.json({ error: err.message || "Failed to enroll user" }, { status: 500 })
  }
}
