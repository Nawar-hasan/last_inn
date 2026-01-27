import { NextResponse } from "next/server"
import { handleCourseWebhook, invalidateCourseCache } from "@/lib/course-service"
import { handleCourseUpdated, handleCourseDeleted, handleContentUpdated } from "@/lib/course-event-handlers"
import { verifyWebhookSignature, checkWebhookIdempotency } from "@/lib/learnworlds-service"

/**
 * معالج Webhooks من LearnWorlds
 * يستقبل الأحداث من LearnWorlds ويعالجها
 * يدعم:
 * - التحقق من التوقيع (Signature Verification)
 * - منع التكرار (Idempotency)
 * - تسجيل الأحداث (Event Logging)
 * - ISR revalidation عند تحديث الدورات
 */

interface WebhookEvent {
  event: string
  data: any
  timestamp?: string
  webhook_id?: string
  id?: string
}

// ============= EVENT LOGGING =============

interface EventLogEntry extends WebhookEvent {
  processedAt: string
  status: "success" | "failed" | "skipped"
  error?: string
}

// تسجيل الأحداث - في production استخدم قاعدة بيانات
const eventLog: EventLogEntry[] = []

function logEvent(event: WebhookEvent, status: "success" | "failed" | "skipped", error?: string) {
  const entry: EventLogEntry = {
    ...event,
    processedAt: new Date().toISOString(),
    status,
    error,
  }
  
  console.log(`[Webhook] Event ${status}: ${event.event}`, {
    webhookId: event.webhook_id || event.id,
    timestamp: event.timestamp || entry.processedAt,
    hasData: !!event.data,
    error,
  })
  
  eventLog.push(entry)
  
  // احتفظ بآخر 1000 حدث فقط
  if (eventLog.length > 1000) {
    eventLog.shift()
  }
}

/**
 * تفعيل ISR revalidation للصفحات المتأثرة
 */
async function revalidatePaths(paths: string[]) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL
  if (!baseUrl) {
    console.warn("[Webhook] No base URL configured for revalidation")
    return
  }

  const results = await Promise.allSettled(
    paths.map(async (path) => {
      const revalidateUrl = `${baseUrl}/api/revalidate?path=${encodeURIComponent(path)}&secret=${process.env.REVALIDATE_SECRET}`
      const response = await fetch(revalidateUrl, { method: "POST" })
      if (!response.ok) {
        throw new Error(`Revalidation failed: ${response.status}`)
      }
      return path
    })
  )

  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      console.log(`[Webhook] Revalidated: ${paths[index]}`)
    } else {
      console.error(`[Webhook] Revalidation failed for ${paths[index]}:`, result.reason)
    }
  })
}

