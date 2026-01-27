"use client"

import { SiteHeader } from "@/components/site-header"
import { AppverseFooter } from "@/components/appverse-footer"
import { useLanguage } from "@/lib/language-context"
import { Shield, FileText, Lock, AlertTriangle, Info, Mail } from "lucide-react"

export default function TermsPage() {
  const { language } = useLanguage()
  const isArabic = language === "ar"

  const sections = [
    {
      icon: Info,
      title: isArabic ? "المقدمة" : "Introduction",
      content: isArabic
        ? "مرحباً بك في Innovologia. من خلال الوصول إلى موقعنا الإلكتروني، فإنك توافق على هذه الشروط والأحكام. يرجى قراءتها بعناية."
        : "Welcome to Innovologia. By accessing our website, you agree to these terms and conditions. Please read them carefully.",
    },
    {
      icon: Shield,
      title: isArabic ? "حقوق الملكية الفكرية" : "Intellectual Property Rights",
      content: isArabic
        ? "ما لم يُذكر خلاف ذلك، تمتلك Innovologia جميع حقوق الملكية الفكرية للموقع ومحتواه. وهذا يشمل جميع الملفات الإلكترونية والرسومات والمواد المقدمة، والتي تبقى ملكاً حصرياً لـ Innovologia."
        : "Unless otherwise stated, Innovologia owns all intellectual property rights for the website and its content. This includes all electronic files, drawings, and materials provided, which remain the sole property of Innovologia.",
    },
    {
      icon: FileText,
      title: isArabic ? "الاستخدام المقبول" : "Acceptable Use",
      content: isArabic
        ? "يجب عدم استخدام هذا الموقع بأي طريقة قد تسبب ضرراً للموقع أو تضعف إمكانية الوصول إليه أو توافره."
        : "You must not use this website in any way that causes, or may cause, damage to the website or impairment of its availability or accessibility.",
    },
    {
      icon: AlertTriangle,
      title: isArabic ? "تحديد المسؤولية" : "Limitation of Liability",
      content: isArabic
        ? "لن تكون Innovologia مسؤولة عن أي خسارة أو ضرر مباشر أو غير مباشر أو تبعي ينشأ بموجب هذه الشروط أو فيما يتعلق بموقعنا أو خدماتنا."
        : "Innovologia will not be liable for any direct, indirect, or consequential loss or damage arising under these Terms or in connection with our website or services.",
    },
    {
      icon: Lock,
      title: isArabic ? "التغييرات على الشروط" : "Changes to These Terms",
      content: isArabic
        ? "قد نقوم بمراجعة هذه الشروط من وقت لآخر. ستطبق الشروط المعدلة من تاريخ نشرها على هذا الموقع."
        : "We may revise these Terms from time to time. The revised Terms will apply from the date of publication on this site.",
    },
    {
      icon: Mail,
      title: isArabic ? "اتصل بنا" : "Contact Us",
      content: isArabic
        ? "إذا كانت لديك أي أسئلة حول هذه الشروط، يرجى الاتصال بنا على: info@innovologia.com"
        : "If you have any questions about these Terms, please contact us at: info@innovologia.com",
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
              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#551FBD] to-[#7B3FDD] bg-clip-text text-transparent">
                {isArabic ? "الشروط والأحكام" : "Terms and Conditions"}
              </h1>
              <p className="text-foreground/70 text-lg">
                {isArabic
                  ? "يرجى قراءة هذه الشروط بعناية قبل استخدام خدماتنا"
                  : "Please read these terms carefully before using our services"}
              </p>
            </div>

            {/* Sections */}
            <div className="space-y-6">
              {sections.map((section, index) => {
                const Icon = section.icon
                return (
                  <div
                    key={index}
                    className="glass-border-enhanced p-8 rounded-xl hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-gradient-to-br from-[#551FBD] to-[#7B3FDD] rounded-lg flex-shrink-0">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold mb-3">{section.title}</h2>
                        <p className="text-foreground/80 leading-relaxed">{section.content}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Last Updated */}
            <div className="mt-12 text-center text-sm text-foreground/60">
              {isArabic ? "آخر تحديث: ديسمبر 2024" : "Last Updated: December 2024"}
            </div>
          </div>
        </div>
      </div>

      <AppverseFooter />
    </div>
  )
}
