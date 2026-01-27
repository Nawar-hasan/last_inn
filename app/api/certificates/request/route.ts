import { type NextRequest, NextResponse } from "next/server"
import { learnworldsClient } from "@/lib/learnworlds-client"
import { getValidatedSession } from "@/app/api/auth/session/route"

/**
 * Certificate Request API
 * POST: طلب إصدار شهادة للمستخدم
 * يتحقق من تسجيل الدخول وإكمال الدورة
 */

export async function POST(request: NextRequest) {
  try {
    // التحقق من الجلسة
    const session = await getValidatedSession()
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "يرجى تسجيل الدخول", success: false },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { userId, studentId, courseId, fullName, email } = body
    const requestUserId = userId || studentId

    if (!requestUserId || !courseId) {
      return NextResponse.json(
        { error: "البيانات المطلوبة غير مكتملة", success: false },
        { status: 400 }
      )
    }

    // التحقق من أن المستخدم يطلب شهادته فقط
    if (session.user.id !== requestUserId) {
      return NextResponse.json(
        { error: "غير مصرح بهذا الإجراء", success: false },
        { status: 403 }
      )
    }

    // التحقق من إعداد LearnWorlds
    if (!learnworldsClient.isConfigured()) {
      return NextResponse.json(
        { error: "خدمة الشهادات غير متاحة حالياً", success: false },
        { status: 503 }
      )
    }

    try {
      // التحقق من وجود شهادة مسبقة
      const existingCerts = await learnworldsClient.getUserCertificates(requestUserId)
      const existing = existingCerts?.find((c: any) => 
        c.course_id === courseId || c.product_id === courseId
      )

      if (existing) {
        return NextResponse.json({
          success: true,
          alreadyIssued: true,
          certificate: {
            id: existing.id,
            certificateNumber: existing.certificate_number,
            courseId: existing.course_id,
            courseName: existing.course_name,
            issuedAt: existing.issued_at,
            downloadUrl: existing.download_url,
            verifyUrl: existing.verify_url,
          },
          message: "الشهادة موجودة مسبقاً",
        })
      }

      // طلب إصدار شهادة جديدة
      const certificate = await learnworldsClient.requestCertificate(requestUserId, courseId, {
        name: fullName,
        email,
      })

      return NextResponse.json({
        success: true,
        certificate: {
          id: certificate.id,
          certificateNumber: certificate.certificate_number || certificate.number,
          courseId,
          issuedAt: certificate.issued_at || new Date().toISOString(),
          expiresAt: certificate.expires_at || null,
          downloadUrl: certificate.download_url || certificate.url,
          verifyUrl: certificate.verification_url || certificate.verify_url,
        },
        message: "تم إصدار الشهادة بنجاح",
      })
    } catch (apiError: any) {
      console.error("[Certificate Request] API error:", apiError.message)

      if (apiError.message?.includes("not completed") || apiError.message?.includes("incomplete")) {
        return NextResponse.json(
          { error: "يجب إكمال الدورة للحصول على الشهادة", success: false },
          { status: 400 }
        )
      }

      if (apiError.message?.includes("already issued") || apiError.message?.includes("exists")) {
        return NextResponse.json(
          { error: "الشهادة صادرة مسبقاً", success: false },
          { status: 409 }
        )
      }

      return NextResponse.json(
        { error: apiError.message || "فشل في إصدار الشهادة", success: false },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("[Certificate Request] Unexpected error:", error)
    return NextResponse.json(
      { error: "فشل في طلب الشهادة", success: false },
      { status: 500 }
    )
  }
}

// Get student certificates
export async function GET(request: NextRequest) {
  try {
    const studentId = request.nextUrl.searchParams.get("studentId")

    if (!studentId) {
      return NextResponse.json({ error: "Missing studentId parameter" }, { status: 400 })
    }

    // Remove Mock Mode - use LearnWorlds only
    if (!learnworldsClient.isConfigured()) {
      return NextResponse.json({ error: "Certificate service not configured" }, { status: 503 })
    }

    try {
      const certificates = await learnworldsClient.getUserCertificates(studentId)
      return NextResponse.json(certificates)
    } catch (apiError: any) {
      console.error("[Get Certificates] API error:", apiError.message)
      return NextResponse.json({ error: "Failed to fetch certificates" }, { status: 500 })
    }
  } catch (error) {
    console.error("[Get Certificates] Unexpected error:", error)
    return NextResponse.json({ error: "Failed to fetch certificates" }, { status: 500 })
  }
}
