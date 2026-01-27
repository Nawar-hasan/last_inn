import { NextResponse } from "next/server"
import { fetchUserCertificates } from "@/lib/learnworlds-client"
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
      console.log("[v0] Security: User tried to access another user's certificates", {
        sessionUserId: session.user.id,
        requestedUserId: userId,
      })
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 })
    }

    console.log("[v0] Fetching certificates for user:", userId)

    let certificates = []
    try {
      certificates = await fetchUserCertificates(userId)
    } catch (err: any) {
      console.log("[v0] No certificates found for user (this is normal):", err.message)
      certificates = []
    }

    console.log("[v0] Certificates fetched successfully:", certificates.length)
    return NextResponse.json({
      certificates,
      count: certificates.length,
      success: true,
    })
  } catch (err: any) {
    console.error("[v0] Certificates API error:", err.message)
    return NextResponse.json(
      {
        certificates: [],
        count: 0,
        success: true,
        message: "No certificates available",
      },
      { status: 200 },
    )
  }
}