export async function POST(req: Request) {
  const startTime = Date.now()
  
  try {
    // قراءة التوقيع من الـ headers
    const signature = 
      req.headers.get("x-learnworlds-signature") || 
      req.headers.get("x-signature") ||
      req.headers.get("x-webhook-signature") || 
      ""
    const webhookSecret = process.env.LEARNWORLD_WEBHOOK_SECRET

    if (!webhookSecret) {
      console.error("[Webhook] LEARNWORLD_WEBHOOK_SECRET not configured")
      return NextResponse.json({ error: "Webhook not configured" }, { status: 500 })
    }

    // قراءة الـ payload
    const rawBody = await req.text()

    // التحقق من التوقيع باستخدام HMAC-SHA256
    if (signature) {
      const isValid = verifyWebhookSignature(rawBody, signature, webhookSecret)
      
      if (!isValid) {
        console.error("[Webhook] Invalid signature")
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
      }
      console.log("[Webhook] Signature verified successfully")
    } else {
      // في بيئة التطوير، نسمح بدون توقيع مع تحذير
      if (process.env.NODE_ENV === "production") {
        console.error("[Webhook] Missing signature in production")
        return NextResponse.json({ error: "Missing signature" }, { status: 401 })
      }
      console.warn("[Webhook] No signature provided - development mode")
    }

    // تحليل الـ payload
    let payload: WebhookEvent
    try {
      payload = JSON.parse(rawBody)
    } catch (parseError) {
      console.error("[Webhook] Failed to parse payload:", parseError)
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
    }

    const { event, data } = payload
    const webhookId = payload.webhook_id || payload.id || `${event}-${Date.now()}`

    // التحقق من عدم التكرار (Idempotency)
    if (!checkWebhookIdempotency(webhookId)) {
      logEvent(payload, "skipped", "Duplicate webhook")
      return NextResponse.json({
        received: true,
        skipped: true,
        reason: "Duplicate webhook",
        webhookId,
      })
    }

    console.log(`[Webhook] Processing event: ${event}`, {
      webhookId,
      timestamp: payload.timestamp || new Date().toISOString(),
    })

    // معالجة الأحداث بناءً على النوع
    switch (event) {
      // ============= COURSE EVENTS (تحديث الكاش وISR) =============
      case "course.created":
      case "course.updated":
      case "course.published":
        await handleCourseUpdated(data)
        break

      case "course.deleted":
      case "course.unpublished":
        await handleCourseDeleted(data)
        break

      // ============= USER EVENTS =============
      case "user.created":
        await handleUserCreated(data)
        break

      case "user.updated":
        await handleUserUpdated(data)
        break

      case "user.deleted":
        await handleUserDeleted(data)
        break

      // ============= ENROLLMENT EVENTS =============
      case "enrollment.created":
      case "user.enrolled":
        await handleEnrollmentCreated(data)
        break

      case "enrollment.updated":
        await handleEnrollmentUpdated(data)
        break

      case "enrollment.completed":
      case "course.completed":
        await handleCourseCompleted(data)
        break

      // ============= PAYMENT EVENTS =============
      case "payment.succeeded":
        await handlePaymentSucceeded(data)
        break

      case "payment.failed":
        await handlePaymentFailed(data)
        break

      case "payment.refunded":
        await handlePaymentRefunded(data)
        break

      // ============= CERTIFICATE EVENTS =============
      case "certificate.issued":
        await handleCertificateIssued(data)
        break

      // ============= SUBSCRIPTION EVENTS =============
      case "subscription.created":
        await handleSubscriptionCreated(data)
        break

      case "subscription.updated":
        await handleSubscriptionUpdated(data)
        break

      case "subscription.cancelled":
        await handleSubscriptionCancelled(data)
        break

      // ============= PROGRESS EVENTS =============
      case "progress.updated":
        await handleProgressUpdated(data)
        break

      // ============= CONTENT EVENTS (للمنهاج) =============
      case "section.created":
      case "section.updated":
      case "section.deleted":
      case "lesson.created":
      case "lesson.updated":
      case "lesson.deleted":
        await handleContentUpdated(data)
        break

      default:
        console.log(`[Webhook] Unhandled event type: ${event}`)
    }

    // تسجيل النجاح
    const processingTime = Date.now() - startTime
    logEvent(payload, "success")

    return NextResponse.json({
      received: true,
      event,
      webhookId,
      processingTimeMs: processingTime,
      timestamp: new Date().toISOString(),
    })
  } catch (err: any) {
    console.error("[Webhook] Exception:", err)
    
    // محاولة تسجيل الخطأ
    try {
      const rawBody = await req.clone().text()
      const payload = JSON.parse(rawBody)
      logEvent(payload, "failed", err.message)
    } catch {
      // تجاهل أخطاء التسجيل
    }

    return NextResponse.json(
      {
        error: "Webhook processing failed",
        message: err.message,
      },
      { status: 500 },
    )
  }
}

// GET endpoint لاستعراض سجل الأحداث (للتطوير فقط)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const limit = Number.parseInt(searchParams.get("limit") || "50")

  return NextResponse.json({
    events: eventLog.slice(-limit).reverse(),
    count: eventLog.length,
  })
}

/**
 * معالجات الأحداث
 */

async function handleUserCreated(data: any) {
  console.log(`[Webhook] New user created:`, {
    userId: data.id || data.user_id,
    email: data.email,
    name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
  })

  // TODO: إرسال بريد ترحيبي
  // TODO: تحديث قاعدة البيانات المحلية إذا كنت تستخدم واحدة
  // TODO: إنشاء ملف تعريفي للمستخدم
}

async function handleUserUpdated(data: any) {
  console.log(`[Webhook] User updated:`, {
    userId: data.id || data.user_id,
    email: data.email,
  })

  // TODO: مزامنة بيانات المستخدم
}

async function handleUserDeleted(data: any) {
  console.log(`[Webhook] User deleted:`, {
    userId: data.id || data.user_id,
  })

  // TODO: حذف أو أرشفة بيانات المستخدم المحلية
}

