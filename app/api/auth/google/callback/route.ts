import { NextResponse, type NextRequest } from "next/server"
import { cookies } from "next/headers"
import { learnworldsClient } from "@/lib/learnworlds-client"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")
  const error = searchParams.get("error")

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

  if (error) {
    console.error("[v0] Google OAuth error:", error)
    return NextResponse.redirect(`${baseUrl}/auth/login?error=google_auth_failed`)
  }

  if (!code) {
    return NextResponse.redirect(`${baseUrl}/auth/login?error=no_code`)
  }

  try {
    // Exchange code for tokens
    const clientId = process.env.GOOGLE_CLIENT_ID
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${baseUrl}/api/auth/google/callback`

    if (!clientId || !clientSecret) {
      console.error("[v0] Google OAuth credentials not configured")
      return NextResponse.redirect(`${baseUrl}/auth/login?error=oauth_not_configured`)
    }

    console.log("[v0] Exchanging code for tokens...")

    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    })

    const tokenData = await tokenResponse.json()

    if (!tokenResponse.ok) {
      console.error("[v0] Token exchange failed:", tokenData)
      return NextResponse.redirect(`${baseUrl}/auth/login?error=token_exchange_failed`)
    }

    // Get user info from Google
    const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    })

    const googleUser = await userInfoResponse.json()

    if (!userInfoResponse.ok) {
      console.error("[v0] Failed to get user info:", googleUser)
      return NextResponse.redirect(`${baseUrl}/auth/login?error=user_info_failed`)
    }

    console.log("[v0] Google user email:", googleUser.email)

    // Try to find or create user in LearnWorlds
    let user = null

    try {
      // First try to find existing user
      user = await learnworldsClient.getUserByEmail(googleUser.email)
      if (user) {
        console.log("[v0] Found existing user:", user.id)
      }
    } catch (findError: any) {
      console.log("[v0] User not found, will create new one")
    }

    if (!user) {
      // User doesn't exist, create new one
      console.log("[v0] Creating new user in LearnWorlds for:", googleUser.email)
      try {
        const registerResponse = await learnworldsClient.register({
          email: googleUser.email,
          password: `Google_${Math.random().toString(36).substring(2, 15)}${Date.now()}!`,
          first_name: googleUser.given_name || googleUser.name?.split(" ")[0] || "User",
          last_name: googleUser.family_name || googleUser.name?.split(" ").slice(1).join(" ") || "",
        })
        user = registerResponse.data || registerResponse
        console.log("[v0] Created new user:", user?.id)
      } catch (createError: any) {
        console.error("[v0] Failed to create user:", createError.message)
        // Try to get user again in case it was created
        user = await learnworldsClient.getUserByEmail(googleUser.email)
      }
    }

    if (!user || !user.id) {
      console.error("[v0] Failed to get or create user")
      return NextResponse.redirect(`${baseUrl}/auth/login?error=user_creation_failed`)
    }

    const userData = {
      id: user.id,
      email: user.email || googleUser.email,
      firstName: googleUser.given_name || user.fields?.first_name || user.username || "",
      lastName: googleUser.family_name || user.fields?.last_name || "",
      enrolledCourses: [],
    }

    const timestamp = Date.now()
    const token = Buffer.from(`${user.id}:${userData.email}:${timestamp}`).toString("base64")

    const sessionData = {
      token,
      user: userData,
      createdAt: timestamp,
      expiresAt: timestamp + 24 * 60 * 60 * 1000, // 24 hours
    }

    const cookieStore = await cookies()

    // Clear any existing sessions (both old and new cookie names)
    cookieStore.delete("learnworlds_session")
    cookieStore.delete("lw_session")
    cookieStore.delete("lw_token")

    // Set session with the correct cookie name
    cookieStore.set("learnworlds_session", JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", // Use lax for OAuth redirects
      maxAge: 24 * 60 * 60,
      path: "/",
    })

    console.log("[v0] Session created successfully for:", userData.email)

    // Redirect to student dashboard
    return NextResponse.redirect(`${baseUrl}/student`)
  } catch (err: any) {
    console.error("[v0] Google OAuth callback error:", err.message)
    return NextResponse.redirect(`${baseUrl}/auth/login?error=auth_failed`)
  }
}
