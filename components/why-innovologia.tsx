"use client"

import { CheckCircle2 } from "lucide-react"
import { useEffect, useRef } from "react"

const features = [
  {
    title: "تركيز على الثقافة",
    description: "نبدأ بالتحول السلوكي والمنهجي قبل الأدوات التقنية",
    gradient: "from-purple-500 to-violet-600",
    delay: 0,
  },
  {
    title: "تجارب عملية",
    description: "هاكاثونات وجلسات تنتج حلولاً قابلة للتطبيق الفوري",
    gradient: "from-violet-500 to-purple-600",
    delay: 100,
  },
  {
    title: "اعتمادات GInI",
    description: "مسارات منظمة ودعم شامل للحصول على شهادات عالمية",
    gradient: "from-purple-600 to-violet-500",
    delay: 200,
  },
  {
    title: "أدوات عالمية",
    description: "نستخدم Miro, Canva, Zoom لتسريع النتائج وتحسين التجربة",
    gradient: "from-violet-600 to-purple-500",
    delay: 300,
  },
]

export function WhyInnovologia() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in")
          }
        })
      },
      { threshold: 0.1 },
    )

    const cards = sectionRef.current?.querySelectorAll(".feature-card")
    cards?.forEach((card) => observer.observe(card))

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative py-24 overflow-hidden bg-gradient-to-b from-background via-background to-background"
    >
      {/* Animated background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-48 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-violet-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -left-48 w-96 h-96 bg-gradient-to-tr from-violet-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container relative z-10 px-4 mx-auto">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-500 via-violet-500 to-purple-600 bg-clip-text text-transparent animate-gradient">
            لماذا Innovologia؟
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-white max-w-3xl mx-auto">
            تتميز بنهج شامل يجمع بين الثقافة والممارسة والاعتماد
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card opacity-0 translate-y-8 transition-all duration-700 ease-out"
              style={{ transitionDelay: `${feature.delay}ms` }}
            >
              <div className="group relative h-full">
                {/* Card */}
                <div className="relative h-full p-8 rounded-2xl backdrop-blur-xl bg-white/50 dark:bg-black/30 border border-gray-200/50 dark:border-white/10 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  {/* Gradient border effect */}
                  <div
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl`}
                  />

                  {/* Icon */}
                  <div className="relative flex items-start gap-4 mb-4">
                    <div
                      className={`flex-shrink-0 p-3 rounded-xl bg-gradient-to-br ${feature.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-2">
                      {feature.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="relative text-base md:text-lg text-gray-700 dark:text-white leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Shine effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Decorative bottom element */}
        <div className="mt-16 flex justify-center">
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent rounded-full" />
        </div>
      </div>
    </section>
  )
}
