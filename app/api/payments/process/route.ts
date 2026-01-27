import { type NextRequest, NextResponse } from "next/server"
import { learnworldsClient } from "@/lib/learnworlds-client"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { studentId, courseId, priceId, email, fullName } = body

    console.log("[v0] Payment process request:", { studentId, courseId, priceId })

    if (!studentId || (!courseId && !priceId)) {
      return NextResponse.json({ error: "Missing required fields: studentId and courseId/priceId" }, { status: 400 })
    }

    if (!learnworldsClient.isConfigured()) {
      return NextResponse.json({ error: "Payment service not configured. Please contact support." }, { status: 503 })
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    const finalCourseId = courseId || priceId

    try {
      console.log("[v0] Getting checkout URL for course:", finalCourseId)
      const checkoutUrl = await learnworldsClient.getCheckoutUrl(finalCourseId, studentId)

      console.log("[v0] Checkout URL generated:", checkoutUrl)

      return NextResponse.json({
        success: true,
        checkoutUrl: checkoutUrl,
        message: "Redirect to LearnWorlds checkout",
        requiresRedirect: true,
      })
    } catch (apiError: any) {
      console.error("[v0] Payment process API error:", apiError.message)

      const schoolDomain = process.env.NEXT_PUBLIC_LEARNWORLD_SCHOOL_DOMAIN || "innovologia.learnworlds.com"
      const fallbackUrl = `https://${schoolDomain}/course/${finalCourseId}`

      console.log("[v0] Using fallback checkout URL:", fallbackUrl)

      return NextResponse.json({
        success: true,
        checkoutUrl: fallbackUrl,
        message: "Redirect to LearnWorlds checkout",
        requiresRedirect: true,
      })
    }
  } catch (error: any) {
    console.error("[v0] Payment process unexpected error:", error)
    return NextResponse.json({ error: "Payment processing failed" }, { status: 500 })
  }
}
