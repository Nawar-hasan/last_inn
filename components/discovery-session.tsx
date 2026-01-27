"use client"

import { useLanguage } from "@/lib/language-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Calendar, Users, Clock, Zap } from "lucide-react"

export function DiscoverySessionSection() {
  const { language } = useLanguage()
  const isArabic = language === "ar"

  const content = isArabic
    ? {
        title: "احجز جلسة استكشاف مجانية",
        subtitle: "تحدث مع خبرائنا لمدة 30 دقيقة واكتشف كيف يمكننا مساعدة منظمتك",
        features: [
          { icon: Clock, text: "30 دقيقة فقط", desc: "جلسة سريعة وفعّالة" },
          { icon: Users, text: "1 على 1", desc: "تخصيص كامل لاحتياجاتك" },
          { icon: Zap, text: "خطة مخصصة", desc: "نصائح عملية مباشرة" },
          { icon: Calendar, text: "اختر وقتك", desc: "مرونة تامة في الجدولة" },
        ],
        cta: "احجز الآن",
      }
    : {
        title: "Book Your Free Discovery Session",
        subtitle: "Talk to our experts for 30 minutes and discover how we can help your organization",
        features: [
          { icon: Clock, text: "30 Minutes Only", desc: "Quick and effective session" },
          { icon: Users, text: "1 on 1", desc: "Complete customization" },
          { icon: Zap, text: "Custom Plan", desc: "Direct practical advice" },
          { icon: Calendar, text: "Pick Your Time", desc: "Complete flexibility" },
        ],
        cta: "Book Now",
      }

  return (
    <section id="consultation" className="py-20 sm:py-32 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4 text-foreground"
              style={{ fontFamily: "var(--font-rubik)" }}
            >
              <span className="bg-gradient-to-r from-[#551FBD] to-[#7B3FDD] bg-clip-text text-transparent">
                {content.title}
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-foreground/70 max-w-2xl mx-auto" style={{ fontFamily: "var(--font-rubik)" }}>
              {content.subtitle}
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {content.features.map((feature, idx) => {
              const Icon = feature.icon
              return (
                <Card key={idx} className="liquid-glass p-4 text-center hover:border-[#551FBD]/50 transition-all">
                  <Icon className="h-8 w-8 mx-auto mb-2 text-[#551FBD]" />
                  <p className="font-bold text-sm text-foreground mb-1">{feature.text}</p>
                  <p className="text-xs text-foreground/60">{feature.desc}</p>
                </Card>
              )
            })}
          </div>

          {/* CTA Button */}
          <div className="flex justify-center">
            <Button
              asChild
              className="rounded-full bg-gradient-to-r from-[#551FBD] to-[#7B3FDD] px-10 py-7 text-white font-bold text-lg 
                         hover:from-[#551FBD]/90 hover:to-[#7B3FDD]/90 
                         shadow-[0_0_30px_rgba(85,31,189,0.5)] 
                         hover:shadow-[0_0_45px_rgba(85,31,189,0.8)]
                         hover:scale-105 transition-all duration-300"
              style={{ fontFamily: "var(--font-rubik)" }}
            >
              <a href="https://wa.link/rc25na" target="_blank" rel="noopener noreferrer">
                {content.cta}
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative background */}
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-[#53FBA1]/5 rounded-full blur-[120px] -z-10 animate-pulse-slow" />
    </section>
  )
}
