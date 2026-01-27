import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get("email")

    const apiUrl = process.env.LEARNWORLD_API_URL || "https://api.learnworlds.com/v2"
    const apiKey = process.env.LEARNWORLD_API_KEY
    const schoolId = process.env.LEARNWORLD_SCHOOL_ID

    if (!apiKey || !schoolId) {
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }

    let url = `${apiUrl}/users`
    if (email) {
      url += `?email=${encodeURIComponent(email)}`
    }

    console.log(`[GetUsers] Fetching users${email ? ` with email: ${email}` : ""}`)

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
        "Lw-Client": schoolId,
      },
    })

    const text = await res.text()

    if (!res.ok) {
      console.error("[GetUsers] Error:", res.status, text.substring(0, 500))

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
    console.log(`[GetUsers] Success - Found ${data.data?.length || 0} users`)

    return NextResponse.json(data)
  } catch (err: any) {
    console.error("[GetUsers] Exception:", err)
    return NextResponse.json({ error: err.message || "Failed to fetch users" }, { status: 500 })
  }
}
