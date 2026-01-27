"use client"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { SiteHeader } from "@/components/site-header"
import { AppverseFooter } from "@/components/appverse-footer"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

const syllabus = [
  "وضع الإطار - حول الأهمية",
  "فهم الابتكار",
  "مقدمة لاستراتيجية الابتكار",
  "مسارات الابتكار الاستراتيجي",
  "أدوات الابتكار الاستراتيجي",
  "فهم اقتصاد التجربة",
  "تصميم تجارب عملاء جديدة",
  "مقدمة في ابتكار نماذج الأعمال",
  "التأثير الأعمق للابتكار",
  "بناء خطة عمل ناجحة",
]

const targetAudience = [
  "كبار صُنّاع القرار وقادة الأعمال",
  "المديرون التنفيذيون وكبار مديري الإدارات",
  "المحترفون الراغبون في تطوير رؤية أعمق حول استراتيجيات الابتكار",
]

const pricing = [
  { type: "نسخة رقمية فقط", total: 1635 },
  { type: "نسخة ورقية", total: 1675 },
  { type: "نسخة ورقية + رقمية", total: 1700 },
]

export default function CInSCourseClient() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  const handleEnroll = () => {
    if (!isAuthenticated) {
      router.push("/auth/login?redirect=/checkout?type=course&id=cins")
    } else {
      router.push("/checkout?type=course&id=cins")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center space-y-8">
            <div className="flex justify-center">
              <div className="w-64 h-64 rounded-full bg-gradient-to-br from-purple-600 via-purple-500 to-purple-700 p-1 shadow-2xl">
                <div className="w-full h-full rounded-full bg-[#1a0533] flex items-center justify-center">
                  <Image
                    src="/images/course-badge.jpg"
                    alt="CInS Badge"
                    width={240}
                    height={240}
                    className="rounded-full"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="inline-block px-4 py-2 bg-purple-600/20 rounded-full">
                <span className="text-purple-400 font-semibold text-sm" style={{ fontFamily: "var(--font-rubik)" }}>
                  معهد الابتكار العالمي
                </span>
              </div>
              <h1
                className="text-4xl md:text-5xl font-bold text-foreground leading-tight max-w-4xl mx-auto"
                style={{ fontFamily: "var(--font-rubik)" }}
              >
                الدورة التحضيرية لامتحان شهادة استراتيجي الابتكار المعتمد
              </h1>
              <div
                className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent"
                style={{ fontFamily: "var(--font-rubik)" }}
              >
                CInS
              </div>
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#551FBD] to-[#7B3FDD] hover:from-[#551FBD]/90 hover:to-[#7B3FDD]/90 text-white mt-6"
                style={{ fontFamily: "var(--font-rubik)" }}
                onClick={handleEnroll}
              >
                اشترك في الدورة
                <ArrowRight className="mr-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="liquid-glass-enhanced border border-border/50 rounded-3xl p-12">
            <h2
              className="text-3xl md:text-4xl font-bold text-foreground mb-6"
              style={{ fontFamily: "var(--font-rubik)" }}
            >
              نظرة عامة
            </h2>
            <p className="text-lg text-foreground leading-relaxed" style={{ fontFamily: "var(--font-rubik)" }}>
              تمثل شهادة محترف استراتيجي الابتكار المعتمد (CInS)® من معهد الابتكار العالمي (GInI) اعتماداً رسمياً لقادة
              الأعمال الذين يمتلكون فهماً متقدماً للمفاهيم الأساسية في استراتيجيات الابتكار، وابتكار نماذج الأعمال، وتحسين
              تجربة العملاء.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <Button
            size="lg"
            className="bg-gradient-to-r from-[#551FBD] to-[#7B3FDD] hover:from-[#551FBD]/90 hover:to-[#7B3FDD]/90 text-white text-lg px-12 cursor-pointer"
            style={{ fontFamily: "var(--font-rubik)" }}
            onClick={handleEnroll}
          >
            اشترك في الدورة
            <ArrowRight className="mr-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      <AppverseFooter />
    </div>
  )
}
