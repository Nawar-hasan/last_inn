import type { Metadata } from "next"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/site-header"
import { AppverseFooter } from "@/components/appverse-footer"

export const metadata: Metadata = {
  title: "دورة محترف الابتكار المعتمد CInP - Innovologia",
  description: "الدورة التحضيرية لامتحان شهادة محترف الابتكار المعتمد من معهد الابتكار العالمي",
}

const syllabus = [
  "محترف الابتكار – المتغيرات العالمية لعالم الأعمال",
  "أساسيات الابتكار – التعرف على ابتكار الأعمال",
  "تحقيق الابتكار – إدارة مشروعات الابتكار في المنظمة",
  "مخرجات التصميم المرتبطة بالابتكار",
  "المبتكر الفعال",
  "الإبداع وتوليد الأفكار والعصف الذهني",
  "التركيز الرئيسي - دور البحوث في الابتكار",
  "التفكير التصميمي والتصميم المتمحور حول الإنسان",
  "مدير الابتكار – سادة التجديد",
  "قيادة وبناء فرق الابتكار الجوهرية",
  "عملية إدارة الابتكار",
  "المشاركة – فن الابتكار التشاركي",
  "السرد القصصي – كيف تثير الخيال وتغير المسار",
]

const targetAudience = [
  "المهنيون الراغبون في فهم أعمق للابتكار",
  "القادة التنفيذيون ومديرو الابتكار",
  "المستشارون والمتخصصون في الابتكار",
  "الأفراد الطامحون لإثبات خبراتهم في مجال الابتكار",
]

const pricing = [
  { type: "نسخة رقمية فقط", book: 350, shipping: 0, exam: 550, material: 530, total: 1430 },
  { type: "نسخة ورقية", book: 350, shipping: 40, exam: 550, material: 530, total: 1470 },
  { type: "نسخة ورقية + رقمية", book: 375, shipping: 40, exam: 550, material: 530, total: 1495 },
]

export default function CInPCoursePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0014] via-[#1a0533] to-[#0A0014]">
      <SiteHeader />

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center space-y-8">
            <div className="flex justify-center">
              <div className="w-64 h-64 rounded-full bg-gradient-to-br from-purple-600 via-purple-500 to-purple-700 p-1 shadow-2xl">
                <div className="w-full h-full rounded-full bg-[#1a0533] flex items-center justify-center">
                  <Image
                    src="/images/course-badge.jpg"
                    alt="CInP Badge"
                    width={240}
                    height={240}
                    className="rounded-full"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="inline-block px-4 py-2 bg-purple-600/20 rounded-full">
                <span className="text-purple-400 font-semibold text-sm">معهد الابتكار العالمي</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight max-w-4xl mx-auto">
                الدورة التحضيرية لامتحان شهادة محترف الابتكار المعتمد
              </h1>
              <div className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                CInP
              </div>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                هذه الدورة تهدف إلى إعدادك لاجتياز امتحان محترف الابتكار المعتمد، وهي تقدم استراتيجيات وأساليب الابتكار.
              </p>
              <div className="flex justify-center gap-4 mt-6">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
                >
                  اشترك في الدورة
                  <ArrowRight className="mr-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-gradient-to-br from-[#1a0533] to-[#0A0014] border border-purple-600/30 rounded-3xl p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">نظرة عامة</h2>
            <p className="text-lg text-gray-300 leading-relaxed">
              تُعد شهادة محترف الابتكار المعتمد (CInP) التي يقدمها معهد الابتكار العالمي (GInI) بمثابة اعتراف بالمحترفين
              الذين أظهروا فهماً متعمقاً للمواضيع الرئيسية المتعلقة بابتكار الأعمال وإدارة الابتكار. يظهر الحصول على شهادة
              محترف الابتكار المعتمد كفاءة الفرد في استخدام أساليب الابتكار وأدواته الأساسية والتأسيسية.
            </p>
          </div>
        </div>
      </section>

      {/* Target Audience */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">الفئة المستهدفة</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {targetAudience.map((item, index) => (
              <div key={index} className="liquid-glass-enhanced rounded-2xl p-6 flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                  {index + 1}
                </div>
                <p className="text-foreground">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Syllabus */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">المخطط التفصيلي للدورة</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {syllabus.map((item, index) => (
              <div
                key={index}
                className="liquid-glass-enhanced rounded-2xl p-6 flex items-start gap-4 hover:scale-105 transition-all duration-300"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                  {index + 1}
                </div>
                <p className="text-foreground">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">التكاليف المالية</h2>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {pricing.map((row, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-[#1a0533] to-[#0A0014] border border-purple-600/30 rounded-2xl p-8 text-center"
              >
                <h3 className="text-xl font-bold text-white mb-4">{row.type}</h3>
                <div className="text-4xl font-bold text-purple-400">${row.total}</div>
              </div>
            ))}
          </div>

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
              {pricing.map((row, index) => (
                <div key={index} className="grid grid-cols-6 gap-4 text-white text-center items-center">
                  <div className="text-right pr-4">{row.type}</div>
                  <div>${row.book}</div>
                  <div>${row.shipping}</div>
                  <div>${row.exam}</div>
                  <div>${row.material}</div>
                  <div className="font-bold text-purple-400">${row.total}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Instructor */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="liquid-glass-enhanced rounded-3xl p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">المدرب: أسامة بدندي</h2>
            <p className="text-xl text-purple-400 dark:text-purple-400 mb-8">خبير الابتكار والتفكير الإبداعي</p>
            <div className="space-y-2 text-white">
              <p>• رئيس رابطة الأردن لمعهد الابتكار العالمي</p>
              <p>• مقيم معتمد من معهد الابتكار العالمي</p>
              <p>• رئيس تنفيذي معتمد من معهد الابتكار العالمي</p>
              <p>• محترف ابتكار معتمد من معهد الابتكار العالمي</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white text-lg px-12"
          >
            اشترك في الدورة الآن
            <ArrowRight className="mr-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      <AppverseFooter />
    </div>
  )
}
