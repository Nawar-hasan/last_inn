import { type NextRequest, NextResponse } from "next/server"
import { fetchUserByEmail, fetchUserById } from "@/lib/learnworlds-client"

const LEARNWORLDS_API_URL = process.env.LEARNWORLD_API_URL || "https://api.learnworlds.com/v2"
const LEARNWORLDS_API_KEY = process.env.LEARNWORLD_API_KEY
const LEARNWORLDS_SCHOOL_ID = process.env.LEARNWORLD_SCHOOL_ID

async function handleResponse(response: Response) {
  const text = await response.text()

  if (!response.ok) {
    console.error(`[Users API] Error ${response.status}:`, text.substring(0, 500))
    throw new Error(`LearnWorlds API error: ${response.status}`)
  }

  try {
    return JSON.parse(text)
  } catch {
    console.error("[Users API] Failed to parse JSON:", text.substring(0, 200))
    throw new Error("Invalid response format from LearnWorlds")
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")
    const userId = searchParams.get("userId")

    console.log("[Users API] Request:", { email, userId })

    let data

    if (userId) {
      data = await fetchUserById(userId)
    } else if (email) {
      data = await fetchUserByEmail(email)
    } else {
      return NextResponse.json(
        {
          error: "Missing email or userId parameter",
        },
        { status: 400 },
      )
    }

    console.log("[Users API] Success")
    return NextResponse.json({
      user: data,
      success: true,
    })
  } catch (error: any) {
    console.error("[Users API] Error:", error)
    return NextResponse.json(
      {
        error: error.message || "Failed to fetch user",
        success: false,
      },
      { status: 500 },
    )
  }
}
