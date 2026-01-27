"use client"

import Link from "next/link"
import { useLanguage } from "@/lib/language-context"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import { Clock, Users, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

interface Course {
  id: string
  title: string
  description: string
  courseImage?: string
  price: number
  duration?: string
  slug?: string
  metadata?: any
}

export function FeaturedCourses() {
  const { language } = useLanguage()
  const isArabic = language === "ar"
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        console.log("[v0] Fetching courses from API...")
        const response = await fetch("/api/courses")

        if (!response.ok) {
          throw new Error(`Failed to fetch courses: ${response.status}`)
        }

        const data = await response.json()
        console.log("[v0] Courses fetched:", data.courses?.length || 0)

        // خذ أول 3 دورات للعرض
        setCourses(data.courses?.slice(0, 3) || [])
      } catch (err: any) {
        console.error("[v0] Error fetching courses:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  const content = {
    ar: {
      title: "أبرز دوراتنا",
      subtitle: "الدورات الأكثر طلباً والأكثر تأثيراً في مسيرتك المهنية",
      weeks: "أسابيع",
      aboutCourse: "نبذة عن الدورة",
      enrollNow: "اشترك في الدورة",
      exploreAll: "استكشف جميع الدورات",
      sar: "ريال",
    },
    en: {
      title: "Featured Courses",
      subtitle: "The most in-demand courses that impact your professional journey",
      weeks: "weeks",
      aboutCourse: "About Course",
      enrollNow: "Enroll Now",
      exploreAll: "Explore All Courses",
      sar: "SAR",
    },
  }

  const data = language === "ar" ? content.ar : content.en

  return (
    <section ref={ref} className="py-20 sm:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#551FBD]/5 dark:via-[#551FBD]/10 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 text-gray-900 dark:text-white">
            <span className="bg-gradient-to-r from-[#551FBD] to-[#551FBD] bg-clip-text text-transparent">
              {data.title}
            </span>
          </h2>
          <p
            className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto"
            style={{ fontFamily: "var(--font-rubik)" }}
          >
            {data.subtitle}
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl overflow-hidden bg-gray-900 border border-purple-500/20 p-8">
                <Skeleton className="w-32 h-32 rounded-full mx-auto mb-6" />
                <Skeleton className="h-6 w-3/4 mx-auto mb-3" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6 mx-auto mb-4" />
                <div className="flex gap-2 mt-6">
                  <Skeleton className="h-10 flex-1" />
                  <Skeleton className="h-10 flex-1" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">Failed to load courses</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, index) => {
              const weeks = course.metadata?.duration_weeks || "6"
              const students = course.metadata?.enrolled_count || "450+"
              const price = course.price || 0
              const formattedPrice = `${price} ${data.sar}`

              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-black via-gray-900 to-purple-900/30 border border-purple-500/20 hover:border-purple-500/50 transition-all duration-500 hover:scale-105 shadow-xl hover:shadow-purple-500/30"
                >
                  {/* Badge at top */}
                  <div className="flex justify-center pt-8 pb-6">
                    <div className="relative w-32 h-32">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#C026D3] via-[#9333EA] to-[#7C3AED] blur-sm opacity-70"></div>
                      <div className="relative w-full h-full rounded-full bg-gradient-to-br from-[#C026D3] via-[#9333EA] to-[#7C3AED] p-1 shadow-2xl">
                        <div className="w-full h-full rounded-full bg-black flex items-center justify-center border-2 border-white/10">
                          <div className="text-center">
                            <div className="text-4xl font-bold text-white mb-1">IT</div>
                            <div className="text-xs text-white/80 font-semibold">{course.metadata?.code || "CERT"}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="px-6 pb-8 space-y-4">
                    <div>
                      <h3
                        className="text-xl font-bold text-white text-center mb-3"
                        style={{ fontFamily: "var(--font-rubik)" }}
                      >
                        {course.title}
                      </h3>
                      <p
                        className="text-white/80 text-sm leading-relaxed text-center line-clamp-3"
                        style={{ fontFamily: "var(--font-rubik)" }}
                      >
                        {course.description}
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-center gap-4 pt-2">
                      <div className="flex items-center gap-1.5 text-white/70">
                        <Clock className="w-4 h-4" />
                        <span className="text-xs" style={{ fontFamily: "var(--font-rubik)" }}>
                          {weeks} {data.weeks}
                        </span>
                      </div>
                      <div className="w-px h-4 bg-white/20"></div>
                      <div className="flex items-center gap-1.5 text-white/70">
                        <Users className="w-4 h-4" />
                        <span className="text-xs" style={{ fontFamily: "var(--font-rubik)" }}>
                          {students}
                        </span>
                      </div>
                      <div className="w-px h-4 bg-white/20"></div>
                      <div className="flex items-center gap-1.5 text-white">
                        <span className="text-sm font-bold" style={{ fontFamily: "var(--font-rubik)" }}>
                          {formattedPrice}
                        </span>
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                      <Link href={`/courses/${course.slug || course.id}`} className="flex-1">
                        <Button
                          variant="outline"
                          className="w-full bg-gradient-to-r from-[#551FBD] to-[#7B3FDD] hover:from-[#551FBD]/90 hover:to-[#7B3FDD]/90 text-white border-none font-semibold text-sm"
                          style={{ fontFamily: "var(--font-rubik)" }}
                        >
                          {data.aboutCourse}
                        </Button>
                      </Link>
                      <Link href={`/checkout?type=course&id=${course.id}`} className="flex-1">
                        <Button
                          className="w-full bg-gradient-to-r from-[#551FBD] to-[#7B3FDD] hover:from-[#551FBD]/90 hover:to-[#7B3FDD]/90 text-white font-semibold text-sm"
                          style={{ fontFamily: "var(--font-rubik)" }}
                        >
                          {data.enrollNow}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* View All Courses */}
        <div className="text-center mt-12">
          <Link href="/courses">
            <button
              className="px-8 py-4 bg-gradient-to-r from-[#551FBD] to-[#7B3FDD] text-white font-bold rounded-full
                         hover:from-[#551FBD]/90 hover:to-[#7B3FDD]/90 hover:shadow-[0_0_30px_rgba(85,31,189,0.5)] 
                         hover:scale-105 transition-all duration-300 inline-flex items-center gap-2"
              style={{ fontFamily: "var(--font-rubik)" }}
            >
              {data.exploreAll}
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}
