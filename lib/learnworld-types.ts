// TypeScript types for LearnWorld API integration

/**
 * خريطة حقلية (Field Mapping) بين LearnWorlds API ومنصتنا
 * 
 * LearnWorlds Field → Our Platform Field
 * =====================================
 * id → id
 * title → title
 * description → description (short)
 * long_description → fullDescription
 * image/thumbnail/courseImage → image
 * price → price.amount
 * original_price → price.originalAmount
 * currency → price.currency
 * access → accessType (free/paid/subscription)
 * identifiers.slug → slug
 * duration → duration (minutes)
 * categories → categories[]
 * instructor_id → instructor.id
 * created → createdAt
 * modified → updatedAt
 * sections → curriculum[]
 * meta → metadata
 */

// ============= LEARNWORLDS RAW TYPES (من API مباشرة) =============

export interface LWRawCourse {
  id: string
  title?: string
  name?: string
  description?: string
  short_description?: string
  long_description?: string
  image?: string
  thumbnail?: string
  courseImage?: string
  price?: number
  original_price?: number
  currency?: string
  access?: "free" | "paid" | "subscription" | "draft"
  identifiers?: {
    slug?: string
    external_id?: string
  }
  slug?: string
  duration?: number
  categories?: string[]
  instructor_id?: string
  author?: {
    id?: string
    name?: string
    email?: string
    avatar?: string
    bio?: string
  }
  created?: string
  modified?: string
  published?: boolean
  drip_content?: boolean
  certificates_enabled?: boolean
  sections?: LWRawSection[]
  meta?: Record<string, any>
  afterPurchase?: {
    goals?: string[]
    targetAudience?: string[]
    requirements?: string[]
  }
  settings?: {
    language?: string
    level?: string
    category?: string
  }
}

export interface LWRawSection {
  id: string
  title?: string
  name?: string
  description?: string
  position?: number
  order?: number
  learning_units?: LWRawLearningUnit[]
  items?: LWRawLearningUnit[]
}

export interface LWRawLearningUnit {
  id: string
  title?: string
  name?: string
  type?: "video" | "text" | "pdf" | "quiz" | "assignment" | "live" | "audio" | "scorm"
  description?: string
  duration?: number
  position?: number
  order?: number
  free_preview?: boolean
  video_url?: string
  content_url?: string
  resources?: LWRawResource[]
}

export interface LWRawResource {
  id: string
  title?: string
  name?: string
  type?: "pdf" | "document" | "link" | "resource" | "file"
  url?: string
  size?: number
}

export interface LWRawInstructor {
  id: string
  email?: string
  username?: string
  first_name?: string
  last_name?: string
  avatar?: string
  bio?: string
  fields?: {
    first_name?: string
    last_name?: string
    bio?: string
    avatar?: string
  }
}

// ============= PLATFORM NORMALIZED TYPES (أنواع منصتنا) =============

export interface Student {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  profileImage?: string
  enrolledCourses: string[]
  createdAt: Date
}

export interface CoursePrice {
  amount: number
  originalAmount?: number
  currency: string
  discount?: number
}

export interface CourseInstructor {
  id: string
  name: string
  email?: string
  avatar?: string
  bio?: string
  credentials?: string[]
}

export interface CurriculumSection {
  id: string
  title: string
  description?: string
  position?: number
  lessons: CurriculumLesson[]
}

export interface CurriculumLesson {
  id: string
  title: string
  type?: string
  description?: string
  duration?: number
  position?: number
  freePreview?: boolean
  videoUrl?: string
  contentUrl?: string
  resources?: {
    id: string
    title: string
    type: string
    url: string
    size?: number
  }[]
}

export interface Course {
  id: string
  title: string
  titleAr?: string
  description: string
  descriptionAr?: string
  fullDescription?: string
  fullDescriptionAr?: string
  slug: string
  image: string
  price: CoursePrice
  accessType: "free" | "paid" | "subscription" | "draft"
  duration: number // minutes
  durationFormatted: string
  level: "beginner" | "intermediate" | "advanced" | "all"
  language: string
  categories: string[]
  instructor: CourseInstructor
  curriculum: CurriculumSection[]
  totalLessons: number
  totalQuizzes: number
  goals?: string[]
  targetAudience?: string[]
  requirements?: string[]
  certificateEnabled: boolean
  published: boolean
  createdAt: Date
  updatedAt: Date
  metadata?: Record<string, any>
}

export interface Lesson {
  id: string
  courseId: string
  title: string
  titleAr: string
  description: string
  descriptionAr: string
  videoUrl: string
  duration: number // minutes
  materials: CourseMaterial[]
  quiz?: Quiz
  order: number
}

export interface CourseMaterial {
  id: string
  title: string
  type: "pdf" | "document" | "link" | "resource"
  url: string
}

export interface Quiz {
  id: string
  lessonId: string
  title: string
  titleAr: string
  questions: QuizQuestion[]
  passingScore: number
  duration: number // minutes
}

export interface QuizQuestion {
  id: string
  question: string
  questionAr: string
  type: "multiple-choice" | "true-false"
  options: QuizOption[]
  correctAnswer: string
}

export interface QuizOption {
  id: string
  text: string
  textAr: string
}

export interface StudentProgress {
  id: string
  studentId: string
  courseId: string
  lessonsCompleted: number
  lessonsTotal: number
  quizzesCompleted: number
  quizzesTotal: number
  certificateIssued: boolean
  enrolledAt: Date
  completedAt?: Date
}

export interface Certificate {
  id: string
  studentId: string
  courseId: string
  certificateNumber: string
  issuedAt: Date
  expiresAt?: Date
  downloadUrl: string
}

export interface QuizAttempt {
  id: string
  studentId: string
  quizId: string
  score: number
  totalQuestions: number
  answers: string[]
  completedAt: Date
  passed: boolean
}
