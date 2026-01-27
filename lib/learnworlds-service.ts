/**
 * LearnWorlds Service Layer
 * خدمة موحدة للتكامل مع LearnWorlds مع retry, idempotency, و error handling
 */

import { learnworldsClient } from "./learnworlds-client"
import crypto from "crypto"

// ============= CONFIGURATION =============

const MAX_RETRIES = 3
const RETRY_DELAY_MS = 1000
const IDEMPOTENCY_TTL_MS = 24 * 60 * 60 * 1000 // 24 ساعة

// ============= IDEMPOTENCY STORE =============

interface IdempotencyRecord {
  key: string
  result: any
  timestamp: number
  status: "processing" | "completed" | "failed"
}

const idempotencyStore = new Map<string, IdempotencyRecord>()

// تنظيف السجلات القديمة كل ساعة
setInterval(() => {
  const now = Date.now()
  for (const [key, record] of idempotencyStore.entries()) {
    if (now - record.timestamp > IDEMPOTENCY_TTL_MS) {
      idempotencyStore.delete(key)
    }
  }
}, 60 * 60 * 1000)

/**
 * توليد مفتاح idempotency من البيانات
 */
function generateIdempotencyKey(operation: string, data: any): string {
  const hash = crypto
    .createHash("sha256")
    .update(`${operation}:${JSON.stringify(data)}`)
    .digest("hex")
  return hash.substring(0, 32)
}

/**
 * التحقق من وجود عملية سابقة بنفس المفتاح
 */
function checkIdempotency(key: string): IdempotencyRecord | null {
  const record = idempotencyStore.get(key)
  if (!record) return null

  // إذا كانت العملية قيد المعالجة، انتظر
  if (record.status === "processing") {
    return record
  }

  // إذا كانت مكتملة، أعد النتيجة
  if (record.status === "completed") {
    console.log(`[LearnWorldsService] Returning cached result for idempotency key: ${key}`)
    return record
  }

  return null
}

/**
 * حفظ نتيجة العملية
 */
function saveIdempotencyResult(key: string, result: any, status: "completed" | "failed"): void {
  idempotencyStore.set(key, {
    key,
    result,
    timestamp: Date.now(),
    status,
  })
}

// ============= RETRY LOGIC =============

interface RetryOptions {
  maxRetries?: number
  delayMs?: number
  backoffMultiplier?: number
  retryableErrors?: string[]
}

/**
 * تنفيذ عملية مع إعادة المحاولة
 */
async function withRetry<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = MAX_RETRIES,
    delayMs = RETRY_DELAY_MS,
    backoffMultiplier = 2,
    retryableErrors = ["ECONNRESET", "ETIMEDOUT", "ENOTFOUND", "429", "503", "504"],
  } = options

  let lastError: Error | null = null

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error: any) {
      lastError = error
      
      const errorMessage = error.message || ""
      const isRetryable = retryableErrors.some(
        (e) => errorMessage.includes(e) || error.code === e
      )

      if (!isRetryable || attempt === maxRetries) {
        console.error(`[LearnWorldsService] Operation failed after ${attempt} attempts:`, error.message)
        throw error
      }

      const delay = delayMs * Math.pow(backoffMultiplier, attempt - 1)
      console.warn(
        `[LearnWorldsService] Attempt ${attempt} failed, retrying in ${delay}ms:`,
        error.message
      )
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }

  throw lastError
}

// ============= ERROR HANDLING =============

export class LearnWorldsError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number,
    public originalError?: Error
  ) {
    super(message)
    this.name = "LearnWorldsError"
  }
}

