import { type NextRequest, NextResponse } from "next/server"

interface TokenPayload {
  email: string
  iat: number
  exp: number
}

function parseJWT(token: string): TokenPayload | null {
  try {
    const parts = token.split(".")
    if (parts.length !== 3) return null

    const payload = JSON.parse(Buffer.from(parts[1], "base64").toString())

    const now = Math.floor(Date.now() / 1000)
    if (payload.exp && payload.exp < now) {
      return null // Token expired
    }

    return payload
  } catch {
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ error: "Token required" }, { status: 400 })
    }

    const payload = parseJWT(token)
    if (!payload) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 })
    }

    return NextResponse.json({
      valid: true,
      email: payload.email,
    })
  } catch (error) {
    console.error("[v0] Token validation error:", error)
    return NextResponse.json({ error: "Token validation failed" }, { status: 500 })
  }
}
