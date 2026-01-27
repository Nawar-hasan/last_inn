'use client'

import { useLanguage } from "@/lib/language-context"
import { Card } from "@/components/ui/card"

export function StatsSection() {
  const { language } = useLanguage()
  const isArabic = language === 'ar'

  const stats = isArabic ? [
    {
      number: "10+",
      label: "سنوات بحث متقدم",
      description: "دراسات عميقة في مجال الابتكار"
    },
    {
      number: "12+",
      label: "سنة تدريب احترافي",
      description: "تجربة عملية مع المؤسسات الكبرى"
    },
    {
      number: "1000+",
      label: "متدرب معتمد",
      description: "من مختلف الدول والصناعات"
    },
    {
      number: "#1",
      label: "رئيس رابطة الأردن",
      description: "للابتكار والإبداع المؤسسي"
    }
  ] : [
    {
      number: "10+",
      label: "Years of Advanced Research",
      description: "Deep studies in innovation field"
    },
    {
      number: "12+",
      label: "Years of Professional Training",
      description: "Practical experience with major organizations"
    },
    {
      number: "1000+",
      label: "Certified Trainees",
      description: "From different countries and industries"
    },
    {
      number: "#1",
      label: "President of Jordan Association",
      description: "For Innovation and Institutional Creativity"
    }
  ]

  return (
    <section className="container mx-auto px-4 py-16 sm:py-20" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="text-center mb-16">
        <h2
          className="mb-3 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl"
          style={{ fontFamily: "var(--font-rubik)" }}
        >
          {isArabic ? "خبرة ومصداقية" : "Experience & Credibility"}
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="liquid-glass border-2 border-purple-500/30 hover:border-purple-500/50 transition-all duration-300 p-6 text-center hover:scale-105 cursor-pointer">
            <div className="text-4xl font-black text-purple-600 dark:text-purple-400 mb-2" style={{ fontFamily: "var(--font-rubik)" }}>
              {stat.number}
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2" style={{ fontFamily: "var(--font-rubik)" }}>
              {stat.label}
            </h3>
            <p className="text-sm text-gray-700 dark:text-white/80" style={{ fontFamily: "var(--font-rubik)" }}>
              {stat.description}
            </p>
          </Card>
        ))}
      </div>
    </section>
  )
}
