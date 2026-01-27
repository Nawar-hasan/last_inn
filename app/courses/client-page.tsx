"use client"
import Link from "next/link"
import { ArrowRight, Clock, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/site-header"
import { AppverseFooter } from "@/components/appverse-footer"
import { useLanguage } from "@/lib/language-context"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"

import type { Course } from "@/lib/learnworld-types"

export default function CoursesClientPage() {
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
        console.log("[v0] Fetching all courses from API...")
        const response = await fetch("/api/courses")

        if (!response.ok) {
          throw new Error(`Failed to fetch courses: ${response.status}`)
        }

        const data = await response.json()
        console.log("[v0] Courses fetched:", data.courses?.length || 0)

        setCourses(data.courses || [])
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
      pageTitle: "صفحة الدورات",
      weeks: "أسابيع",
      aboutCourse: "نبذة عن الدورة",
      enrollNow: "اشترك في الدورة",
      readyTitle: "جاهز لبدء رحلتك؟",
      readySubtitle: "انضم الآن إلى مجتمعنا واحصل على أحدث المحتويات والموارد",
      startNow: "ابدأ الآن",
      sar: "ريال",
      loading: "جاري التحميل...",
      error: "فشل في تحميل الدورات",
      retry: "إعادة المحاولة",
      noCourses: "لا توجد دورات متاحة حالياً",
    },
    en: {
      pageTitle: "Courses Page",
      weeks: "weeks",
      aboutCourse: "About Course",
      enrollNow: "Enroll Now",
      readyTitle: "Ready to start your journey?",
      readySubtitle: "Join us now and get the latest content and resources",
      startNow: "Start Now",
      sar: "SAR",
      loading: "Loading...",
      error: "Failed to load courses",
      retry: "Retry",
      noCourses: "No courses available at the moment",
    },
  }

  const data = isArabic ? content.ar : content.en

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero Section */}
      <section className="relative py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-center mb-12">
            <div className="border-2 border-[#551FBD]/30 rounded-lg px-12 py-6">
              <h1 className="text-4xl md:text-5xl font-bold text-[#551FBD]" style={{ fontFamily: "var(--font-rubik)" }}>
                {data.pageTitle}
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section ref={ref} className="py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
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
            <div className="text-center py-20">
              <p className="text-red-500 text-xl mb-6" style={{ fontFamily: "var(--font-rubik)" }}>
                {data.error}
              </p>
              <Button onClick={() => window.location.reload()} className="bg-gradient-to-r from-[#551FBD] to-[#7B3FDD]">
                {data.retry}
              </Button>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground" style={{ fontFamily: "var(--font-rubik)" }}>
                {data.noCourses}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course, index) => {
                // استخدام البيانات من LearnWorlds API
                const weeks = course.durationFormatted || `${Math.ceil((course.duration || 0) / 60 / 7)} ${data.weeks}`
                const students = course.metadata?.enrolled_count || "450+"
                const price = course.price?.amount || 0
                const currency = course.price?.currency || "SAR"
                const formattedPrice = price > 0 ? `${price} ${currency}` : (isArabic ? "مجاني" : "Free")

                return (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-black via-gray-900 to-purple-900/30 border border-purple-500/20 hover:border-purple-500/50 transition-all duration-500 hover:scale-105 shadow-xl hover:shadow-purple-500/30"
                  >
                    <div className="flex justify-center pt-8 pb-6">
                      {course.image ? (
                        <div className="relative w-32 h-32 rounded-full overflow-hidden">
                          <img
                            src={course.image || "/placeholder.svg"}
                            alt={course.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="relative w-32 h-32">
                          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#C026D3] via-[#9333EA] to-[#7C3AED] blur-sm opacity-70"></div>
                          <div className="relative w-full h-full rounded-full bg-gradient-to-br from-[#C026D3] via-[#9333EA] to-[#7C3AED] p-1 shadow-2xl">
                            <div className="w-full h-full rounded-full bg-black flex items-center justify-center border-2 border-white/10">
                              <div className="text-center">
                                <div className="text-4xl font-bold text-white mb-1">
                                  {course.title?.substring(0, 2).toUpperCase() || "IT"}
                                </div>
                                <div className="text-xs text-white/80 font-semibold">
                                  {course.level || "CERT"}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
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
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="liquid-glass-enhanced rounded-3xl p-12 text-center space-y-6 border border-border/50"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground" style={{ fontFamily: "var(--font-rubik)" }}>
              {data.readyTitle}
            </h2>
            <p className="text-xl text-foreground max-w-2xl mx-auto" style={{ fontFamily: "var(--font-rubik)" }}>
              {data.readySubtitle}
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-[#551FBD] to-[#7B3FDD] hover:from-[#551FBD]/90 hover:to-[#7B3FDD]/90 text-white shadow-lg hover:shadow-[0_0_20px_rgba(85,31,189,0.4)]"
              style={{ fontFamily: "var(--font-rubik)" }}
            >
              {data.startNow}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      <AppverseFooter />
    </div>
  )
}
