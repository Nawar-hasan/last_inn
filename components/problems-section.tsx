"use client"

import { useLanguage } from "@/lib/language-context"
import { AlertCircle, Brain, Target, Zap, Users } from "lucide-react"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"

export function ProblemsSection() {
  const { language } = useLanguage()
  const isArabic = language === "ar"
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const problems = isArabic
    ? [
        {
          icon: Brain,
          title: "الاعتقاد أن الإبداع موهبة فقط",
          description: "الكثيرون يعتقدون أن الإبداع موهبة طبيعية وليست مهارة قابلة للتعلم والتطوير.",
        },
        {
          icon: Target,
          title: "الخوف من امتحانات معهد الابتكار",
          description: "قلق من اجتياز اختبارات الابتكار الدولية والحصول على شهادات معترف بها عالمياً.",
        },
        {
          icon: Zap,
          title: "عدم القدرة على رؤية منظور جديد",
          description: "صعوبة الخروج من الأنماط التقليدية والتفكير بطرق مختلفة وجديدة.",
        },
        {
          icon: AlertCircle,
          title: "فشل في إيجاد حلول مميزة",
          description: "حتى مع وجود الأفكار، قد تفشل في تحويلها لحلول تنافسية وفعّالة.",
        },
        {
          icon: Users,
          title: "قلة المعرفة بخطوات الابتكار",
          description: "عدم معرفة المراحل والخطوات الصحيحة لعملية الابتكار والتطوير المستمر.",
        },
      ]
    : [
        {
          icon: Brain,
          title: "Believing Creativity is Just a Talent",
          description: "Many believe creativity is a natural talent, not a learnable skill that can be developed.",
        },
        {
          icon: Target,
          title: "Fear of Innovation Institute Exams",
          description:
            "Anxiety about passing international innovation certifications and obtaining globally recognized certificates.",
        },
        {
          icon: Zap,
          title: "Inability to See New Perspectives",
          description: "Difficulty breaking traditional patterns and thinking in new and different ways.",
        },
        {
          icon: AlertCircle,
          title: "Failing to Find Unique Solutions",
          description: "Even with ideas, you may fail to transform them into competitive and effective solutions.",
        },
        {
          icon: Users,
          title: "Lack of Knowledge About Innovation Steps",
          description:
            "Not knowing the correct stages and steps for the innovation and continuous improvement process.",
        },
      ]

  return (
    <section ref={ref} className="py-20 sm:py-32 relative overflow-hidden" dir={isArabic ? "rtl" : "ltr"}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#53FBA1]/5 dark:via-[#53FBA1]/10 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2
            className="mb-3 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white"
            style={{ fontFamily: "var(--font-rubik)" }}
          >
            <span className="bg-gradient-to-r from-[#53FBA1] via-[#2AE89F] to-[#53FBA1] bg-clip-text text-transparent">
              {isArabic ? "التحديات التي نساعدك في تجاوزها" : "Challenges We Help You Overcome"}
            </span>
          </h2>
          <p className="text-lg text-gray-700 dark:text-white mt-4 max-w-3xl mx-auto" style={{ fontFamily: "var(--font-rubik)" }}>
            {isArabic
              ? "نحن نفهم العقبات التي تواجهك، وقد صممنا حلولنا بناءً على خبرة سنوات من العمل مع المحترفين"
              : "We understand the obstacles you face, and we've designed our solutions based on years of experience"}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {problems.map((problem, index) => {
            const Icon = problem.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className="relative h-full rounded-2xl overflow-hidden liquid-glass-enhanced border border-border/50 hover:border-[#53FBA1]/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-[#53FBA1]/20 p-6 flex flex-col">
                  {/* Icon and Title */}
                  <div className={`flex items-start gap-4 mb-4 ${isArabic ? "flex-row-reverse" : ""}`}>
                    <div className="p-3 rounded-xl bg-gradient-to-br from-[#53FBA1]/20 to-[#2AE89F]/20 group-hover:from-[#53FBA1]/40 group-hover:to-[#2AE89F]/40 transition-all flex-shrink-0">
                      <Icon className="h-6 w-6 text-[#53FBA1] dark:text-[#53FBA1]" />
                    </div>
                    <h3
                      className="font-bold text-gray-900 dark:text-white text-lg"
                      style={{ fontFamily: "var(--font-rubik)" }}
                    >
                      {problem.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p
                    className="text-gray-700 dark:text-gray-300 text-sm mb-4 leading-relaxed flex-1"
                    style={{ fontFamily: "var(--font-rubik)" }}
                    dir={isArabic ? "rtl" : "ltr"}
                  >
                    {problem.description}
                  </p>

                  <div
                    className={`pt-4 border-t border-border/30 flex items-center gap-2 text-[#53FBA1] dark:text-[#53FBA1] font-semibold ${isArabic ? "flex-row-reverse" : ""}`}
                  >
                    <div className="w-2 h-2 rounded-full bg-[#53FBA1] dark:bg-[#53FBA1] flex-shrink-0" />
                    <span className="text-sm">{isArabic ? "لدينا الحل" : "We Have The Solution"}</span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