function handleError(error: any, operation: string): never {
  const message = error.message || "Unknown error"
  const statusCode = error.status || error.statusCode || 500

  // تحديد نوع الخطأ
  let code = "UNKNOWN_ERROR"
  if (message.includes("not found") || statusCode === 404) {
    code = "NOT_FOUND"
  } else if (message.includes("unauthorized") || statusCode === 401) {
    code = "UNAUTHORIZED"
  } else if (message.includes("forbidden") || statusCode === 403) {
    code = "FORBIDDEN"
  } else if (statusCode === 429) {
    code = "RATE_LIMITED"
  } else if (statusCode >= 500) {
    code = "SERVER_ERROR"
  } else if (message.includes("timeout")) {
    code = "TIMEOUT"
  } else if (message.includes("network")) {
    code = "NETWORK_ERROR"
  }

  throw new LearnWorldsError(
    `[${operation}] ${message}`,
    code,
    statusCode,
    error
  )
}

// ============= SERVICE FUNCTIONS =============

/**
 * إنشاء مستخدم جديد مع idempotency
 */
export async function createUser(userData: {
  email: string
  password: string
  first_name: string
  last_name: string
}): Promise<any> {
  const idempotencyKey = generateIdempotencyKey("createUser", { email: userData.email })
  
  // التحقق من idempotency
  const existing = checkIdempotency(idempotencyKey)
  if (existing?.status === "completed") {
    return existing.result
  }

  // تسجيل بدء العملية
  idempotencyStore.set(idempotencyKey, {
    key: idempotencyKey,
    result: null,
    timestamp: Date.now(),
    status: "processing",
  })

  try {
    const result = await withRetry(() => learnworldsClient.register(userData))
    saveIdempotencyResult(idempotencyKey, result, "completed")
    console.log(`[LearnWorldsService] User created: ${userData.email}`)
    return result
  } catch (error: any) {
    saveIdempotencyResult(idempotencyKey, { error: error.message }, "failed")
    handleError(error, "createUser")
  }
}

/**
 * تسجيل مستخدم في دورة مع idempotency
 */
export async function enrollUserInCourse(
  userId: string,
  courseId: string,
  productType: "course" | "bundle" | "subscription" = "course"
): Promise<any> {
  const idempotencyKey = generateIdempotencyKey("enrollUser", { userId, courseId })
  
  const existing = checkIdempotency(idempotencyKey)
  if (existing?.status === "completed") {
    return existing.result
  }

  idempotencyStore.set(idempotencyKey, {
    key: idempotencyKey,
    result: null,
    timestamp: Date.now(),
    status: "processing",
  })

  try {
    // التحقق من عدم وجود تسجيل سابق
    const existingEnrollment = await learnworldsClient.checkEnrollment(userId, courseId)
    if (existingEnrollment.enrolled) {
      const result = { success: true, enrollment: existingEnrollment.enrollment, alreadyEnrolled: true }
      saveIdempotencyResult(idempotencyKey, result, "completed")
      return result
    }

    const result = await withRetry(() => 
      learnworldsClient.enrollUser(userId, courseId, productType)
    )
    
    saveIdempotencyResult(idempotencyKey, result, "completed")
    console.log(`[LearnWorldsService] User ${userId} enrolled in course ${courseId}`)
    return result
  } catch (error: any) {
    saveIdempotencyResult(idempotencyKey, { error: error.message }, "failed")
    handleError(error, "enrollUserInCourse")
  }
}

/**
 * إلغاء تسجيل مستخدم من دورة
 */
export async function unenrollUserFromCourse(
  userId: string,
  courseId: string
): Promise<any> {
  const idempotencyKey = generateIdempotencyKey("unenrollUser", { userId, courseId })
  
  const existing = checkIdempotency(idempotencyKey)
  if (existing?.status === "completed") {
    return existing.result
  }

  idempotencyStore.set(idempotencyKey, {
    key: idempotencyKey,
    result: null,
    timestamp: Date.now(),
    status: "processing",
  })

  try {
    const result = await withRetry(() => 
      learnworldsClient.unenrollUser(userId, courseId)
    )
    
    saveIdempotencyResult(idempotencyKey, result, "completed")
    console.log(`[LearnWorldsService] User ${userId} unenrolled from course ${courseId}`)
    return result
  } catch (error: any) {
    saveIdempotencyResult(idempotencyKey, { error: error.message }, "failed")
    handleError(error, "unenrollUserFromCourse")
  }
}

