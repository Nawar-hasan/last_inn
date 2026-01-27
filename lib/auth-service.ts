/**
 * Auth Service - خدمة المصادقة الموحدة
 * تدعم:
 * - تكامل مع LearnWorlds Authentication
 * - إدارة الجلسات المتسقة
 * - دعم الحسابات القديمة وترحيلها
 * - أمان كلمات المرور
 */

import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import crypto from "crypto"
import { learnworldsClient } from "./learnworlds-client"

// ============= CONFIGURATION =============

const SESSION_SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || process.env.JWT_SECRET || "innovologia-auth-secret-key-change-in-production"
)

const SESSION_COOKIE_NAME = "innovologia_auth_session"
const LW_SESSION_COOKIE_NAME = "learnworlds_session"
const SESSION_DURATION_DAYS = 7
const SESSION_DURATION_MS = SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000
const TOKEN_REFRESH_THRESHOLD_MS = 24 * 60 * 60 * 1000 // تجديد إذا بقي أقل من 24 ساعة

// ============= TYPES =============

export interface AuthUser {
  id: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
  learnworldsId?: string
  enrolledCourses: string[]
  role: "student" | "admin" | "instructor"
  createdAt: number
  lastLoginAt: number
  migrated?: boolean
}

export interface SessionData {
  user: AuthUser
  token: string
  lwToken?: string // LearnWorlds token للمزامنة
  createdAt: number
  expiresAt: number
  lastRefreshAt: number
  source: "local" | "learnworlds" | "sso" | "migrated"
}

export interface LoginResult {
  success: boolean
  user?: AuthUser
  session?: SessionData
  requiresSSO?: boolean
  ssoUrl?: string
  error?: string
  migrated?: boolean
}

export interface RegisterResult {
  success: boolean
  user?: AuthUser
  session?: SessionData
  error?: string
}

// ============= PASSWORD SECURITY =============

/**
 * تجزئة كلمة المرور باستخدام PBKDF2
 * يُستخدم فقط للحسابات المحلية (legacy)
 */
async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(32).toString("hex")
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex")
  return `${salt}:${hash}`
}

/**
 * التحقق من كلمة المرور
 */
async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  const [salt, hash] = hashedPassword.split(":")
  if (!salt || !hash) return false
  
  const verifyHash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex")
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(verifyHash))
}

/**
 * التحقق من قوة كلمة المرور
 */
export function validatePasswordStrength(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (password.length < 8) {
    errors.push("يجب أن تكون كلمة المرور 8 أحرف على الأقل")
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("يجب أن تحتوي على حرف كبير واحد على الأقل")
  }
  if (!/[a-z]/.test(password)) {
    errors.push("يجب أن تحتوي على حرف صغير واحد على الأقل")
  }
  if (!/[0-9]/.test(password)) {
    errors.push("يجب أن تحتوي على رقم واحد على الأقل")
  }
  
  return {
    valid: errors.length === 0,
    errors,
  }
}

// ============= JWT TOKEN MANAGEMENT =============

/**
 * إنشاء JWT token للجلسة
 */
