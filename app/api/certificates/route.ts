import { type NextRequest, NextResponse } from "next/server"
import { getUserCertificates, LearnWorldsError } from "@/lib/learnworlds-service"

/**
 * Certificates API
 * GET: جلب شهادات المستخدم من LearnWorlds
 * يستخدم retry logic للتعامل مع الأخطاء المؤقتة
 */

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json(
        { error: "userId required", success: false }, 
        { status: 400 }
      )
    }

    console.log("[Certificates API] Fetching certificates for user:", userId)

    // جلب الشهادات مع retry logic
    const certificates = await getUserCertificates(userId)

    // تحويل البيانات لصيغة موحدة
    const formattedCertificates = certificates.map((cert: any) => ({
      id: cert.id || cert.certificate_id,
      courseId: cert.course_id || cert.product_id,
      courseName: cert.course_name || cert.product_name || "Course",
      userId: cert.user_id || userId,
      certificateNumber: cert.certificate_number || cert.id,
      issuedAt: cert.issued_at || cert.created_at,
      expiresAt: cert.expires_at || null,
      downloadUrl: cert.download_url || cert.url || `/api/certificates/${cert.id}/download`,
      verifyUrl: cert.verify_url || null,
    }))

    return NextResponse.json({
      data: formattedCertificates,
      count: formattedCertificates.length,
      success: true,
    })
  } catch (error: any) {
    console.error("[Certificates API] Error:", error)
    
    const statusCode = error instanceof LearnWorldsError ? error.statusCode || 500 : 500
    
    return NextResponse.json(
      { 
        error: error.message || "Failed to fetch certificates",
        code: error instanceof LearnWorldsError ? error.code : "UNKNOWN_ERROR",
        success: false 
      }, 
      { status: statusCode }
    )
  }
}
