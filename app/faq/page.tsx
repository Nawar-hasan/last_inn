"use client"

import { SiteHeader } from "@/components/site-header"
import { AppverseFooter } from "@/components/appverse-footer"
import { useLanguage } from "@/lib/language-context"
import { HelpCircle, ChevronDown } from "lucide-react"
import { useState } from "react"

export default function FAQPage() {
  const { language } = useLanguage()
  const isArabic = language === "ar"

  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: isArabic ? "ما هي مدة الدورات التدريبية؟" : "How long are the courses?",
      answer: isArabic
        ? "تتراوح مدة الدورات من 20 إلى 40 ساعة تدريبية حسب نوع الدورة ومستواها. جميع الدورات متاحة للوصول الكامل عند التسجيل."
        : "Courses range from 20 to 40 training hours depending on the type and level. All courses are fully accessible upon registration.",
    },
    {
      question: isArabic ? "هل أحصل على شهادة معتمدة؟" : "Will I receive a certified certificate?",
      answer: isArabic
        ? "نعم، ستحصل على شهادة معتمدة من Innovologia بعد إكمال الدورة واجتياز الاختبارات بنجاح. الشهادة معترف بها دولياً."
        : "Yes, you will receive a certified certificate from Innovologia after completing the course and passing the exams. The certificate is internationally recognized.",
    },
    {
      question: isArabic ? "هل يمكنني الوصول للدورة بعد انتهائها؟" : "Can I access the course after completion?",
      answer: isArabic
        ? "نعم، لديك وصول مدى الحياة لجميع مواد الدورة بما في ذلك الفيديوهات والملفات والتحديثات المستقبلية."
        : "Yes, you have lifetime access to all course materials including videos, files, and future updates.",
    },
    {
      question: isArabic ? "ما هي طرق الدفع المتاحة؟" : "What payment methods are available?",
      answer: isArabic
        ? "نقبل الدفع عبر البطاقات الائتمانية (Visa, Mastercard)، التحويل البنكي، وبعض المحافظ الإلكترونية. يمكنك أيضاً الدفع بالتقسيط."
        : "We accept credit cards (Visa, Mastercard), bank transfer, and some e-wallets. You can also pay in installments.",
    },
    {
      question: isArabic ? "هل هناك دعم فني خلال الدورة؟" : "Is there technical support during the course?",
      answer: isArabic
        ? "نعم، فريقنا متاح على مدار الساعة للإجابة على استفساراتك التقنية والأكاديمية عبر المنصة أو WhatsApp."
        : "Yes, our team is available 24/7 to answer your technical and academic inquiries via the platform or WhatsApp.",
    },
    {
      question: isArabic ? "هل يمكنني استرداد المبلغ؟" : "Can I get a refund?",
      answer: isArabic
        ? "نعم، نقدم ضمان استرداد كامل خلال 14 يوم من تاريخ التسجيل إذا لم تكن راضياً عن الدورة."
        : "Yes, we offer a full refund within 14 days of registration if you are not satisfied with the course.",
    },
    {
      question: isArabic ? "هل الدورات باللغة العربية؟" : "Are the courses in Arabic?",
      answer: isArabic
        ? "نعم، جميع دوراتنا متاحة باللغة العربية الفصحى مع إمكانية الترجمة للإنجليزية. المحتوى مصمم خصيصاً للمتحدثين بالعربية."
        : "Yes, all our courses are available in Modern Standard Arabic with the option of English translation. The content is specifically designed for Arabic speakers.",
    },
    {
      question: isArabic ? "ما هي متطلبات التسجيل؟" : "What are the registration requirements?",
      answer: isArabic
        ? "لا توجد متطلبات مسبقة للتسجيل في معظم الدورات. فقط احتياجك للتعلم واتصال بالإنترنت. بعض الدورات المتقدمة قد تتطلب معرفة أساسية."
        : "There are no prerequisites for registration in most courses. Just your desire to learn and an internet connection. Some advanced courses may require basic knowledge.",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <div className="relative overflow-hidden">
        {/* Plasma Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#1a1a2e] to-[#0a0a0a]" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#551FBD] rounded-full blur-[128px] opacity-20 animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#7B3FDD] rounded-full blur-[128px] opacity-20 animate-pulse delay-1000" />
        </div>

        <div className="container mx-auto px-4 py-20" dir={isArabic ? "rtl" : "ltr"}>
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#551FBD] to-[#7B3FDD] mb-6">
                <HelpCircle className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#551FBD] to-[#7B3FDD] bg-clip-text text-transparent">
                {isArabic ? "الأسئلة الشائعة" : "Frequently Asked Questions"}
              </h1>
              <p className="text-foreground/70 text-lg">
                {isArabic ? "إجابات على الأسئلة الأكثر شيوعاً" : "Answers to the most common questions"}
              </p>
            </div>

            {/* FAQ Accordion */}
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="glass-border-enhanced rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="w-full p-6 flex items-center justify-between gap-4 text-left hover:bg-foreground/5 transition-colors"
                  >
                    <span className="font-bold text-lg flex-1">{faq.question}</span>
                    <ChevronDown
                      className={`w-6 h-6 text-[#551FBD] transition-transform flex-shrink-0 ${
                        openIndex === index ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openIndex === index && (
                    <div className="px-6 pb-6 pt-0">
                      <p className="text-foreground/80 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Contact CTA */}
            <div className="mt-12 text-center glass-border-enhanced p-8 rounded-xl">
              <h3 className="text-2xl font-bold mb-3">
                {isArabic ? "لم تجد إجابة لسؤالك؟" : "Didn't find an answer to your question?"}
              </h3>
              <p className="text-foreground/70 mb-6">
                {isArabic ? "تواصل معنا وسنكون سعداء بمساعدتك" : "Contact us and we'll be happy to help"}
              </p>
              <a
                href="mailto:info@innovologia.com"
                className="inline-block px-8 py-3 bg-gradient-to-r from-[#551FBD] to-[#7B3FDD] text-white font-bold rounded-full hover:shadow-lg transition-all"
              >
                {isArabic ? "تواصل معنا" : "Contact Us"}
              </a>
            </div>
          </div>
        </div>
      </div>

      <AppverseFooter />
    </div>
  )
}