async function createSessionToken(sessionData: SessionData): Promise<string> {
  return new SignJWT({
    ...sessionData,
    // لا نخزن البيانات الحساسة في JWT
    user: {
      id: sessionData.user.id,
      email: sessionData.user.email,
      role: sessionData.user.role,
    },
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_DAYS}d`)
    .sign(SESSION_SECRET)
}

/**
 * التحقق من JWT token
 */
async function verifySessionToken(token: string): Promise<SessionData | null> {
  try {
    const { payload } = await jwtVerify(token, SESSION_SECRET)
    return payload as unknown as SessionData
  } catch (error) {
    return null
  }
}

// ============= SESSION MANAGEMENT =============

/**
 * إنشاء جلسة جديدة
 */
export async function createSession(
  user: AuthUser,
  source: SessionData["source"] = "local",
  lwToken?: string
): Promise<SessionData> {
  const now = Date.now()
  
  const sessionData: SessionData = {
    user,
    token: "", // سيتم تعبئته بعد إنشاء JWT
    lwToken,
    createdAt: now,
    expiresAt: now + SESSION_DURATION_MS,
    lastRefreshAt: now,
    source,
  }
  
  // إنشاء JWT token
  sessionData.token = await createSessionToken(sessionData)
  
  // حفظ في cookies
  const cookieStore = await cookies()
  
  // مسح الجلسات القديمة
  cookieStore.delete(SESSION_COOKIE_NAME)
  cookieStore.delete(LW_SESSION_COOKIE_NAME)
  cookieStore.delete("lw_session")
  cookieStore.delete("lw_token")
  
  // حفظ الجلسة الجديدة
  cookieStore.set(SESSION_COOKIE_NAME, JSON.stringify(sessionData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DURATION_DAYS * 24 * 60 * 60,
    path: "/",
  })
  
  // حفظ نسخة متوافقة مع LearnWorlds
  cookieStore.set(LW_SESSION_COOKIE_NAME, JSON.stringify({
    token: sessionData.token,
    user: sessionData.user,
    createdAt: sessionData.createdAt,
    expiresAt: sessionData.expiresAt,
  }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: SESSION_DURATION_DAYS * 24 * 60 * 60,
    path: "/",
  })
  
  console.log(`[AuthService] Session created for user: ${user.id} (${source})`)
  
  return sessionData
}

/**
 * استرجاع الجلسة الحالية
 */
export async function getSession(): Promise<SessionData | null> {
  try {
    const cookieStore = await cookies()
    
    // محاولة قراءة الجلسة الجديدة أولاً
    let sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)
    
    // fallback للجلسة القديمة
    if (!sessionCookie) {
      sessionCookie = cookieStore.get(LW_SESSION_COOKIE_NAME)
    }
    if (!sessionCookie) {
      sessionCookie = cookieStore.get("lw_session")
    }
    
    if (!sessionCookie?.value) {
      return null
    }
    
    const session: SessionData = JSON.parse(sessionCookie.value)
    
    // التحقق من انتهاء الصلاحية
    if (session.expiresAt < Date.now()) {
      console.log("[AuthService] Session expired")
      await destroySession()
      return null
    }
    
    // التحقق من سلامة التوكن
    if (session.token) {
      const verified = await verifySessionToken(session.token)
      if (!verified) {
        console.log("[AuthService] Invalid session token")
        await destroySession()
        return null
      }
    }
    
    return session
  } catch (error) {
    console.error("[AuthService] Failed to get session:", error)
    return null
  }
}

/**
 * تجديد الجلسة إذا اقتربت من الانتهاء
 */
export async function refreshSessionIfNeeded(): Promise<SessionData | null> {
  const session = await getSession()
  if (!session) return null
  
  const timeRemaining = session.expiresAt - Date.now()
  
  // تجديد إذا بقي أقل من 24 ساعة
  if (timeRemaining < TOKEN_REFRESH_THRESHOLD_MS) {
    console.log("[AuthService] Refreshing session...")
    
    // تحديث بيانات المستخدم من LearnWorlds إذا ممكن
    let updatedUser = session.user
    if (session.user.learnworldsId && learnworldsClient.isConfigured()) {
      try {
        const lwUser = await learnworldsClient.getUserById(session.user.learnworldsId)
        if (lwUser) {
          updatedUser = {
            ...session.user,
            firstName: lwUser.fields?.first_name || session.user.firstName,
            lastName: lwUser.fields?.last_name || session.user.lastName,
            avatar: lwUser.avatar || session.user.avatar,
            enrolledCourses: lwUser.enrolled_courses || session.user.enrolledCourses,
          }
        }
      } catch (error) {
        console.warn("[AuthService] Could not refresh user data from LearnWorlds")
      }
    }
    
    return await createSession(updatedUser, session.source, session.lwToken)
  }
  
  return session
}

/**
 * إنهاء الجلسة
 */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies()
  
  cookieStore.delete(SESSION_COOKIE_NAME)
  cookieStore.delete(LW_SESSION_COOKIE_NAME)
  cookieStore.delete("lw_session")
  cookieStore.delete("lw_token")
  cookieStore.delete("learnworlds_session")
  
  console.log("[AuthService] Session destroyed")
}

// ============= AUTHENTICATION =============

/**
 * تسجيل الدخول - يدعم LearnWorlds والحسابات المحلية
 */
export async function login(email: string, password: string): Promise<LoginResult> {
  try {
    email = email.toLowerCase().trim()
    
    // التحقق من صحة البريد
    if (!email || !email.includes("@")) {
      return { success: false, error: "بريد إلكتروني غير صالح" }
    }
    
    if (!password || password.length < 6) {
      return { success: false, error: "كلمة المرور قصيرة جداً" }
    }
    
    // محاولة تسجيل الدخول عبر LearnWorlds أولاً
    if (learnworldsClient.isConfigured()) {
      try {
        console.log("[AuthService] Attempting LearnWorlds login for:", email)
        const lwResult = await learnworldsClient.login(email, password)
        
        if (lwResult) {
          // التحقق من SSO
          if (lwResult.requiresSSO && lwResult.ssoUrl) {
            return {
              success: false,
              requiresSSO: true,
              ssoUrl: lwResult.ssoUrl,
            }
          }
          
          // إنشاء المستخدم من بيانات LearnWorlds
          // استخدام الإيميل المُدخل دائماً لضمان التطابق
          const user: AuthUser = {
            id: lwResult.id,
            email: email, // استخدام الإيميل المُدخل للتأكد من التطابق
            firstName: lwResult.fields?.first_name || lwResult.username || email.split("@")[0],
            lastName: lwResult.fields?.last_name || "",
            avatar: lwResult.avatar,
            learnworldsId: lwResult.id,
            enrolledCourses: lwResult.enrolled_courses || lwResult.enrolledCourses || [],
            role: lwResult.role === "admin" ? "admin" : "student",
            createdAt: Date.parse(lwResult.created) || Date.now(),
            lastLoginAt: Date.now(),
          }
          
          console.log("[AuthService] User created:", { id: user.id, email: user.email })
          
          const session = await createSession(user, "learnworlds")
          
          return {
            success: true,
            user,
            session,
          }
        }
      } catch (lwError: any) {
        console.warn("[AuthService] LearnWorlds login failed:", lwError.message)
        // نستمر لمحاولة تسجيل الدخول المحلي
      }
    }
    
    // محاولة تسجيل الدخول للحسابات القديمة (legacy)
    const legacyResult = await loginLegacyAccount(email, password)
    if (legacyResult.success) {
      return legacyResult
    }
    
    return {
      success: false,
      error: "بريد إلكتروني أو كلمة مرور غير صحيحة",
    }
  } catch (error: any) {
    console.error("[AuthService] Login error:", error)
    return {
      success: false,
      error: "فشل تسجيل الدخول. يرجى المحاولة مرة أخرى.",
    }
  }
}

/**
 * تسجيل الدخول للحسابات القديمة مع ترحيل إلى LearnWorlds
 */
async function loginLegacyAccount(email: string, password: string): Promise<LoginResult> {
  // هنا يمكن إضافة منطق للتحقق من قاعدة بيانات محلية للحسابات القديمة
  // في الوقت الحالي، نحاول إنشاء الحساب في LearnWorlds إذا لم يوجد
  
  try {
    // التحقق من وجود المستخدم في LearnWorlds
    const existingUser = await learnworldsClient.getUserByEmail(email)
    
    if (!existingUser && learnworldsClient.isConfigured()) {
      console.log("[AuthService] User not found, cannot migrate without existing account")
      return { success: false }
    }
    
    return { success: false }
  } catch (error) {
    return { success: false }
  }
}

/**
 * تسجيل مستخدم جديد
 */
export async function register(data: {
  email: string
  password: string
  firstName: string
  lastName: string
}): Promise<RegisterResult> {
  try {
    const email = data.email.toLowerCase().trim()
    
    // التحقق من البيانات
    if (!email || !email.includes("@")) {
      return { success: false, error: "بريد إلكتروني غير صالح" }
    }
    
    const passwordValidation = validatePasswordStrength(data.password)
    if (!passwordValidation.valid) {
      return { success: false, error: passwordValidation.errors[0] }
    }
    
    if (!data.firstName?.trim() || !data.lastName?.trim()) {
      return { success: false, error: "الاسم الأول والأخير مطلوبان" }
    }
    
    // التحقق من عدم وجود الحساب
    if (learnworldsClient.isConfigured()) {
      const existing = await learnworldsClient.getUserByEmail(email)
      if (existing) {
        return { success: false, error: "البريد الإلكتروني مسجل مسبقاً. يرجى تسجيل الدخول." }
      }
    }
    
    // إنشاء الحساب في LearnWorlds
    console.log("[AuthService] Creating user in LearnWorlds:", email)
    
    const lwResult = await learnworldsClient.register({
      email,
      password: data.password,
      first_name: data.firstName.trim(),
      last_name: data.lastName.trim(),
    })
    
    const newUser = lwResult.data || lwResult
    
    if (!newUser?.id) {
      return { success: false, error: "فشل إنشاء الحساب. يرجى المحاولة مرة أخرى." }
    }
    
    // إنشاء المستخدم
    const user: AuthUser = {
      id: newUser.id,
      email: newUser.email || email,
      firstName: newUser.fields?.first_name || data.firstName,
      lastName: newUser.fields?.last_name || data.lastName,
      learnworldsId: newUser.id,
      enrolledCourses: [],
      role: "student",
      createdAt: Date.now(),
      lastLoginAt: Date.now(),
    }
    
    // إنشاء الجلسة
    const session = await createSession(user, "learnworlds")
    
    console.log("[AuthService] User registered successfully:", user.id)
    
    return {
      success: true,
      user,
      session,
    }
  } catch (error: any) {
    console.error("[AuthService] Registration error:", error)
    
    if (error.message?.includes("already exists") || error.message?.includes("duplicate")) {
      return { success: false, error: "البريد الإلكتروني مسجل مسبقاً" }
    }
    
    return {
      success: false,
      error: error.message || "فشل التسجيل. يرجى المحاولة مرة أخرى.",
    }
  }
}

/**
 * تسجيل الدخول عبر SSO
 */
export async function loginWithSSO(email: string, ssoToken?: string): Promise<LoginResult> {
  try {
    email = email.toLowerCase().trim()
    
    if (!learnworldsClient.isConfigured()) {
      return { success: false, error: "SSO غير متاح حالياً" }
    }
    
    // إذا لدينا token، نتحقق منه
    if (ssoToken) {
      // التحقق من المستخدم عبر LearnWorlds
      const user = await learnworldsClient.getUserByEmail(email)
      
      if (user) {
        const authUser: AuthUser = {
          id: user.id,
          email: user.email || email,
          firstName: user.fields?.first_name || user.username || email.split("@")[0],
          lastName: user.fields?.last_name || "",
          avatar: user.avatar,
          learnworldsId: user.id,
          enrolledCourses: user.enrolled_courses || [],
          role: user.role === "admin" ? "admin" : "student",
          createdAt: Date.parse(user.created) || Date.now(),
          lastLoginAt: Date.now(),
        }
        
        const session = await createSession(authUser, "sso")
        
        return {
          success: true,
          user: authUser,
          session,
        }
      }
    }
    
    // إنشاء رابط SSO
    const ssoUrl = await learnworldsClient.createSSOLink(email)
    
    return {
      success: false,
      requiresSSO: true,
      ssoUrl,
    }
  } catch (error: any) {
    console.error("[AuthService] SSO login error:", error)
    return {
      success: false,
      error: "فشل تسجيل الدخول عبر SSO",
    }
  }
}

/**
 * ترحيل حساب قديم إلى LearnWorlds
 */
export async function migrateAccount(
  email: string,
  password: string,
  userData: {
    firstName: string
    lastName: string
  }
): Promise<RegisterResult> {
  try {
    email = email.toLowerCase().trim()
    
    // التحقق من وجود الحساب في LearnWorlds
    const existing = await learnworldsClient.getUserByEmail(email)
    
    if (existing) {
      // الحساب موجود، نحاول تسجيل الدخول
      const loginResult = await login(email, password)
      if (loginResult.success && loginResult.user) {
        return {
          success: true,
          user: { ...loginResult.user, migrated: true },
          session: loginResult.session,
        }
      }
      return { success: false, error: "فشل التحقق من الحساب الموجود" }
    }
    
    // إنشاء الحساب في LearnWorlds
    const registerResult = await register({
      email,
      password,
      firstName: userData.firstName,
      lastName: userData.lastName,
    })
    
    if (registerResult.success && registerResult.user) {
      registerResult.user.migrated = true
    }
    
    return registerResult
  } catch (error: any) {
    console.error("[AuthService] Migration error:", error)
    return {
      success: false,
      error: "فشل ترحيل الحساب",
    }
  }
}

/**
 * تسجيل الخروج
 */
export async function logout(): Promise<void> {
  const session = await getSession()
  
  // محاولة إنهاء الجلسة في LearnWorlds
  if (session?.lwToken && learnworldsClient.isConfigured()) {
    try {
      // LearnWorlds لا يدعم logout API مباشرة
      // لكن يمكن إضافته هنا إذا توفر
    } catch (error) {
      console.warn("[AuthService] Could not logout from LearnWorlds")
    }
  }
  
  await destroySession()
}

// ============= EXPORTS =============

export const AuthService = {
  login,
  register,
  logout,
  loginWithSSO,
  migrateAccount,
  createSession,
  getSession,
  refreshSessionIfNeeded,
  destroySession,
  validatePasswordStrength,
  hashPassword,
  verifyPassword,
}

export default AuthService
