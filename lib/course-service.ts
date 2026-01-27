/**
 * Course Service - خدمة الدورات مع التخزين المؤقت
 * توفر واجهة موحدة لجلب بيانات الدورات من LearnWorlds مع caching
 */

import { learnworldsClient } from "./learnworlds-client"
import { mapCourse, mapCourses } from "./course-mapper"
import type { Course, LWRawCourse, LWRawInstructor } from "./learnworld-types"

// ============= CACHE CONFIGURATION =============

// Cache TTL (Time To Live) بالثواني
const CACHE_TTL = {
  COURSES_LIST: 5 * 60, // 5 دقائق للقائمة
  COURSE_DETAILS: 10 * 60, // 10 دقائق للتفاصيل
  COURSE_CONTENTS: 15 * 60, // 15 دقيقة للمحتوى
}

// In-memory cache (للـ server-side)
const memoryCache = new Map<
  string,
  { data: any; expiresAt: number }
>()

// ============= CACHE HELPERS =============

function getCacheKey(prefix: string, id?: string): string {
  return id ? `${prefix}:${id}` : prefix
}

function getFromCache<T>(key: string): T | null {
  const cached = memoryCache.get(key)
  if (!cached) return null

  if (Date.now() > cached.expiresAt) {
    memoryCache.delete(key)
    return null
  }

  return cached.data as T
}

function setCache<T>(key: string, data: T, ttlSeconds: number): void {
  memoryCache.set(key, {
    data,
    expiresAt: Date.now() + ttlSeconds * 1000,
  })
}

/**
 * مسح cache لدورة معينة أو كل الدورات
 */
export function invalidateCourseCache(courseId?: string): void {
  if (courseId) {
    // مسح cache لدورة محددة
    const keysToDelete = [
      getCacheKey("course", courseId),
      getCacheKey("course-contents", courseId),
    ]
    keysToDelete.forEach((key) => memoryCache.delete(key))
  } else {
    // مسح كل cache الدورات
    for (const key of memoryCache.keys()) {
      if (key.startsWith("course")) {
        memoryCache.delete(key)
      }
    }
  }
  console.log(`[CourseService] Cache invalidated for: ${courseId || "all courses"}`)
}

// ============= MAIN SERVICE FUNCTIONS =============

/**
 * جلب جميع الدورات مع التخزين المؤقت
 */
export async function getCourses(options?: {
  forceRefresh?: boolean
}): Promise<Course[]> {
  const cacheKey = getCacheKey("courses-list")

  // Log environment variables status (without exposing values)
  console.log("[CourseService] Environment check:", {
    hasAdminApiUrl: !!process.env.LEARNWORLD_ADMIN_API_URL,
    hasAdminToken: !!process.env.LEARNWORLD_ADMIN_TOKEN,
    hasClientId: !!process.env.LEARNWORLD_CLIENT_ID,
    hasSchoolId: !!process.env.LEARNWORLD_SCHOOL_ID,
    nodeEnv: process.env.NODE_ENV,
  })

  // التحقق من الكاش أولاً
  if (!options?.forceRefresh) {
    const cached = getFromCache<Course[]>(cacheKey)
    if (cached) {
      console.log("[CourseService] Returning cached courses list, count:", cached.length)
      return cached
    }
  }

  try {
    console.log("[CourseService] Fetching courses from LearnWorlds API")

    // جلب الدورات من LearnWorlds
    const response = await learnworldsClient.getCourses()
    
    // response قد يكون مصفوفة مباشرة أو كائن يحتوي على data
    const rawCourses: LWRawCourse[] = Array.isArray(response)
      ? response
      : response?.data || response?.items || []

    // تحويل البيانات
    const courses = mapCourses(rawCourses)

    // تخزين في الكاش
    setCache(cacheKey, courses, CACHE_TTL.COURSES_LIST)

    console.log(`[CourseService] Fetched and cached ${courses.length} courses`)
    return courses
  } catch (error: any) {
    console.error("[CourseService] Error fetching courses:", error.message)
    
    // محاولة إرجاع البيانات المخزنة حتى لو منتهية
    const staleCache = memoryCache.get(cacheKey)
    if (staleCache) {
      console.log("[CourseService] Returning stale cache due to error")
      return staleCache.data as Course[]
    }
    
    throw error
  }
}

/**
 * جلب دورة واحدة بالتفاصيل الكاملة
 */
export async function getCourseById(
  courseId: string,
  options?: { forceRefresh?: boolean; includeContents?: boolean }
): Promise<Course | null> {
  const cacheKey = getCacheKey("course", courseId)

  // التحقق من الكاش أولاً
  if (!options?.forceRefresh) {
    const cached = getFromCache<Course>(cacheKey)
    if (cached) {
      console.log(`[CourseService] Returning cached course: ${courseId}`)
      return cached
    }
  }

  try {
    console.log(`[CourseService] Fetching course ${courseId} from LearnWorlds API`)

    // جلب الدورة الأساسية
    const rawCourse = await learnworldsClient.getCourseById(courseId)
    
    if (!rawCourse) {
      console.log(`[CourseService] Course not found: ${courseId}`)
      return null
    }

    // استخراج البيانات الخام
    const courseData: LWRawCourse = rawCourse.metadata || rawCourse

    // جلب المحتوى إذا طُلب
    if (options?.includeContents) {
      try {
        const contents = await learnworldsClient.getCourseContents(courseId)
        courseData.sections = contents || []
      } catch (contentsError) {
        console.warn(`[CourseService] Could not fetch contents for ${courseId}:`, contentsError)
        courseData.sections = []
      }
    }

    // جلب معلومات المدرب إذا كان موجوداً
    let instructor: LWRawInstructor | undefined
    if (courseData.instructor_id) {
      try {
        instructor = await learnworldsClient.getUserById(courseData.instructor_id)
      } catch (instructorError) {
        console.warn(`[CourseService] Could not fetch instructor:`, instructorError)
      }
    }

    // تحويل البيانات
    const course = mapCourse(courseData, instructor)

    // تخزين في الكاش
    setCache(cacheKey, course, CACHE_TTL.COURSE_DETAILS)

    console.log(`[CourseService] Fetched and cached course: ${course.title}`)
    return course
  } catch (error: any) {
    console.error(`[CourseService] Error fetching course ${courseId}:`, error.message)
    
    // محاولة إرجاع البيانات المخزنة حتى لو منتهية
    const staleCache = memoryCache.get(cacheKey)
    if (staleCache) {
      console.log("[CourseService] Returning stale cache due to error")
      return staleCache.data as Course
    }
    
    return null
  }
}

