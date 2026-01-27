"use client"

import { Award, Target, Lightbulb, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useRef, useState } from "react"
import Image from "next/image"

const courses = [
  {
    id: "cinp",
    badge: "CInP",
    badgeImage: "/cinp-badge.png",
    level: "متوسط",
    title: "محترف الابتكار المعتمد",
    subtitle: "الأسس والمبدئيات الرئيسية للابتكار",
    description:
      "هذه الدورة تهدف إلى إعدادك لاجتياز امتحان محترف الابتكار المعتمد، وهي تقدم استراتيجيات وأساليب الابتكار.",
    duration: "6 أسابيع",
    icon: Lightbulb,
    delay: 0,
  },
  {
    id: "cins",
    badge: "CInS",
    badgeImage: "/cinp-badge.png",
    level: "متقدم",
    title: "اختصاصي الابتكار المعتمد",
    subtitle: "مراحل تطبيقية متقدمة ومشاريع عملية",
    description: "تعلم استراتيجيات الابتكار على مستوى عالٍ في هذه الدورة المخصصة لاستعدادك لشهادة CInS.",
    duration: "8 أسابيع",
    icon: Target,
    delay: 200,
  },
  {
    id: "ccino",
    badge: "CCInO",
    badgeImage: "/cinp-badge.png",
    level: "خبير",
    title: "كبير مسؤولي الابتكار المعتمد",
    subtitle: "القيادة الاستراتيجية وإدارة الابتكار المؤسسي",
    description: "كورس شامل لتعلم مبادئ وأساليب التفكير التصميمي الاحترافي، مع التحضير للامتحان.",
    duration: "10 أسابيع",
    icon: Award,
    delay: 400,
  },
]

export function CoursesSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  return (
    <section ref={sectionRef} className="relative py-24 overflow-hidden bg-background">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-400 dark:bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-violet-400 dark:bg-violet-500/20 rounded-full blur-3xl animate-pulse-glow" />
      </div>

      <div className="container relative mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-gray-900 dark:text-white leading-tight">
            <span className="bg-gradient-to-r from-purple-600 via-violet-500 to-purple-600 bg-clip-text text-transparent">
              طريقك إلى اعتماد معهد الابتكار العالمي
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-700 dark:text-white max-w-3xl mx-auto leading-relaxed text-center">
            محتوى تعليمي، تمارين تطبيقية، اختبارات قصيرة، ومحاكاة على Miro - كل ما تحتاجه لاجتياز الاختبارات بثقة
          </p>
        </div>

        {/* Courses Cards */}
        <div className="relative max-w-7xl mx-auto mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6">
            {courses.map((course, index) => {
              const Icon = course.icon
              return (
                <div
                  key={course.id}
                  className={`group relative transition-all duration-700 ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
                  }`}
                  style={{ transitionDelay: `${course.delay}ms` }}
                >
                  <div className="relative h-full">
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-violet-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500" />

                    <div className="relative h-full liquid-glass-enhanced rounded-3xl p-8 shadow-2xl transform group-hover:-translate-y-2 group-hover:shadow-[0_20px_60px_-15px_rgba(139,92,246,0.3)] transition-all duration-500 border border-border/50">
                      <div className="flex items-start justify-between mb-6">
                        <div className="relative w-24 h-24 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                          <Image
                            src={course.badgeImage || "/placeholder.svg"}
                            alt={course.badge}
                            fill
                            className="object-contain drop-shadow-lg"
                          />
                        </div>
                        <div className="text-right">
                          <div className="inline-block px-4 py-1.5 rounded-full text-white text-sm font-bold bg-gradient-to-br from-purple-600 to-violet-600 shadow-lg">
                            {course.badge}
                          </div>
                          <p className="text-xs text-gray-700 dark:text-white mt-1">{course.level}</p>
                        </div>
                      </div>

                      <div className="mb-6 space-y-3">
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white text-right leading-tight">
                          {course.title}
                        </h3>
                        <p className="text-base text-gray-700 dark:text-white mb-3 text-right font-semibold leading-relaxed">
                          {course.subtitle}
                        </p>
                        <p className="text-gray-700 dark:text-white text-right leading-relaxed text-base">
                          {course.description}
                        </p>
                      </div>

                      {/* Duration */}
                      <div className="flex items-center justify-end gap-2 mb-6 text-gray-700 dark:text-white">
                        <span className="text-base font-medium">{course.duration}</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>

                      <Button className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-bold py-6 rounded-xl shadow-lg transform group-hover:scale-105 transition-all duration-300 text-lg">
                        <span>اعرف المزيد</span>
                        <ArrowLeft className="w-5 h-5 mr-2" />
                      </Button>

                      {/* Shine Effect */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 rounded-3xl" />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="text-center">
          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white border-0 px-8 py-6 rounded-xl font-bold text-lg shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300"
          >
            استعرض الدورات
          </Button>
        </div>
      </div>
    </section>
  )
}
