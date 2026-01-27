import { NextResponse } from "next/server"
import { AuthService, type SessionData } from "@/lib/auth-service"
import { learnworldsClient } from "@/lib/learnworlds-client"

/**
 * Session API Endpoint
 * GET: استرجاع الجلسة الحالية مع تجديد تلقائي
 * DELETE: إنهاء الجلسة (تسجيل الخروج)
 */

/**
 * Helper function to get validated session
 * Used by other API routes that need to check authentication
 */
export async function getValidatedSession(): Promise<SessionData | null> {
  try {
    const session = await AuthService.getSession()
    
    if (!session) {
      return null
    }
    
    // Check if session is expired
    if (session.expiresAt < Date.now()) {
      await AuthService.destroySession()
      return null
    }
    
    return session
  } catch (error) {
    console.error("[Session] Validation failed:", error)
    return null
  }
}

export async function GET() {
  try {
    // استرجاع الجلسة مع تجديد تلقائي إذا لزم
    const session = await AuthService.refreshSessionIfNeeded()

    if (!session) {
      return NextResponse.json(
        { user: null, authenticated: false },
        { status: 200 }
      )
    }

    // محاولة تحديث بيانات المستخدم من LearnWorlds
    let verified = false
    let updatedUser = session.user

    if (session.user.learnworldsId && learnworldsClient.isConfigured()) {
      try {
        const lwUser = await learnworldsClient.getUserById(session.user.learnworldsId)
        
        if (lwUser) {
          verified = true
          updatedUser = {
            ...session.user,
            firstName: lwUser.fields?.first_name || session.user.firstName,
            lastName: lwUser.fields?.last_name || session.user.lastName,
            avatar: lwUser.avatar || session.user.avatar,
            enrolledCourses: lwUser.enrolled_courses || session.user.enrolledCourses,
          }
        }
      } catch (error: any) {
        console.warn("[Session API] Could not verify with LearnWorlds:", error.message)
        // نستمر مع البيانات المخزنة
      }
    }

    return NextResponse.json({
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        avatar: updatedUser.avatar,
        enrolledCourses: updatedUser.enrolledCourses || [],
        role: updatedUser.role,
      },
      authenticated: true,
      verified,
      expiresAt: session.expiresAt,
      source: session.source,
    })
  } catch (error) {
    console.error("[Session API] GET error:", error)
    return NextResponse.json(
      { user: null, authenticated: false },
      { status: 200 }
    )
  }
}

export async function POST() {
  return NextResponse.json(
    { error: "استخدم /api/auth/login أو /api/auth/register", success: false },
    { status: 400 }
  )
}

export async function DELETE() {
  try {
    await AuthService.logout()
    
    console.log("[Session API] Session destroyed successfully")
    
    return NextResponse.json({
      success: true,
      message: "تم تسجيل الخروج بنجاح",
    })
  } catch (error) {
    console.error("[Session API] DELETE error:", error)
    return NextResponse.json(
      { error: "فشل تسجيل الخروج", success: false },
      { status: 500 }
    )
  }
}