/**
 * جلب دورة عبر الـ slug
 */
export async function getCourseBySlug(
  slug: string,
  options?: { forceRefresh?: boolean; includeContents?: boolean }
): Promise<Course | null> {
  console.log(`[CourseService] getCourseBySlug called with slug: ${slug}`)
  
  // أولاً نحاول الحصول على قائمة الدورات للبحث عن الـ ID
  const courses = await getCourses({ forceRefresh: options?.forceRefresh })
  
  console.log(`[CourseService] Found ${courses.length} courses, searching for slug: ${slug}`)
  
  const course = courses.find(
    (c) => c.slug === slug || c.id === slug
  )
  
  if (!course) {
    console.log(`[CourseService] Course not found by slug, trying direct ID lookup: ${slug}`)
    // محاولة جلب مباشرة باستخدام الـ slug كـ ID
    return getCourseById(slug, options)
  }
  
  console.log(`[CourseService] Found course: ${course.title} (ID: ${course.id})`)
  
  // جلب التفاصيل الكاملة
  return getCourseById(course.id, options)
}

/**
 * جلب محتوى الدورة (الأقسام والدروس)
 */
export async function getCourseContents(
  courseId: string,
  options?: { forceRefresh?: boolean }
): Promise<Course["curriculum"]> {
  const cacheKey = getCacheKey("course-contents", courseId)

  if (!options?.forceRefresh) {
    const cached = getFromCache<Course["curriculum"]>(cacheKey)
    if (cached) {
      console.log(`[CourseService] Returning cached contents for: ${courseId}`)
      return cached
    }
  }

  try {
    const course = await getCourseById(courseId, {
      forceRefresh: options?.forceRefresh,
      includeContents: true,
    })

    const curriculum = course?.curriculum || []

    setCache(cacheKey, curriculum, CACHE_TTL.COURSE_CONTENTS)

    return curriculum
  } catch (error: any) {
    console.error(`[CourseService] Error fetching contents for ${courseId}:`, error.message)
    return []
  }
}

/**
 * البحث في الدورات
 */
export async function searchCourses(query: string): Promise<Course[]> {
  const courses = await getCourses()
  const lowerQuery = query.toLowerCase()

  return courses.filter(
    (course) =>
      course.title.toLowerCase().includes(lowerQuery) ||
      course.description.toLowerCase().includes(lowerQuery) ||
      course.categories.some((cat) => cat.toLowerCase().includes(lowerQuery))
  )
}

/**
 * جلب الدورات حسب الفئة
 */
export async function getCoursesByCategory(category: string): Promise<Course[]> {
  const courses = await getCourses()
  const lowerCategory = category.toLowerCase()

  return courses.filter((course) =>
    course.categories.some((cat) => cat.toLowerCase() === lowerCategory)
  )
}

// ============= EXPORTED ALIASES =============

/**
 * Alias للحصول على جميع الدورات
 */
export const getAllCourses = getCourses

/**
 * Alias للحصول على دورة بالـ ID أو Slug
 */
export async function getCourseByIdOrSlug(
  idOrSlug: string,
  options?: { forceRefresh?: boolean; includeContents?: boolean }
): Promise<Course | null> {
  // محاولة الجلب كـ ID أولاً
  let course = await getCourseById(idOrSlug, options)
  
  if (!course) {
    // محاولة الجلب كـ slug
    course = await getCourseBySlug(idOrSlug, options)
  }
  
  return course
}

/**
 * Alias للحصول على المنهاج
 */
export const getCourseCurriculum = getCourseContents

// ============= WEBHOOK HANDLERS =============

/**
 * معالجة أحداث Webhook المتعلقة بالدورات
 */
export function handleCourseWebhook(
  event: string,
  data: any
): void {
  switch (event) {
    case "course.created":
    case "course.updated":
    case "course.published":
      // إعادة تحميل بيانات الدورة
      invalidateCourseCache(data.course_id || data.id)
      invalidateCourseCache() // إعادة تحميل القائمة أيضاً
      break

    case "course.deleted":
    case "course.unpublished":
      invalidateCourseCache(data.course_id || data.id)
      invalidateCourseCache()
      break

    case "section.created":
    case "section.updated":
    case "section.deleted":
    case "lesson.created":
    case "lesson.updated":
    case "lesson.deleted":
      // إعادة تحميل محتوى الدورة
      invalidateCourseCache(data.course_id)
      break

    default:
      console.log(`[CourseService] Unhandled webhook event: ${event}`)
  }
}
