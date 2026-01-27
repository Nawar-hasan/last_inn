import { type NextRequest, NextResponse } from "next/server"
import { AuthService } from "@/lib/auth-service"

/**
 * Account Migration API Endpoint
 * يدعم ترحيل الحسابات القديمة إلى LearnWorlds
 */

interface MigrateRequest {
  email: string
  password: string
  firstName: string
  lastName: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as MigrateRequest
    const { email, password, firstName, lastName } = body

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

    console.log("[Migration API] Attempting migration for:", email)

    // محاولة ترحيل الحساب
    const result = await AuthService.migrateAccount(email, password, {
      firstName: firstName || email.split("@")[0],
      lastName: lastName || "",
    })

    if (!result.success) {
      console.log("[Migration API] Migration failed for:", email, result.error)
      return NextResponse.json(
        { error: result.error, success: false },
        { status: 400 }
      )
    }

    console.log("[Migration API] Migration successful for:", result.user?.id)

    return NextResponse.json({
      success: true,
      migrated: true,
      token: result.session?.token,
      user: {
        id: result.user!.id,
        email: result.user!.email,
        firstName: result.user!.firstName,
        lastName: result.user!.lastName,
        enrolledCourses: result.user!.enrolledCourses || [],
        role: result.user!.role,
      },
      message: "تم ترحيل حسابك بنجاح",
    })
  } catch (error: any) {
    console.error("[Migration API] Unexpected error:", error)
    return NextResponse.json(
      { 
        error: "فشل ترحيل الحساب. يرجى المحاولة مرة أخرى.",
        success: false 
      },
      { status: 500 }
    )
  }
}