/**
 * جلب تقدم المستخدم في دورة
 */
export async function getUserProgress(
  userId: string,
  courseId: string
): Promise<any> {
  try {
    return await withRetry(() => 
      learnworldsClient.getCourseProgress(userId, courseId)
    )
  } catch (error: any) {
    // في حالة الخطأ، إرجاع قيم افتراضية
    console.warn(`[LearnWorldsService] Could not fetch progress, returning defaults`)
    return {
      completed_percent: 0,
      status: "not_started",
      userId,
      courseId,
    }
  }
}

/**
 * جلب شهادات المستخدم
 */
export async function getUserCertificates(userId: string): Promise<any[]> {
  try {
    return await withRetry(() => learnworldsClient.getUserCertificates(userId))
  } catch (error: any) {
    console.warn(`[LearnWorldsService] Could not fetch certificates`)
    return []
  }
}

/**
 * جلب مدفوعات المستخدم
 */
export async function getUserPayments(
  userId: string,
  page = 1,
  itemsPerPage = 20
): Promise<{ payments: any[]; meta: any }> {
  try {
    return await withRetry(() => 
      learnworldsClient.getUserPayments(userId, page, itemsPerPage)
    )
  } catch (error: any) {
    console.warn(`[LearnWorldsService] Could not fetch payments`)
    return { payments: [], meta: { page: 1, totalItems: 0, totalPages: 0 } }
  }
}

/**
 * التحقق من تسجيل المستخدم في دورة
 */
export async function checkUserEnrollment(
  userId: string,
  courseId: string
): Promise<{ enrolled: boolean; enrollment: any | null }> {
  try {
    return await withRetry(() => 
      learnworldsClient.checkEnrollment(userId, courseId)
    )
  } catch (error: any) {
    console.warn(`[LearnWorldsService] Could not check enrollment`)
    return { enrolled: false, enrollment: null }
  }
}

/**
 * إنشاء رابط SSO للمستخدم
 */
export async function createSSOLink(
  email: string,
  username?: string,
  redirectUrl?: string
): Promise<string> {
  try {
    return await withRetry(() => 
      learnworldsClient.createSSOLink(email, username, redirectUrl)
    )
  } catch (error: any) {
    handleError(error, "createSSOLink")
  }
}

/**
 * جلب رابط Checkout للدورة
 */
export async function getCheckoutUrl(
  courseId: string,
  userId?: string
): Promise<string> {
  try {
    return await withRetry(() => 
      learnworldsClient.getCheckoutUrl(courseId, userId)
    )
  } catch (error: any) {
    handleError(error, "getCheckoutUrl")
  }
}

// ============= WEBHOOK HELPERS =============

/**
 * التحقق من توقيع Webhook
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex")

  try {
    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(signature)
    )
  } catch {
    return false
  }
}

/**
 * التحقق من عدم تكرار معالجة Webhook
 */
export function checkWebhookIdempotency(webhookId: string): boolean {
  const key = `webhook:${webhookId}`
  const existing = idempotencyStore.get(key)
  
  if (existing) {
    console.log(`[LearnWorldsService] Duplicate webhook detected: ${webhookId}`)
    return false
  }

  idempotencyStore.set(key, {
    key,
    result: { processed: true },
    timestamp: Date.now(),
    status: "completed",
  })

  return true
}

// ============= EXPORTS =============

export const LearnWorldsService = {
  createUser,
  enrollUserInCourse,
  unenrollUserFromCourse,
  getUserProgress,
  getUserCertificates,
  getUserPayments,
  checkUserEnrollment,
  createSSOLink,
  getCheckoutUrl,
  verifyWebhookSignature,
  checkWebhookIdempotency,
}

export default LearnWorldsService
