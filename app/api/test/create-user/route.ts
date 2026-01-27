import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password, firstName, lastName, username } = body

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const apiUrl = process.env.LEARNWORLD_API_URL || "https://api.learnworlds.com/v2"
    const apiKey = process.env.LEARNWORLD_API_KEY
    const schoolId = process.env.LEARNWORLD_SCHOOL_ID

    if (!apiKey || !schoolId) {
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }

    console.log(`[CreateUser] Creating user: ${email}`)

    const res = await fetch(`${apiUrl}/users`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        "Lw-Client": schoolId,
      },
      body: JSON.stringify({
        email,
        password: password || "TempPass123!",
        username: username || email.split("@")[0],
        first_name: firstName || "",
        last_name: lastName || "",
      }),
    })

    const text = await res.text()

    if (!res.ok) {
      console.error("[CreateUser] Error:", res.status, text.substring(0, 500))

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
    console.log(`[CreateUser] Success - User ID: ${data.id}`)

    return NextResponse.json(data)
  } catch (err: any) {
    console.error("[CreateUser] Exception:", err)
    return NextResponse.json({ error: err.message || "Failed to create user" }, { status: 500 })
  }
}
