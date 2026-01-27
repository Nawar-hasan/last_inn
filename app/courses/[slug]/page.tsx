import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getCourseBySlug, getCourses } from "@/lib/course-service"
import CourseDetailsClient from "./CourseDetailsClient"

// ISR: إعادة التحقق كل 5 دقائق
export const revalidate = 300

// إنشاء الصفحات الثابتة للدورات
export async function generateStaticParams() {
  try {
    const courses = await getCourses()
    return courses.map((course) => ({
      slug: course.slug,
    }))
  } catch (error) {
    console.error("[CourseDetails] Error generating static params:", error)
    return []
  }
}

// إنشاء الـ metadata ديناميكياً
export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const course = await getCourseBySlug(params.slug, { includeContents: false })

  if (!course) {
    return {
      title: "الدورة غير موجودة - Innovologia",
      description: "لم نتمكن من إيجاد الدورة المطلوبة",
    }
  }

  return {
    title: `${course.title} - Innovologia`,
    description: course.description,
    openGraph: {
      title: course.title,
      description: course.description,
      images: [{ url: course.image }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: course.title,
      description: course.description,
      images: [course.image],
    },
  }
}

export default async function CourseDetailsPage({
  params,
}: {
  params: { slug: string }
}) {
  // جلب بيانات الدورة من LearnWorlds
  const course = await getCourseBySlug(params.slug, { includeContents: true })

  if (!course) {
    notFound()
  }

  return <CourseDetailsClient course={course} />
}
