import { type NextRequest, NextResponse } from "next/server"
import { AuthService } from "@/lib/auth-service"

/**
 * Registration API Endpoint
 * يدعم:
 * - إنشاء حساب جديد في LearnWorlds
 * - التحقق من قوة كلمة المرور
 * - منع التسجيل المكرر
 */

interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as RegisterRequest
    const { email, password, firstName, lastName } = body

    console.log("[Register API] Registration attempt for:", email)

    // التحقق من البيانات المطلوبة
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: "جميع الحقول مطلوبة", success: false },
        { status: 400 }
      )
    }

    if (!email.includes("@")) {
      return NextResponse.json(
        { error: "صيغة البريد الإلكتروني غير صالحة", success: false },
        { status: 400 }
      )
    }

    // التحقق من قوة كلمة المرور
    const passwordValidation = AuthService.validatePasswordStrength(password)
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { 
          error: passwordValidation.errors[0],
          errors: passwordValidation.errors,
          success: false 
        },
        { status: 400 }
      )
    }

    // محاولة التسجيل
    const result = await AuthService.register({
      email,
      password,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
    })

    // فشل التسجيل
    if (!result.success) {
      console.log("[Register API] Registration failed for:", email, result.error)
      
      const statusCode = result.error?.includes("مسجل مسبقاً") ? 409 : 400
      
      return NextResponse.json(
        { error: result.error, success: false },
        { status: statusCode }
      )
    }

    // نجاح التسجيل
    console.log("[Register API] Registration successful for:", result.user?.id)

    return NextResponse.json({
      success: true,
      token: result.session?.token,
      user: {
        id: result.user!.id,
        email: result.user!.email,
        firstName: result.user!.firstName,
        lastName: result.user!.lastName,
        enrolledCourses: [],
        role: result.user!.role,
      },
    })
  } catch (error: any) {
    console.error("[Register API] Unexpected error:", error)
    return NextResponse.json(
      { 
        error: "فشل التسجيل. يرجى المحاولة مرة أخرى.",
        success: false 
      },
      { status: 500 }
    )
  }
}
