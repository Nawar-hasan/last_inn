import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

/**
 * API Route لإعادة تحقق صفحات ISR
 * يُستخدم مع Webhooks لتحديث الصفحات عند تغيير البيانات
 */

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const path = searchParams.get("path")
    const secret = searchParams.get("secret")

    // التحقق من السر
    const expectedSecret = process.env.REVALIDATE_SECRET
    if (!expectedSecret) {
      console.error("[Revalidate] REVALIDATE_SECRET not configured")
      return NextResponse.json(
        { error: "Revalidation not configured" },
        { status: 500 }
      )
    }

    if (secret !== expectedSecret) {
      console.error("[Revalidate] Invalid secret provided")
      return NextResponse.json(
        { error: "Invalid secret" },
        { status: 401 }
      )
    }

    // التحقق من المسار
    if (!path) {
      return NextResponse.json(
        { error: "Path parameter required" },
        { status: 400 }
      )
    }

    // إعادة التحقق
    console.log(`[Revalidate] Revalidating path: ${path}`)
    revalidatePath(path)

    return NextResponse.json({
      revalidated: true,
      path,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error("[Revalidate] Error:", error)
    return NextResponse.json(
      { error: "Revalidation failed", message: error.message },
      { status: 500 }
    )
  }
}

// GET للتحقق من صحة الإعداد
export async function GET() {
  return NextResponse.json({
    configured: !!process.env.REVALIDATE_SECRET,
    message: "Use POST with ?path=/your-path&secret=your-secret to revalidate",
  })
}