async function handleEnrollmentCreated(data: any) {
  console.log(`[Webhook] Enrollment created:`, {
    userId: data.user_id,
    courseId: data.course_id || data.product_id,
    enrollmentId: data.id || data.enrollment_id,
  })

  // TODO: إرسال إشعار بالتسجيل
  // TODO: تحديث قاعدة البيانات
  // TODO: منح الوصول للدورة
  // TODO: إرسال بريد إلكتروني بتفاصيل الدورة
}

async function handleEnrollmentUpdated(data: any) {
  console.log(`[Webhook] Enrollment updated:`, {
    userId: data.user_id,
    courseId: data.course_id || data.product_id,
    status: data.status,
  })

  // TODO: تحديث حالة التسجيل
}

async function handleCourseCompleted(data: any) {
  console.log(`[Webhook] Course completed:`, {
    userId: data.user_id,
    courseId: data.course_id || data.product_id,
    completionDate: data.completed_at || data.completion_date,
  })

  // TODO: إصدار شهادة تلقائياً إذا لم تكن صادرة
  // TODO: إرسال إشعار بالإكمال
  // TODO: إرسال بريد تهنئة
  // TODO: فتح الوصول للدورة التالية في المسار إن وجد
}

async function handlePaymentSucceeded(data: any) {
  console.log(`[Webhook] Payment succeeded:`, {
    userId: data.user_id,
    amount: data.amount,
    currency: data.currency,
    transactionId: data.transaction_id || data.id,
    productId: data.product_id,
  })

  // TODO: تأكيد الدفع في قاعدة البيانات
  // TODO: منح الوصول للمنتج/الدورة
  // TODO: إرسال إيصال الدفع
  // TODO: تحديث إحصائيات الإيرادات
}

async function handlePaymentFailed(data: any) {
  console.log(`[Webhook] Payment failed:`, {
    userId: data.user_id,
    amount: data.amount,
    reason: data.failure_reason || data.error_message,
  })

  // TODO: إرسال إشعار بفشل الدفع
  // TODO: اقتراح طرق دفع بديلة
}

async function handlePaymentRefunded(data: any) {
  console.log(`[Webhook] Payment refunded:`, {
    userId: data.user_id,
    amount: data.amount,
    transactionId: data.transaction_id,
  })

  // TODO: إلغاء الوصول للمنتج
  // TODO: تحديث قاعدة البيانات
  // TODO: إرسال إشعار بالاسترداد
}

async function handleCertificateIssued(data: any) {
  console.log(`[Webhook] Certificate issued:`, {
    userId: data.user_id,
    courseId: data.course_id || data.product_id,
    certificateId: data.certificate_id || data.id,
    certificateUrl: data.certificate_url || data.url,
  })

  // TODO: حفظ رابط الشهادة
  // TODO: إرسال بريد بالشهادة
  // TODO: إضافة الشهادة إلى ملف المستخدم
  // TODO: نشر إعلان في المجتمع (اختياري)
}

async function handleSubscriptionCreated(data: any) {
  console.log(`[Webhook] Subscription created:`, {
    userId: data.user_id,
    subscriptionId: data.subscription_id || data.id,
    plan: data.plan_id || data.product_id,
  })

  // TODO: تفعيل الاشتراك
  // TODO: منح الوصول للمحتوى
}

async function handleSubscriptionUpdated(data: any) {
  console.log(`[Webhook] Subscription updated:`, {
    userId: data.user_id,
    subscriptionId: data.subscription_id || data.id,
    status: data.status,
  })

  // TODO: تحديث حالة الاشتراك
  // TODO: تعديل الوصول حسب الحالة
}

async function handleSubscriptionCancelled(data: any) {
  console.log(`[Webhook] Subscription cancelled:`, {
    userId: data.user_id,
    subscriptionId: data.subscription_id || data.id,
    cancelledAt: data.cancelled_at,
  })

  // TODO: إيقاف الوصول عند انتهاء الفترة
  // TODO: إرسال بريد تأكيد الإلغاء
  // TODO: عرض استطلاع رأي (اختياري)
}

async function handleProgressUpdated(data: any) {
  console.log(`[Webhook] Progress updated:`, {
    userId: data.user_id,
    courseId: data.course_id,
    progress: data.progress_percent || data.progress,
  })

  // TODO: تحديث تقدم المستخدم في قاعدة البيانات
  // TODO: إرسال إشعارات التشجيع عند معالم معينة (25%, 50%, 75%)
}
