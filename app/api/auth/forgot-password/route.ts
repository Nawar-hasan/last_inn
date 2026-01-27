import { type NextRequest, NextResponse } from "next/server"
import { learnworldsClient } from "@/lib/learnworlds-client"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }

    if (!learnworldsClient.isConfigured()) {
      console.error("[Forgot Password] LearnWorlds API not configured")
      return NextResponse.json(
        { error: "Password reset service not configured. Please contact support." },
        { status: 503 },
      )
    }

    try {
      await learnworldsClient.requestPasswordReset(email)

      return NextResponse.json({
        success: true,
        message: "If the email exists, a password reset link has been sent",
      })
    } catch (apiError: any) {
      console.error("[Forgot Password] LearnWorlds API error:", apiError.message)

      return NextResponse.json({
        success: true,
        message: "If the email exists, a password reset link has been sent",
      })
    }
  } catch (error) {
    console.error("[Forgot Password] Unexpected error:", error)
    return NextResponse.json({ error: "Failed to process password reset request" }, { status: 500 })
  }
}
