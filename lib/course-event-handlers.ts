/**
 * Course Event Handlers - معالجات أحداث الدورات
 * يتعامل مع أحداث Webhook المتعلقة بالدورات ويحدث الكاش
 */

import { invalidateCourseCache } from "./course-service"

/**
 * تفعيل ISR revalidation للصفحات
 */
async function revalidatePath(path: string): Promise<void> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || `https://${process.env.VERCEL_URL}`
    if (!baseUrl) {
      console.warn("[CourseEventHandlers] No base URL for revalidation")
      return
    }

    const revalidateSecret = process.env.REVALIDATE_SECRET
    if (!revalidateSecret) {
      console.warn("[CourseEventHandlers] REVALIDATE_SECRET not configured")
      return
    }

    const url = `${baseUrl}/api/revalidate?path=${encodeURIComponent(path)}&secret=${revalidateSecret}`
    const response = await fetch(url, { method: "POST" })
    
    if (response.ok) {
      console.log(`[CourseEventHandlers] Revalidated: ${path}`)
    } else {
      console.error(`[CourseEventHandlers] Revalidation failed for ${path}:`, await response.text())
    }
  } catch (error) {
    console.error(`[CourseEventHandlers] Error revalidating ${path}:`, error)
  }
}

/**
 * معالجة تحديث دورة
 */
export async function handleCourseUpdated(data: any): Promise<void> {
  const courseId = data.course_id || data.id
  const slug = data.slug || data.identifiers?.slug

  console.log(`[CourseEventHandlers] Course updated:`, {
    courseId,
    slug,
    title: data.title || data.name,
  })

  // 1. مسح الكاش
  invalidateCourseCache(courseId)
  invalidateCourseCache() // مسح قائمة الدورات أيضاً

  // 2. إعادة تحقق ISR للصفحات المتأثرة
  const pathsToRevalidate = [
    "/courses", // صفحة قائمة الدورات
    `/courses/${slug || courseId}`, // صفحة تفاصيل الدورة
    "/", // الصفحة الرئيسية (قد تعرض دورات مميزة)
  ]

  await Promise.all(pathsToRevalidate.map(revalidatePath))

  console.log(`[CourseEventHandlers] Course update processed: ${courseId}`)
}

/**
 * معالجة حذف دورة
 */
export async function handleCourseDeleted(data: any): Promise<void> {
  const courseId = data.course_id || data.id
  const slug = data.slug || data.identifiers?.slug

  console.log(`[CourseEventHandlers] Course deleted/unpublished:`, {
    courseId,
    slug,
  })

  // 1. مسح الكاش
  invalidateCourseCache(courseId)
  invalidateCourseCache()

  // 2. إعادة تحقق ISR
  const pathsToRevalidate = ["/courses", "/"]
  await Promise.all(pathsToRevalidate.map(revalidatePath))

  console.log(`[CourseEventHandlers] Course deletion processed: ${courseId}`)
}

/**
 * معالجة تحديث محتوى (قسم أو درس)
 */
export async function handleContentUpdated(data: any): Promise<void> {
  const courseId = data.course_id
  const slug = data.course_slug

  if (!courseId) {
    console.warn("[CourseEventHandlers] Content update without course_id")
    return
  }

  console.log(`[CourseEventHandlers] Content updated for course:`, {
    courseId,
    contentType: data.type || "unknown",
    contentId: data.id,
  })

  // 1. مسح كاش الدورة
  invalidateCourseCache(courseId)

  // 2. إعادة تحقق ISR لصفحة الدورة
  if (slug || courseId) {
    await revalidatePath(`/courses/${slug || courseId}`)
  }

  console.log(`[CourseEventHandlers] Content update processed for course: ${courseId}`)
}
