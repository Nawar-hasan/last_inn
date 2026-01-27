"use client"

import { useLanguage } from "@/lib/language-context"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import Image from "next/image"

export function Hero() {
  const { language } = useLanguage()
  const isArabic = language === "ar"

  const content = isArabic
    ? {
        title: "نجعل الابتكار واقعًا",
        description:
          "نحوّل الابتكار إلى ممارسة يومية عبر هاكاثونات وورش عمل وجلسات عصف ذهني ومنصّات رقمية متطورة، وتدريب الفرق على منهجية الابتكار تتبنى عقلية الابتكار",
          cta1: "",
      }
    : {
        title: "We Turn Innovation Into Reality",
        description:
          "We turn innovation into a daily practice through hackathons, workshops, brainstorming sessions, advanced digital platforms, and training teams on an innovation methodology that embraces an innovative mindset.",
          cta1: "",
      }

  return (
    <section className="relative isolate overflow-hidden bg-background" dir={isArabic ? "rtl" : "ltr"}>
      <div className="container mx-auto px-4">
        <div className={`grid lg:grid-cols-2 gap-12 items-center py-20 sm:py-28 min-h-[600px]`}>
          {/* Content - Right side for Arabic, Left for English */}
          <div className={`${isArabic ? "order-1 lg:order-1" : "order-1"}`}>
            {/* Badge */}
            <div
              className={`inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm px-4 py-2 rounded-full border border-primary/20 mb-6 hover:bg-primary/15 transition-all cursor-pointer ${isArabic ? "flex-row-reverse" : ""}`}
            >
              <Sparkles className="h-4 w-4 text-[#FFD900]" />
              <span
                className="text-sm text-gray-900 dark:text-white font-semibold"
                style={{ fontFamily: "var(--font-rubik)" }}
              >
                {isArabic ? "منصة التدريب الرائدة" : "Leading Training Platform"}
              </span>
            </div>

            <h1
              className={`text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-6 leading-tight ${isArabic ? "text-right" : "text-left"}`}
              style={{ fontFamily: "var(--font-rubik)", fontWeight: 900 }}
            >
              <span className="bg-gradient-to-r from-[#551FBD] via-[#7B3FDD] to-[#551FBD] bg-clip-text text-transparent drop-shadow-lg">
                {content.title}
              </span>
            </h1>

            <p
              className={`text-xl text-gray-700 dark:text-gray-200 max-w-2xl leading-[1.9] mb-10 font-medium ${isArabic ? "text-right" : "text-left"}`}
              style={{ fontFamily: "var(--font-rubik)" }}
            >
              {content.description}
            </p>

            <div className={`flex flex-col sm:flex-row gap-4 ${isArabic ? "sm:flex-row-reverse" : ""}`}>
              <Button
                asChild
                className="group rounded-full bg-[#551FBD] px-10 py-7 text-white font-bold text-lg hover:bg-[#6B2ADB] 
                shadow-[0_0_30px_rgba(85,31,189,0.5),0_4px_20px_rgba(85,31,189,0.3)] 
                hover:shadow-[0_0_45px_rgba(85,31,189,0.8),0_8px_35px_rgba(85,31,189,0.5)] 
                hover:scale-105 transition-all duration-300 border-2 border-[#53FBA1]/30 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#53FBA1] focus:ring-offset-2"
                style={{ fontFamily: "var(--font-rubik)" }}
              >
                <a
                  href="/contact"
                  className={`flex items-center gap-2 relative z-10 ${isArabic ? "flex-row-reverse" : ""}`}
                >
                  <span>{content.cta1}</span>
                  <span className={`group-hover:${isArabic ? "-translate-x-1" : "translate-x-1"} transition-transform`}>
                    {isArabic ? "←" : "→"}
                  </span>
                </a>
              </Button>
            </div>
          </div>

          {/* Image - Left side for Arabic, Right for English */}
          <div className={`${isArabic ? "order-2 lg:order-2" : "order-2"} flex items-center justify-center`}>
            <div className="relative w-full max-w-lg animate-fade-in-up">
              {/* Main Image */}
              <div className="relative overflow-hidden rounded-3xl">
                <Image
                  src="/lightbulb-sunset-idea.jpg"
                  alt={
                    isArabic
                      ? "الابتكار - لمبة تمثل الأفكار الإبداعية"
                      : "Innovation - Lightbulb representing creative ideas"
                  }
                  width={600}
                  height={600}
                  className="w-full h-auto drop-shadow-2xl mix-blend-luminosity hover:mix-blend-normal transition-all duration-700"
                  style={{
                    filter: "brightness(1.1) contrast(1.05)",
                  }}
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#551FBD]/20 via-transparent to-[#53FBA1]/10 mix-blend-overlay pointer-events-none" />
              </div>

              {/* Decorative glows */}
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-[#53FBA1]/40 rounded-full blur-2xl animate-pulse-glow" />
              <div
                className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#FFD900]/30 rounded-full blur-3xl animate-pulse-glow"
                style={{ animationDelay: "1.5s" }}
              />
              <div
                className="absolute top-1/2 -right-12 w-24 h-24 bg-[#551FBD]/30 rounded-full blur-2xl animate-pulse-glow"
                style={{ animationDelay: "3s" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Decorative gradient blur background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#551FBD]/10 rounded-full blur-[150px] -z-10 animate-pulse-slow" />
      <div
        className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-[#53FBA1]/5 rounded-full blur-[120px] -z-10 animate-pulse-slow"
        style={{ animationDelay: "2s" }}
      />
    </section>
  )
}
