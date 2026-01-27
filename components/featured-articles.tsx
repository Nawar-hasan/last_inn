"use client"

import Link from "next/link"
import Image from "next/image"
import { useLanguage } from "@/lib/language-context"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Calendar, Clock, ArrowRight } from "lucide-react"

const blogPosts = [
  {
    id: 1,
    slug: "innovation-culture-building",
    title: "كيف تبني ثقافة الابتكار في مؤسستك",
    titleEn: "Building an Innovation Culture in Your Organization",
    excerpt: "الابتكار ليس حدثاً عابراً، بل ثقافة مستدامة تحتاج إلى بيئة داعمة وقيادة ملهمة.",
    excerptEn: "Innovation is not a fleeting event, but a sustainable culture that requires a supportive environment.",
    image: "/blog/innovation-culture.jpg",
    date: "2025-01-15",
    readTimeAr: "8 دقائق",
    readTimeEn: "8 min read",
  },
  {
    id: 2,
    slug: "design-thinking-practical-guide",
    title: "دليلك العملي للتفكير التصميمي",
    titleEn: "Your Practical Guide to Design Thinking",
    excerpt: "التفكير التصميمي منهجية قوية لحل المشكلات المعقدة. تعلم كيف تطبق مراحله الخمس.",
    excerptEn:
      "Design thinking is a powerful methodology for solving complex problems and turning challenges into opportunities.",
    image: "/blog/design-thinking.jpg",
    date: "2025-01-10",
    readTimeAr: "12 دقيقة",
    readTimeEn: "12 min read",
  },
  {
    id: 3,
    slug: "creative-brainstorming-techniques",
    title: "تقنيات العصف الذهني الإبداعي",
    titleEn: "Creative Brainstorming Techniques",
    excerpt: "العصف الذهني أكثر من مجرد جلسة اقتراحات. تعرف على أفضل التقنيات والأدوات.",
    excerptEn:
      "Discover the best techniques and tools to stimulate collective creativity and generate innovative ideas.",
    image: "/blog/brainstorming.jpg",
    date: "2025-01-05",
    readTimeAr: "6 دقائق",
    readTimeEn: "6 min read",
  },
]

export function FeaturedArticles() {
  const { language } = useLanguage()
  const isArabic = language === "ar"
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section ref={ref} className="py-20 sm:py-32 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#551FBD]/5 dark:via-[#551FBD]/10 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 text-gray-900 dark:text-white"
            style={{ fontFamily: "var(--font-rubik)" }}
          >
            <span className="bg-gradient-to-r from-[#551FBD] via-[#7B3FDD] to-[#551FBD] bg-clip-text text-transparent">
              {isArabic ? "أبرز المقالات" : "Featured Articles"}
            </span>
          </h2>
          <p
            className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto"
            style={{ fontFamily: "var(--font-rubik)" }}
          >
            {isArabic
              ? "اكتشف أحدث الأفكار والرؤى حول عالم الابتكار والتفكير الإبداعي"
              : "Discover the latest ideas and insights about innovation and creative thinking"}
          </p>
        </motion.div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogPosts.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={`/blog/${article.slug}`} className="group h-full block">
                <article className="h-full liquid-glass-enhanced rounded-2xl overflow-hidden border border-[#551FBD]/30 hover:border-[#551FBD]/80 transition-all duration-500 hover:shadow-2xl hover:shadow-[#551FBD]/30 flex flex-col">
                  {/* Image Container */}
                  <div className="relative h-56 overflow-hidden bg-gradient-to-br from-[#551FBD]/10 to-[#53FBA1]/10">
                    <Image
                      src={article.image || "/placeholder.svg?height=224&width=400&query=article"}
                      alt={isArabic ? article.title : article.titleEn}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    {/* Meta Info */}
                    <div
                      className={`flex items-center gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400 flex-wrap ${isArabic ? "flex-row-reverse" : ""}`}
                    >
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span style={{ fontFamily: "var(--font-rubik)" }}>
                          {new Date(article.date).toLocaleDateString(isArabic ? "ar-EG" : "en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span style={{ fontFamily: "var(--font-rubik)" }}>
                          {isArabic ? article.readTimeAr : article.readTimeEn}
                        </span>
                      </span>
                    </div>

                    {/* Title */}
                    <h3
                      className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-[#551FBD] transition-colors line-clamp-2"
                      style={{ fontFamily: "var(--font-rubik)" }}
                      dir={isArabic ? "rtl" : "ltr"}
                    >
                      {isArabic ? article.title : article.titleEn}
                    </h3>

                    {/* Excerpt */}
                    <p
                      className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm flex-1 line-clamp-2 mb-4"
                      style={{ fontFamily: "var(--font-rubik)" }}
                      dir={isArabic ? "rtl" : "ltr"}
                    >
                      {isArabic ? article.excerpt : article.excerptEn}
                    </p>

                    {/* Read More Link */}
                    <div
                      className={`pt-4 border-t border-[#551FBD]/20 flex items-center gap-2 text-[#551FBD] font-semibold group-hover:gap-3 transition-all ${isArabic ? "flex-row-reverse" : ""}`}
                    >
                      <span>{isArabic ? "اقرأ المزيد" : "Read More"}</span>
                      <ArrowRight
                        className={`h-5 w-5 ${
                          isArabic ? "group-hover:-translate-x-1" : "group-hover:translate-x-1"
                        } transition-transform`}
                      />
                    </div>
                  </div>
                </article>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link href="/blog">
            <button
              className="px-8 py-4 bg-gradient-to-r from-[#551FBD] to-[#7B3FDD] text-white font-bold rounded-full
                         hover:from-[#551FBD]/90 hover:to-[#7B3FDD]/90 hover:shadow-[0_0_30px_rgba(85,31,189,0.5)] 
                         hover:scale-105 transition-all duration-300"
              style={{ fontFamily: "var(--font-rubik)" }}
            >
              {isArabic ? "اطلع على جميع المقالات" : "View All Articles"}
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
