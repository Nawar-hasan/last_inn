"use client"

import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-context"
import { SiteHeader } from "@/components/site-header"
import { AppverseFooter } from "@/components/appverse-footer"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

const pricingAr = [
  { type: "نسخة رقمية فقط", total: 2156 },
  { type: "نسخة ورقية", total: 2196 },
  { type: "نسخة ورقية + رقمية", total: 2221 },
]

const pricingEn = [
  { type: "Digital Only", total: 2156 },
  { type: "Physical Copy", total: 2196 },
  { type: "Physical + Digital", total: 2221 },
]

export default function AInACourseClientPage() {
  const { language } = useLanguage()
  const isArabic = language === "ar"
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const { isAuthenticated } = useAuth()
  const router = useRouter()

  const handleEnroll = () => {
    if (!isAuthenticated) {
      router.push("/auth/login?redirect=/checkout?course=aina")
    } else {
      router.push("/checkout?course=aina&name=دورة مقيم الابتكار المعتمد AInA&price=2156")
    }
  }

  const content = isArabic
    ? {
        subtitle: "معهد الابتكار العالمي",
        title: "الدورة التحضيرية لامتحان شهادة مقيم الابتكار المعتمد",
        code: "AInA",
        cta: "احصل على المادة التحضيرية",
        overview: "نظرة عامة",
        overviewText:
          "يُعد مقيم الابتكار المعتمد (AInA) اعتماداً من معهد الابتكار العالمي للأفراد الذين استوفوا معاييره لإجراء تقييمات نضج الابتكار لصالح المؤسسات التي تسعى للحصول على شهادة المنظمة المبتكرة المعتمدة (CInOrg).",
        pricing: "التكاليف المالية",
        ctaButton: "احصل على المادة التحضيرية الآن",
      }
    : {
        subtitle: "International Innovation Institute",
        title: "Accredited Innovation Assessor Preparation Course",
        code: "AInA",
        cta: "Get Preparation Material",
        overview: "Overview",
        overviewText:
          "The Accredited Innovation Assessor (AInA) is a certification from the Global Innovation Institute for individuals who have met its criteria to conduct innovation maturity assessments for organizations seeking Certified Innovative Organization (CInOrg) certification.",
        pricing: "Pricing",
        ctaButton: "Get Preparation Material Now",
      }

  const pricing = isArabic ? pricingAr : pricingEn

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0014] via-[#1a0533] to-[#0A0014]">
      <SiteHeader />

      <main className="relative z-10">
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="text-center space-y-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="flex justify-center"
              >
                <div className="w-64 h-64 rounded-full bg-gradient-to-br from-purple-600 via-purple-500 to-purple-700 p-1 shadow-2xl">
                  <div className="w-full h-full rounded-full bg-[#1a0533] flex items-center justify-center">
                    <Image
                      src="/images/course-badge.jpg"
                      alt="AInA Badge"
                      width={240}
                      height={240}
                      className="rounded-full"
                    />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-4"
              >
                <div className="inline-block px-4 py-2 bg-purple-600/20 rounded-full">
                  <span className="text-purple-400 font-semibold text-sm" style={{ fontFamily: "var(--font-rubik)" }}>
                    {content.subtitle}
                  </span>
                </div>
                <h1
                  className="text-4xl md:text-5xl font-bold text-white leading-tight max-w-4xl mx-auto"
                  style={{ fontFamily: "var(--font-rubik)" }}
                >
                  {content.title}
                </h1>
                <div className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                  {content.code}
                </div>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white mt-6"
                  style={{ fontFamily: "var(--font-rubik)" }}
                  onClick={handleEnroll}
                >
                  {content.cta}
                  <ArrowRight className={`h-5 w-5 ${isArabic ? "mr-2 rotate-180" : "ml-2"}`} />
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        <section ref={ref} className="py-20 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="container mx-auto max-w-6xl"
          >
            <h2
              className="text-3xl md:text-4xl font-bold text-white mb-12 text-center"
              style={{ fontFamily: "var(--font-rubik)" }}
            >
              {content.pricing}
            </h2>

            {/* Pricing Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              {pricing.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="bg-gradient-to-br from-[#1a0533] to-[#0A0014] border border-purple-600/30 rounded-2xl p-8 text-center">
                    <h3 className="text-xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-rubik)" }}>
                      {item.type}
                    </h3>
                    <div className="text-4xl font-bold text-purple-400">${item.total}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pricing Table */}
            <div className="bg-gradient-to-br from-[#1a0533] to-[#0A0014] border border-purple-600/30 rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-4">
                <div className="grid grid-cols-6 gap-4 text-white font-bold text-center">
                  <div>المواد</div>
                  <div>الشحن</div>
                  <div>الامتحان</div>
                  <div>شهادة النجاح</div>
                  <div>مجموع</div>
                  <div>السعر</div>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-6 gap-4 text-white text-center items-center">
                  <div className="text-right pr-4">نسخة رقمية فقط</div>
                  <div>$350</div>
                  <div>$0</div>
                  <div>$550</div>
                  <div>$530</div>
                  <div className="font-bold text-purple-400">$1430</div>
                </div>
                <div className="grid grid-cols-6 gap-4 text-white text-center items-center">
                  <div className="text-right pr-4">نسخة ورقية</div>
                  <div>$350</div>
                  <div>$40</div>
                  <div>$550</div>
                  <div>$530</div>
                  <div className="font-bold text-purple-400">$1470</div>
                </div>
                <div className="grid grid-cols-6 gap-4 text-white text-center items-center">
                  <div className="text-right pr-4">نسخة ورقية + رقمية</div>
                  <div>$375</div>
                  <div>$40</div>
                  <div>$550</div>
                  <div>$530</div>
                  <div className="font-bold text-purple-400">$1495</div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <section className="py-20 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="container mx-auto max-w-6xl"
          >
            <div className="bg-gradient-to-br from-[#1a0533] to-[#0A0014] border border-purple-600/30 rounded-3xl p-12">
              <h2
                className="text-3xl md:text-4xl font-bold text-white mb-6"
                style={{ fontFamily: "var(--font-rubik)" }}
                dir={isArabic ? "rtl" : "ltr"}
              >
                {content.overview}
              </h2>
              <p
                className="text-lg text-gray-300 leading-relaxed"
                style={{ fontFamily: "var(--font-rubik)" }}
                dir={isArabic ? "rtl" : "ltr"}
              >
                {content.overviewText}
              </p>
            </div>
          </motion.div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="container mx-auto max-w-4xl text-center"
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white text-lg px-12"
              style={{ fontFamily: "var(--font-rubik)" }}
              onClick={handleEnroll}
            >
              {content.ctaButton}
              <ArrowRight className={`h-5 w-5 ${isArabic ? "mr-2 rotate-180" : "ml-2"}`} />
            </Button>
          </motion.div>
        </section>
      </main>

      <AppverseFooter />
    </div>
  )
}
