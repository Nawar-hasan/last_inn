/**
 * Course Field Mapper - تحويل بيانات LearnWorlds إلى منصتنا
 * يوفر وظائف لتحويل البيانات الخام من LearnWorlds API إلى أنواع منصتنا
 */

import type {
  LWRawCourse,
  LWRawSection,
  LWRawLearningUnit,
  LWRawInstructor,
  Course,
  CurriculumSection,
  CurriculumLesson,
  Lesson,
  CourseMaterial,
  CourseInstructor,
  CoursePrice,
} from "./learnworld-types"

/**
 * تحويل مدة الدقائق إلى صيغة مقروءة
 */
export function formatDuration(minutes: number): string {
  if (!minutes || minutes <= 0) return "غير محدد"

  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60

  if (hours === 0) {
    return `${mins} دقيقة`
  } else if (mins === 0) {
    return `${hours} ساعة`
  } else {
    return `${hours} ساعة و ${mins} دقيقة`
  }
}

/**
 * تحويل مستوى الدورة
 */
export function mapLevel(
  level?: string
): "beginner" | "intermediate" | "advanced" | "all" {
  const levelMap: Record<string, "beginner" | "intermediate" | "advanced" | "all"> = {
    beginner: "beginner",
    مبتدئ: "beginner",
    intermediate: "intermediate",
    متوسط: "intermediate",
    advanced: "advanced",
    متقدم: "advanced",
    all: "all",
    الكل: "all",
  }
  return levelMap[level?.toLowerCase() || ""] || "all"
}

/**
 * تحويل مادة تعليمية
 */
export function mapMaterial(raw: any): CourseMaterial {
  return {
    id: raw.id || `material-${Date.now()}`,
    title: raw.title || raw.name || "مادة تعليمية",
    type: raw.type || "resource",
    url: raw.url || raw.content_url || "#",
  }
}

/**
 * تحويل درس واحد
 */
export function mapLesson(
  raw: LWRawLearningUnit,
  courseId: string,
  order: number
): Lesson {
  return {
    id: raw.id,
    courseId,
    title: raw.title || raw.name || `درس ${order + 1}`,
    titleAr: raw.title || raw.name || `درس ${order + 1}`,
    description: raw.description || "",
    descriptionAr: raw.description || "",
    videoUrl: raw.video_url || raw.content_url || "",
    duration: raw.duration || 0,
    materials: (raw.resources || []).map(mapMaterial),
    order: raw.position ?? raw.order ?? order,
    quiz: undefined, // يتم تحديده إذا كان النوع quiz
  }
}

/**
 * تحويل وحدة تعليمية إلى درس منهاج
 */
export function mapCurriculumLesson(
  raw: LWRawLearningUnit
): CurriculumLesson {
  return {
    id: raw.id,
    title: raw.title || raw.name || "درس",
    type: raw.type,
    description: raw.description,
    duration: raw.duration,
    position: raw.position ?? raw.order,
    freePreview: raw.free_preview,
    videoUrl: raw.video_url,
    contentUrl: raw.content_url,
    resources: raw.resources?.map((r) => ({
      id: r.id,
      title: r.title || r.name || "مورد",
      type: r.type || "resource",
      url: r.url || "#",
      size: r.size,
    })),
  }
}

/**
 * تحويل قسم من المنهاج
 */
export function mapSection(
  raw: LWRawSection,
  courseId: string
): CurriculumSection {
  const units = raw.learning_units || raw.items || []
  return {
    id: raw.id,
    title: raw.title || raw.name || "قسم",
    description: raw.description,
    position: raw.position ?? raw.order,
    lessons: units.map(mapCurriculumLesson),
  }
}

/**
 * تحويل المدرب
 */
export function mapInstructor(
  raw?: LWRawInstructor | LWRawCourse["author"]
): CourseInstructor {
  if (!raw) {
    return {
      id: "default",
      name: "المدرب",
      email: undefined,
      avatar: undefined,
      bio: undefined,
    }
  }

  // Handle LWRawInstructor
  if ("fields" in raw && raw.fields) {
    return {
      id: raw.id,
      name:
        `${raw.fields.first_name || ""} ${raw.fields.last_name || ""}`.trim() ||
        raw.username ||
        "المدرب",
      email: raw.email,
      avatar: raw.fields.avatar || raw.avatar,
      bio: raw.fields.bio || raw.bio,
    }
  }

  // Handle author object
  return {
    id: raw.id || "default",
    name: raw.name || "المدرب",
    email: raw.email,
    avatar: raw.avatar,
    bio: raw.bio,
  }
}

/**
 * تحويل السعر
 */
export function mapPrice(raw: LWRawCourse): CoursePrice {
  const amount = raw.price || 0
  const originalAmount = raw.original_price
  const discount =
    originalAmount && originalAmount > amount
      ? Math.round(((originalAmount - amount) / originalAmount) * 100)
      : undefined

  return {
    amount,
    originalAmount,
    currency: raw.currency || "USD",
    discount,
  }
}

/**
 * حساب إجمالي الدروس والاختبارات
 */
export function calculateTotals(sections: LWRawSection[]): {
  totalLessons: number
  totalQuizzes: number
  totalDuration: number
} {
  let totalLessons = 0
  let totalQuizzes = 0
  let totalDuration = 0

  for (const section of sections) {
    const units = section.learning_units || section.items || []
    for (const unit of units) {
      if (unit.type === "quiz") {
        totalQuizzes++
      } else {
        totalLessons++
      }
      totalDuration += unit.duration || 0
    }
  }

  return { totalLessons, totalQuizzes, totalDuration }
}

/**
 * تحويل دورة كاملة من LearnWorlds إلى منصتنا
 */
export function mapCourse(raw: LWRawCourse, instructor?: LWRawInstructor): Course {
  const sections = raw.sections || []
  const { totalLessons, totalQuizzes, totalDuration } = calculateTotals(sections)

  // استخدام المدة من API أو حسابها من الدروس
  const duration = raw.duration || totalDuration

  return {
    id: raw.id,
    title: raw.title || raw.name || "دورة",
    description: raw.description || raw.short_description || "",
    fullDescription: raw.long_description || raw.description || "",
    slug: raw.identifiers?.slug || raw.slug || raw.id,
    image:
      raw.image ||
      raw.courseImage ||
      raw.thumbnail ||
      "/images/course-badge.jpg",
    price: mapPrice(raw),
    accessType: raw.access || "paid",
    duration,
    durationFormatted: formatDuration(duration),
    level: mapLevel(raw.settings?.level),
    language: raw.settings?.language || "ar",
    categories: raw.categories || [],
    instructor: mapInstructor(instructor || raw.author),
    curriculum: sections.map((s) => mapSection(s, raw.id)),
    totalLessons,
    totalQuizzes,
    goals: raw.afterPurchase?.goals || [],
    targetAudience: raw.afterPurchase?.targetAudience || [],
    requirements: raw.afterPurchase?.requirements || [],
    certificateEnabled: raw.certificates_enabled ?? true,
    published: raw.published ?? true,
    createdAt: raw.created ? new Date(raw.created) : new Date(),
    updatedAt: raw.modified ? new Date(raw.modified) : new Date(),
    metadata: raw.meta,
  }
}

/**
 * تحويل قائمة دورات
 */
export function mapCourses(
  rawCourses: LWRawCourse[],
  instructors?: Map<string, LWRawInstructor>
): Course[] {
  return rawCourses.map((raw) => {
    const instructor = raw.instructor_id
      ? instructors?.get(raw.instructor_id)
      : undefined
    return mapCourse(raw, instructor)
  })
}
