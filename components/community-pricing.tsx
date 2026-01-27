"use client"

import { useLanguage } from "@/lib/language-context"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { useRouter } from "next/navigation"

export function CommunityPricing() {
  const { language } = useLanguage()
  const isArabic = language === "ar"
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const router = useRouter()

  const pricingData = isArabic
    ? {
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
            cta: "اشترك في الباقة",
            route: "/auth/register",
            icon: "🚀",
          },
          {
            name: "المتقدمة",
            price: "47",
            currency: "$",
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
            cta: "اشترك في الباقة",
            route: "/checkout?type=community&plan=Professional",
            icon: "⭐",
            highlighted: true,
          },
          {
            name: "النخبة",
            price: "197",
            currency: "$",
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
            cta: "اشترك في الباقة",
            route: "/checkout?type=community&plan=Elite",
            icon: "👑",
          },
        ],
      }
    : {
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
            cta: "Subscribe to Plan",
            route: "/auth/register",
            icon: "🚀",
          },
          {
            name: "Professional",
            price: "47",
            currency: "$",
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
            cta: "Subscribe to Plan",
            route: "/checkout?type=community&plan=Professional",
            icon: "⭐",
            highlighted: true,
          },
          {
            name: "Elite",
            price: "197",
            currency: "$",
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
            cta: "Subscribe to Plan",
            route: "/checkout?type=community&plan=Elite",
            icon: "👑",
          },
        ],
      }

  const handleSubscribe = (route: string) => {
    if (route === "/auth/register") {
      router.push("/auth/register?redirect=/community/home")
    } else {
      router.push(route)
    }
  }

  return (
    <section ref={ref} className="py-12 relative">
      <div className="container mx-auto px-4 relative z-10">
        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {pricingData.plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="group"
            >
              <div
                className={`relative h-full rounded-3xl overflow-hidden transition-all duration-500 hover:scale-[1.02] ${
                  plan.highlighted ? "md:scale-105" : ""
                }`}
                style={{
                  background: "linear-gradient(135deg, #0a0a0a 0%, #1a0a2e 50%, #2d1b4e 100%)",
                }}
              >
                {/* Card Content */}
                <div className="relative z-10 p-8 flex flex-col h-full">
                  {/* Badge with icon */}
                  <div className="flex justify-center mb-6">
                    <div className="relative w-32 h-32">
                      <div
                        className="absolute inset-0 rounded-full"
                        style={{
                          background: "conic-gradient(from 0deg, #551FBD, #7B3FDD, #551FBD)",
                          padding: "3px",
                        }}
                      >
                        <div className="w-full h-full rounded-full bg-[#0a0a0a] flex items-center justify-center">
                          <span className="text-5xl">{plan.icon}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Plan Name */}
                  <h3
                    className="text-3xl font-bold text-white text-center mb-3"
                    style={{ fontFamily: "var(--font-rubik)" }}
                  >
                    {plan.name}
                  </h3>

                  {/* Description */}
                  <p
                    className="text-white/70 text-center text-sm mb-6 min-h-[3rem]"
                    style={{ fontFamily: "var(--font-rubik)" }}
                  >
                    {plan.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-3 mb-8 flex-1">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-[#53FBA1] flex-shrink-0 mt-0.5" />
                        <span className="text-white/80 text-sm" style={{ fontFamily: "var(--font-rubik)" }}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Price */}
                  <div className="text-center mb-6">
                    <div className="flex items-baseline justify-center gap-2 mb-2">
                      {plan.currency && <span className="text-2xl font-bold text-white/70">{plan.currency}</span>}
                      <span
                        className="text-5xl font-bold bg-gradient-to-r from-[#551FBD] to-[#7B3FDD] bg-clip-text text-transparent"
                        style={{ fontFamily: "var(--font-rubik)" }}
                      >
                        {plan.price}
                      </span>
                      <span className="text-white/60 text-lg" style={{ fontFamily: "var(--font-rubik)" }}>
                        {plan.period}
                      </span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Button
                    onClick={() => handleSubscribe(plan.route)}
                    className="w-full rounded-full bg-gradient-to-r from-[#551FBD] to-[#7B3FDD] hover:from-[#551FBD]/90 hover:to-[#7B3FDD]/90 text-white font-bold py-6 text-base shadow-[0_0_20px_rgba(85,31,189,0.4)] hover:shadow-[0_0_30px_rgba(85,31,189,0.6)] transition-all duration-300"
                    style={{ fontFamily: "var(--font-rubik)" }}
                  >
                    {plan.cta}
                  </Button>
                </div>

                {/* Highlight glow effect for middle card */}
                {plan.highlighted && (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#551FBD]/20 via-transparent to-[#7B3FDD]/20 pointer-events-none" />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
