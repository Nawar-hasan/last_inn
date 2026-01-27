import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import type { NextRequest } from "next/server"

const SESSION_SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || "innovologia-session-secret-key-change-in-production",
)
const SESSION_COOKIE_NAME = "innovologia_session"

export interface SessionData {
  userId: string
  email: string
  firstName?: string
  lastName?: string
  createdAt: number
  expiresAt: number
}

export async function createSession(userData: Omit<SessionData, "createdAt" | "expiresAt">) {
  const now = Date.now()
  const expiresAt = now + 7 * 24 * 60 * 60 * 1000 // 7 days

  const session: SessionData = {
    ...userData,
    createdAt: now,
    expiresAt,
  }

  const token = await new SignJWT(session)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SESSION_SECRET)

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: "/",
  })

  return session
}

export async function getSession(): Promise<SessionData | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value

    if (!token) {
      return null
    }

    const verified = await jwtVerify(token, SESSION_SECRET)
    const session = verified.payload as unknown as SessionData

    // Check if session is expired
    if (session.expiresAt < Date.now()) {
      await destroySession()
      return null
    }

    return session
  } catch (error) {
    console.error("[Session] Verification failed:", error)
    return null
  }
}

export async function getSessionFromRequest(req: NextRequest): Promise<SessionData | null> {
  try {
    const token = req.cookies.get(SESSION_COOKIE_NAME)?.value

    if (!token) {
      return null
    }

    const verified = await jwtVerify(token, SESSION_SECRET)
    const session = verified.payload as unknown as SessionData

    if (session.expiresAt < Date.now()) {
      return null
    }

    return session
  } catch (error) {
    return null
  }
}

export async function destroySession() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}

export async function updateSession(updates: Partial<SessionData>) {
  const currentSession = await getSession()

  if (!currentSession) {
    return null
  }

  const updatedSession: SessionData = {
    ...currentSession,
    ...updates,
    createdAt: currentSession.createdAt,
    expiresAt: currentSession.expiresAt,
  }

  const token = await new SignJWT(updatedSession)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SESSION_SECRET)

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  })

  return updatedSession
}
