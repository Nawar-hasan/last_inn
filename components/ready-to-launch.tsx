"use client"

import { Users, BookOpen, ArrowLeft, Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useRef, useState } from "react"

const options = [
  {
    id: "individuals",
    icon: BookOpen,
    title: "للأفراد",
    description: "ابدأ دورة أونلاين وحاصل على شهادة احترافية",
    buttonText: "ابدأ دورة أونلاين",
    color: "from-purple-600 to-violet-600",
    iconBg: "bg-gradient-to-br from-purple-600 to-violet-600",
    delay: 0,
  },
  {
    id: "organizations",
    icon: Users,
    title: "للمؤسسات",
    description: "احجز جلسة استكشافية لمناقشة احتياجات منظمتك",
    buttonText: "احجز جلسة استكشافية",
    color: "from-purple-600 to-violet-600",
    iconBg: "bg-gradient-to-br from-purple-600 to-violet-600",
    delay: 300,
  },
]

export function ReadyToLaunch() {
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
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-400 dark:bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-400 dark:bg-violet-500/20 rounded-full blur-3xl animate-pulse-glow" />
      </div>

      <div className="container relative mx-auto px-4">
        {/* Header with rocket icon */}
        <div className="text-center mb-16">
          <div
            className={`inline-flex items-center justify-center mb-6 transform transition-all duration-1000 ${
              isVisible ? "scale-100 rotate-0 opacity-100" : "scale-0 rotate-180 opacity-0"
            }`}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full blur-xl opacity-50 animate-pulse" />
              <div className="relative bg-gradient-to-br from-purple-600 to-violet-600 p-6 rounded-full shadow-2xl">
                <Rocket className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            <span className="bg-gradient-to-r from-purple-600 via-violet-500 to-purple-600 bg-clip-text text-transparent">
              جاهزون للإطلاق؟
            </span>
          </h2>
          <p className="text-lg text-gray-700 dark:text-white max-w-2xl mx-auto">
            اختر المسار المناسب لك وابدأ رحلة الابتكار اليوم
          </p>
        </div>

        {/* Cards */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {options.map((option) => {
            const Icon = option.icon
            return (
              <div
                key={option.id}
                className={`group relative transform transition-all duration-1000 ${
                  isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-20 scale-95"
                }`}
                style={{ transitionDelay: `${option.delay}ms` }}
              >
                <div className="relative h-full animate-float" style={{ animationDelay: `${option.delay}ms` }}>
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-violet-500 rounded-3xl blur-lg opacity-20 group-hover:opacity-40 transition duration-500" />

                  <div className="relative h-full liquid-glass-enhanced rounded-3xl p-10 shadow-2xl border border-border/50 transform group-hover:-translate-y-2 group-hover:shadow-[0_25px_70px_-15px_rgba(139,92,246,0.4)] transition-all duration-500">
                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                      <div className="bg-gradient-to-br from-purple-600 to-violet-600 p-5 rounded-2xl shadow-xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                        <Icon className="w-10 h-10 text-white" />
                      </div>
                    </div>

                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 text-center">
                      {option.title}
                    </h3>
                    <p className="text-gray-700 dark:text-white text-center mb-8 leading-relaxed text-lg">
                      {option.description}
                    </p>

                    <Button className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-bold py-6 rounded-xl shadow-lg transform group-hover:scale-105 transition-all duration-300 text-lg">
                      <span>{option.buttonText}</span>
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

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  )
}
