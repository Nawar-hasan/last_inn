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

const syllabusAr = [
  "مقدمة في التفكير التصميمي",
  "عملية التفكير التصميمي كاملة",
  "وضوح المشكلة وتوليد زواياها",
  "التعاطف وتكوين الرؤى",
  "توليد الأفكار",
  "اختبار تجارب الفرضيات",
  "بناء النموذج الأولي",
  "إنشاء النماذج المبدئية",
  "أنواع مفاهيم النماذج المبدئية",
]

const syllabusEn = [
  "Introduction to Design Thinking",
  "Complete Design Thinking Process",
  "Problem Clarity and Angle Generation",
  "Empathy and Insight Formation",
  "Idea Generation",
  "Hypothesis Testing Experiments",
  "Building Prototypes",
  "Creating Initial Models",
  "Types of Prototype Concepts",
]

export default function CDTPCourseClient() {
  const { language } = useLanguage()
  const isArabic = language === "ar"
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const router = useRouter()
  const { isAuthenticated } = useAuth()

  const handleEnroll = () => {
    if (!isAuthenticated) {
      router.push("/auth/login?redirect=/checkout?type=course&id=cdtp")
    } else {
      router.push("/checkout?type=course&id=cdtp")
    }
  }

  const content = isArabic
    ? {
        subtitle: "معهد الابتكار العالمي",
        title: "الدورة التحضيرية لامتحان شهادة محترف التفكير التصميمي المعتمد",
        code: "CDTP",
        cta: "احصل على المادة التحضيرية",
        overview: "نظرة عامة",
        overviewText:
          "تمثل شهادة محترف التفكير التصميمي المعتمد (CDTP)® من معهد الابتكار العالمي (GInI) اعتماداً رسمياً للمحترفين في مجال الابتكار الذين يمتلكون فهماً متقدماً للمفاهيم الأساسية المرتبطة بتصميم التجربة البشرية، والتفكير التصميمي، وعملية التفكير التصميمي، وأساليب التصميم.",
        syllabus: "المخطط التفصيلي",
        ctaButton: "اشترك في الدورة",
      }
    : {
        subtitle: "International Innovation Institute",
        title: "Certified Design Thinking Professional Preparation Course",
        code: "CDTP",
        cta: "Get Preparation Material",
        overview: "Overview",
        overviewText:
          "The Certified Design Thinking Professional (CDTP)® certification from the Global Innovation Institute (GInI) is an official certification for innovation professionals who possess advanced understanding of core concepts related to human experience design, design thinking, the design thinking process, and design methodologies.",
        syllabus: "Course Syllabus",
        ctaButton: "Enroll Now",
      }

  const syllabus = isArabic ? syllabusAr : syllabusEn

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0014] via-[#1a0533] to-[#0A0014]">
      <SiteHeader />

      <main className="relative z-10">
        {/* Hero Section */}
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
                      alt="CDTP Badge"
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
                  {content.ctaButton}
                  <ArrowRight className={`h-5 w-5 ${isArabic ? "mr-2 rotate-180" : "ml-2"}`} />
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Overview Section */}
        <section ref={ref} className="py-20 px-4">
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

        {/* Syllabus Section */}
        <section className="py-20 px-4">
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
              {content.syllabus}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {syllabus.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <div className="bg-gradient-to-br from-[#1a0533] to-[#0A0014] border border-purple-600/30 rounded-2xl p-6 flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center text-white font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <p className="text-gray-300 leading-relaxed" style={{ fontFamily: "var(--font-rubik)" }}>
                      {item}
                    </p>
                  </div>
                </motion.div>
              ))}
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
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white text-lg px-12 cursor-pointer"
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
