import { type NextRequest, NextResponse } from "next/server"
import { AuthService } from "@/lib/auth-service"

/**
 * Login API Endpoint
 * يدعم:
 * - تسجيل الدخول عبر LearnWorlds
 * - SSO authentication
 * - الحسابات القديمة مع ترحيل تلقائي
 */

interface LoginRequest {
  email: string
  password: string
  migrate?: boolean // لترحيل الحسابات القديمة
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as LoginRequest
    const { email, password, migrate } = body

    // التحقق من البيانات المطلوبة
    if (!email || !password) {
      return NextResponse.json(
        { error: "البريد الإلكتروني وكلمة المرور مطلوبان", success: false },
        { status: 400 }
      )
    }

    if (!email.includes("@")) {
      return NextResponse.json(
        { error: "صيغة البريد الإلكتروني غير صالحة", success: false },
        { status: 400 }
      )
    }

    console.log("[Login API] Attempting login for:", email)

    // محاولة تسجيل الدخول
    const result = await AuthService.login(email, password)

    // التحقق من SSO
    if (result.requiresSSO && result.ssoUrl) {
      console.log("[Login API] SSO required for:", email)
      return NextResponse.json({
        success: false,
        requiresSSO: true,
        ssoUrl: result.ssoUrl,
        message: "يتطلب تسجيل الدخول عبر SSO",
      })
    }

    // فشل تسجيل الدخول
    if (!result.success) {
      console.log("[Login API] Login failed for:", email)
      return NextResponse.json(
        { 
          error: result.error || "بريد إلكتروني أو كلمة مرور غير صحيحة",
          success: false 
        },
        { status: 401 }
      )
    }

    // نجاح تسجيل الدخول
    console.log("[Login API] Login successful for:", result.user?.id)

    return NextResponse.json({
      success: true,
      token: result.session?.token,
      user: {
        id: result.user!.id,
        email: result.user!.email,
        firstName: result.user!.firstName,
        lastName: result.user!.lastName,
        avatar: result.user!.avatar,
        enrolledCourses: result.user!.enrolledCourses || [],
        role: result.user!.role,
      },
      migrated: result.migrated,
    })
  } catch (error: any) {
    console.error("[Login API] Unexpected error:", error)
    return NextResponse.json(
      { 
        error: "فشل تسجيل الدخول. يرجى المحاولة مرة أخرى.",
        success: false 
      },
      { status: 500 }
    )
  }
}
