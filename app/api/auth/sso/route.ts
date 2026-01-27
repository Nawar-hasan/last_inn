import { type NextRequest, NextResponse } from "next/server"
import { AuthService } from "@/lib/auth-service"

export const dynamic = "force-dynamic"

/**
 * SSO Authentication Endpoint
 * يدعم:
 * - إنشاء رابط SSO للتسجيل/الدخول
 * - التحقق من callback SSO
 * - إنشاء جلسة بعد نجاح SSO
 */

interface SSORequest {
  email: string
  provider?: string
  ssoToken?: string // لـ callback
  redirectUrl?: string
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as SSORequest
    const { email, provider, ssoToken, redirectUrl } = body

    console.log("[SSO API] SSO request for:", { email, provider, hasToken: !!ssoToken })

    if (!email) {
      return NextResponse.json(
        { error: "البريد الإلكتروني مطلوب", success: false },
        { status: 400 }
      )
    }

    // إذا لدينا token، فهذا callback من SSO
    if (ssoToken) {
      console.log("[SSO API] Processing SSO callback for:", email)
      
      const result = await AuthService.loginWithSSO(email, ssoToken)
      
      if (result.success) {
        return NextResponse.json({
          success: true,
          token: result.session?.token,
          user: {
            id: result.user!.id,
            email: result.user!.email,
            firstName: result.user!.firstName,
            lastName: result.user!.lastName,
            enrolledCourses: result.user!.enrolledCourses || [],
            role: result.user!.role,
          },
        })
      }
      
      return NextResponse.json(
        { error: result.error || "فشل التحقق من SSO", success: false },
        { status: 401 }
      )
    }

    // إنشاء رابط SSO جديد
    console.log("[SSO API] Creating SSO link for:", email)
    
    const result = await AuthService.loginWithSSO(email)
    
    if (result.ssoUrl) {
      return NextResponse.json({
        success: true,
        requiresSSO: true,
        ssoUrl: result.ssoUrl,
        provider,
      })
    }

    return NextResponse.json(
      { error: "فشل إنشاء رابط SSO", success: false },
      { status: 500 }
    )
  } catch (error: any) {
    console.error("[SSO API] Error:", error.message)
    return NextResponse.json(
      {
        error: error.message || "فشل معالجة SSO",
        success: false,
      },
      { status: 500 }
    )
  }
}

/**
 * SSO Callback Handler
 * يستقبل callback من LearnWorlds بعد نجاح SSO
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const token = searchParams.get("token")
    const email = searchParams.get("email")
    const error = searchParams.get("error")
    
    if (error) {
      console.log("[SSO API] SSO callback error:", error)
      // إعادة التوجيه لصفحة الخطأ
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(error)}`, req.url)
      )
    }
    
    if (!token || !email) {
      return NextResponse.redirect(
        new URL("/login?error=missing_sso_data", req.url)
      )
    }
    
    console.log("[SSO API] Processing SSO callback for:", email)
    
    const result = await AuthService.loginWithSSO(email, token)
    
    if (result.success) {
      // إعادة التوجيه للوحة التحكم
      return NextResponse.redirect(new URL("/student/dashboard", req.url))
    }
    
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(result.error || "sso_failed")}`, req.url)
    )
  } catch (error: any) {
    console.error("[SSO API] Callback error:", error)
    return NextResponse.redirect(
      new URL("/login?error=sso_error", req.url)
    )
  }
}
