"use client"

import { useLanguage } from "@/lib/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { CheckCircle2, Zap } from "lucide-react"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"

export function PricingInnovologia() {
  const { language } = useLanguage()
  const isArabic = language === "ar"
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const pricingData = isArabic
    ? {
        title: "اختر الباقة المناسبة لك",
        subtitle: "ثلاث خيارات مرنة مصممة لكل مرحلة من رحلتك في الابتكار",
        plans: [
          {
            name: "الأساسية",
            price: "مجاني",
            period: "للأبد",
            description: "ابدأ رحلتك في عالم الابتكار بدون تكاليف",
            features: [
              "الوصول إلى مجتمع مجاني",
              "محتوى تحفيزي أسبوعي",
              "نصائح وتقنيات الابتكار الأساسية",
              "فرص التواصل مع المبتكرين",
            ],
            cta: "ابدأ الآن",
            highlighted: false,
            icon: "🚀",
          },
          {
            name: "المتقدمة",
            price: "47",
            period: "/ شهر",
            description: "للمحترفين والباحثين الجادين الذين يريدون التقدم",
            features: [
              "كل مميزات الأساسية",
              "مجتمع احترافي حصري",
              "تواصل مباشر مع خبراء معتمدين",
              "فعاليات ودورات مغلقة شهرية",
              "وثائق ودراسات حالة متقدمة",
              "شهادات إثبات المشاركة",
            ],
            cta: "اشترك الآن",
            highlighted: true,
            icon: "⭐",
          },
          {
            name: "النخبة",
            price: "197",
            period: "/ شهر",
            description: "للقادة والمؤسسات التي تريد التفوق المطلق",
            features: [
              "كل مميزات المتقدمة",
              "دورة تدريبية مدفوعة شهرياً",
              "شهادة معهد الابتكار العالمي",
              "جلسات استشارية مخصصة مع الخبراء",
              "محتوى حصري وأدوات متقدمة",
              "أولوية الدعم 24/7",
              "برامج تدريب مؤسسية مخصصة",
            ],
            cta: "اشترك الآن",
            highlighted: false,
            icon: "👑",
          },
        ],
      }
    : {
        title: "Choose Your Plan",
        subtitle: "Three flexible options designed for every stage of your innovation journey",
        plans: [
          {
            name: "Basic",
            price: "Free",
            period: "Forever",
            description: "Start your innovation journey at no cost",
            features: [
              "Access to free community",
              "Weekly motivational content",
              "Basic innovation tips and techniques",
              "Networking with innovators",
            ],
            cta: "Start Now",
            highlighted: false,
            icon: "🚀",
          },
          {
            name: "Professional",
            price: "47",
            period: "/ month",
            description: "For serious professionals who want to advance",
            features: [
              "All Basic features",
              "Exclusive professional community",
              "Direct access to certified experts",
              "Monthly closed events and courses",
              "Advanced case studies and documents",
              "Participation certificates",
            ],
            cta: "Subscribe Now",
            highlighted: true,
            icon: "⭐",
          },
          {
            name: "Elite",
            price: "197",
            period: "/ month",
            description: "For leaders who want absolute excellence",
            features: [
              "All Professional features",
              "Monthly paid training course",
              "International Innovation Institute Certificate",
              "Custom consulting sessions with experts",
              "Exclusive advanced content and tools",
              "Priority 24/7 support",
              "Custom corporate training programs",
            ],
            cta: "Subscribe Now",
            highlighted: false,
            icon: "👑",
          },
        ],
      }

  return (
    <section ref={ref} id="pricing" className="py-20 sm:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#551FBD]/5 dark:via-[#551FBD]/10 to-transparent" />
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#551FBD]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#53FBA1]/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className={`text-center mb-16 ${isArabic ? "text-right" : "text-left"}`}
        >
          <h2
            className="mb-4 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white"
            style={{ fontFamily: "var(--font-rubik)" }}
          >
            <span className="bg-gradient-to-r from-[#551FBD] via-[#7B3FDD] to-[#551FBD] bg-clip-text text-transparent">
              {pricingData.title}
            </span>
          </h2>
          <p
            className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 mt-4 max-w-3xl"
            style={{ fontFamily: "var(--font-rubik)" }}
          >
            {pricingData.subtitle}
          </p>
        </motion.div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-6">
          {pricingData.plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={plan.highlighted ? "md:scale-105 md:z-10" : ""}
            >
              <Card
                className={`relative overflow-hidden flex flex-col h-full transition-all duration-500 ${
                  plan.highlighted
                    ? "bg-gradient-to-br from-[#551FBD]/5 to-[#7B3FDD]/5 dark:from-[#551FBD]/10 dark:to-[#7B3FDD]/10 border-2 border-[#551FBD] shadow-2xl shadow-[#551FBD]/30 ring-2 ring-[#551FBD]/20"
                    : "bg-gradient-to-br from-background/50 to-background/80 border-2 border-[#551FBD]/30 hover:border-[#551FBD]/60 shadow-lg hover:shadow-xl hover:shadow-[#551FBD]/20"
                }`}
              >
                {/* Top Gradient Bar */}
                {plan.highlighted && <div className="h-1 bg-gradient-to-r from-[#551FBD] via-[#7B3FDD] to-[#551FBD]" />}

                {/* Popular Badge */}
                {plan.highlighted && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="absolute -top-4 left-1/2 -translate-x-1/2 z-20"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-[#551FBD] to-[#7B3FDD] rounded-full blur-lg opacity-75 animate-pulse" />
                      <div className="relative flex items-center gap-2 bg-gradient-to-r from-[#551FBD] to-[#7B3FDD] text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-xl backdrop-blur-md border border-white/30">
                        <Zap className="w-4 h-4 animate-pulse" />
                        <span style={{ fontFamily: "var(--font-rubik)" }}>
                          {isArabic ? "الأكثر شهرة" : "Most Popular"}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}

                <CardHeader className={`space-y-4 ${plan.highlighted ? "pt-8" : ""}`}>
                  {/* Icon and Name */}
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{plan.icon}</span>
                    <h3
                      className="text-2xl font-bold text-gray-900 dark:text-white"
                      style={{ fontFamily: "var(--font-rubik)" }}
                    >
                      {plan.name}
                    </h3>
                  </div>

                  {/* Description */}
                  <p
                    className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed"
                    style={{ fontFamily: "var(--font-rubik)" }}
                  >
                    {plan.description}
                  </p>

                  {/* Price Section */}
                  <div className="py-8 border-y border-[#551FBD]/20">
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-5xl font-bold bg-gradient-to-r from-[#551FBD] to-[#7B3FDD] bg-clip-text text-transparent">
                        {plan.price}
                      </span>
                      <span className="text-gray-700 dark:text-gray-400">{plan.period}</span>
                    </div>
                    {plan.price !== "Free" && plan.price !== "مجاني" && (
                      <p
                        className="text-xs text-gray-600 dark:text-gray-400"
                        style={{ fontFamily: "var(--font-rubik)" }}
                      >
                        {isArabic ? "ضمان استرجاع 30 يوم" : "30-day money-back guarantee"}
                      </p>
                    )}
                  </div>

                  {/* CTA Button */}
                  <Button
                    className={`w-full rounded-full font-bold py-6 text-base transition-all duration-300 ${
                      plan.highlighted
                        ? "bg-gradient-to-r from-[#551FBD] to-[#7B3FDD] hover:from-[#551FBD]/90 hover:to-[#7B3FDD]/90 text-white shadow-lg hover:shadow-[0_0_25px_rgba(85,31,189,0.5)] hover:scale-105"
                        : "bg-[#551FBD]/15 text-[#551FBD] dark:text-[#551FBD] hover:bg-[#551FBD]/25 border-2 border-[#551FBD]/50 hover:border-[#551FBD] hover:scale-102"
                    }`}
                    style={{ fontFamily: "var(--font-rubik)" }}
                  >
                    {plan.cta}
                  </Button>
                </CardHeader>

                {/* Features List */}
                <CardContent className="space-y-4 flex-1 pb-8">
                  {plan.features.map((feature, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: isArabic ? 10 : -10 }}
                      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: isArabic ? 10 : -10 }}
                      transition={{ delay: index * 0.1 + idx * 0.05 }}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle2 className="h-5 w-5 text-[#551FBD] dark:text-[#53FBA1] flex-shrink-0 mt-0.5" />
                      <span
                        className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed"
                        style={{ fontFamily: "var(--font-rubik)" }}
                      >
                        {feature}
                      </span>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-600 dark:text-gray-400 text-base mb-6" style={{ fontFamily: "var(--font-rubik)" }}>
            {isArabic
              ? "هل تحتاج إلى حل مخصص؟ تواصل مع فريقنا للحصول على عرض خاص"
              : "Need a custom solution? Contact our team for a special offer"}
          </p>
          <Button
            variant="outline"
            className="rounded-full px-8 py-3 border-2 border-[#551FBD] text-[#551FBD] hover:bg-[#551FBD]/10 bg-transparent"
            style={{ fontFamily: "var(--font-rubik)" }}
          >
            {isArabic ? "تواصل معنا" : "Get in Touch"}
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
