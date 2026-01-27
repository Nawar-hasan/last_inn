"use client"

import { SiteHeader } from "@/components/site-header"
import { Lightbulb, Target, Eye, CheckCircle2, Users, Sparkles } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export default function AboutPage() {
  const { language } = useLanguage()
  const isArabic = language === "ar"
  const goals = [
    {
      ar: "غرس ثقافة الابتكار والتفكير الحر في التعليم والعمل والحياة اليومية",
      en: "Instilling a culture of innovation and free thinking in education, work, and daily life"
    },
    {
      ar: "ربط المبدعين ببعضهم وبناء شبكات دعم وتعاون قوية",
      en: "Connecting creators with each other and building strong support and collaboration networks"
    },
    {
      ar: "تقديم برامج تدريبية عميقة وتفاعلية تركّز على التطبيق العملي",
      en: "Providing deep and interactive training programs focused on practical application"
    },
    {
      ar: "تحفيز التفكير النقدي والقدرة على تحليل التحديات بطرق غير تقليدية",
      en: "Stimulating critical thinking and the ability to analyze challenges in unconventional ways"
    },
    {
      ar: "نشر قصص النجاح ونقل الخبرات التي تُلهِم وتُحفّز",
      en: "Spreading success stories and sharing experiences that inspire and motivate"
    },
    {
      ar: "تمكين كل شخص من تحويل فكرته إلى مشروع أو مبادرة ذات أثر",
      en: "Empowering everyone to turn their idea into a project or initiative with impact"
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#551FBD] to-[#7C3AED] mb-6 animate-pulse">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
          <h1
            className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight"
            style={{ fontFamily: "var(--font-rubik)" }}
          >
            {isArabic ? "من نحن" : "About Us"}
          </h1>
          <p
            className="text-2xl md:text-3xl text-gray-700 dark:text-white max-w-4xl mx-auto leading-relaxed font-medium"
            style={{ fontFamily: "var(--font-rubik)" }}
          >
            {isArabic ? "في قلب كل إنسان فكرة... وفي كل فكرة بداية لقصة عظيمة." : "In the heart of every person is an idea... and in every idea is the beginning of a great story."}
          </p>
        </div>

        {/* Who We Are */}
        <section className="mb-20" dir={isArabic ? "rtl" : "ltr"}>
          <div className="liquid-glass-enhanced rounded-3xl p-8 md:p-12">
            <div className={`flex items-start gap-4 mb-6 ${isArabic ? "flex-row" : "flex-row"}`}>
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-[#551FBD] to-[#7C3AED] flex-shrink-0">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h2
                className={`text-3xl md:text-4xl font-bold text-gray-900 dark:text-white ${isArabic ? "text-right" : "text-left"}`}
                style={{ fontFamily: "var(--font-rubik)" }}
              >
                {isArabic ? "من نحن" : "Who We Are"}
              </h2>
            </div>
            <p
              className={`text-xl text-gray-700 dark:text-white leading-relaxed ${isArabic ? "text-right" : "text-left"}`}
              style={{ fontFamily: "var(--font-rubik)" }}
            >
              {isArabic 
                ? "نحن في Innovologia نؤمن أن الابتكار ليس رفاهية، بل مهارة ضرورية في هذا العصر المتغير. نحن مجتمع من الحالمين والمبدعين، نصنع الفُرص ونُعيد تعريف الممكن. هدفنا أن نُشعل شرارة الإبداع في داخلك، ونرافقك من الفكرة حتى الإنجاز."
                : "At Innovologia, we believe that innovation is not a luxury, but an essential skill in this changing era. We are a community of dreamers and creators, creating opportunities and redefining what's possible. Our goal is to ignite the spark of creativity within you, and accompany you from idea to achievement."}
            </p>
          </div>
        </section>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-20" dir={isArabic ? "rtl" : "ltr"}>
          {/* Mission */}
          <div className="liquid-glass-enhanced rounded-3xl p-8 md:p-10 hover:shadow-2xl hover:shadow-violet-500/20 transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-[#551FBD] to-[#7C3AED]">
                <Target className="h-7 w-7 text-white" />
              </div>
              <h2
                className={`text-3xl font-bold text-gray-900 dark:text-white ${isArabic ? "text-right" : "text-left"}`}
                style={{ fontFamily: "var(--font-rubik)" }}
              >
                {isArabic ? "رسالتنا" : "Our Mission"}
              </h2>
            </div>
            <p
              className={`text-lg text-gray-700 dark:text-white leading-relaxed ${isArabic ? "text-right" : "text-left"}`}
              style={{ fontFamily: "var(--font-rubik)" }}
            >
              {isArabic 
                ? "أن نكون الشرارة التي توقظ الإبداع بداخلك. نمنحك الأدوات، البيئة، والمحتوى الذي يحرّك فيك الشغف ويكسر القيود التقليدية. لأننا نؤمن أن الفكرة الواحدة قد تغيّر العالم... إذا وُضعت في المكان الصحيح."
                : "To be the spark that awakens creativity within you. We give you the tools, environment, and content that ignites passion and breaks traditional constraints. Because we believe one idea can change the world... if placed in the right place."}
            </p>
          </div>

          {/* Vision */}
          <div className="liquid-glass-enhanced rounded-3xl p-8 md:p-10 hover:shadow-2xl hover:shadow-violet-500/20 transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-[#551FBD] to-[#7C3AED]">
                <Eye className="h-7 w-7 text-white" />
              </div>
              <h2
                className={`text-3xl font-bold text-gray-900 dark:text-white ${isArabic ? "text-right" : "text-left"}`}
                style={{ fontFamily: "var(--font-rubik)" }}
              >
                {isArabic ? "رؤيتنا" : "Our Vision"}
              </h2>
            </div>
            <p
              className={`text-lg text-gray-700 dark:text-white leading-relaxed ${isArabic ? "text-right" : "text-left"}`}
              style={{ fontFamily: "var(--font-rubik)" }}
            >
              {isArabic 
                ? "أن نكون الوجهة الأولى لكل من يسعى للتفكير المختلف وصناعة التغيير. نطمح إلى بناء مجتمع عربي يقود المستقبل، لا يتبعه. يصنع التغيير، لا ينتظره."
                : "To be the first destination for everyone seeking different thinking and making change. We aspire to build an Arab community that leads the future, not follows it. Makes change, doesn't wait for it."}
            </p>
          </div>
        </div>

        {/* Goals */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#551FBD] to-[#7C3AED] mb-6">
              <Lightbulb className="h-8 w-8 text-white" />
            </div>
            <h2
              className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4"
              style={{ fontFamily: "var(--font-rubik)" }}
            >
              {isArabic ? "أهدافنا" : "Our Goals"}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6" dir={isArabic ? "rtl" : "ltr"}>
            {goals.map((goal, index) => (
              <div
                key={index}
                className="liquid-glass-enhanced rounded-2xl p-6 hover:shadow-xl hover:shadow-violet-500/20 transition-all duration-300 hover:scale-[1.02]"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <div className={`flex items-start gap-4 ${isArabic ? "flex-row" : "flex-row"}`}>
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-[#551FBD]/20 to-[#7C3AED]/20 flex-shrink-0 mt-1">
                    <CheckCircle2 className="h-5 w-5 text-[#551FBD] dark:text-[#53FBA1]" />
                  </div>
                  <p
                    className={`text-lg text-gray-700 dark:text-white leading-relaxed ${isArabic ? "text-right" : "text-left"}`}
                    style={{ fontFamily: "var(--font-rubik)" }}
                  >
                    {isArabic ? goal.ar : goal.en}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="text-center liquid-glass-enhanced rounded-3xl p-12 md:p-16">
          <h2
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6"
            style={{ fontFamily: "var(--font-rubik)" }}
          >
            {isArabic ? "هل أنت مستعد لبدء رحلتك في عالم الابتكار؟" : "Are you ready to start your journey in the world of innovation?"}
          </h2>
          <p
            className="text-xl text-gray-700 dark:text-white mb-8 max-w-2xl mx-auto"
            style={{ fontFamily: "var(--font-rubik)" }}
          >
            {isArabic ? "انضم إلى مجتمعنا اليوم وابدأ رحلة التحول من الفكرة إلى الإنجاز" : "Join our community today and start the journey from idea to achievement"}
          </p>
          <a
            href="https://hub.innovologia.com/communities/groups/free/home"
            className="inline-block px-10 py-5 bg-gradient-to-r from-[#551FBD] to-[#7C3AED] text-white font-bold rounded-full text-lg
                       hover:shadow-[0_0_40px_rgba(85,31,189,0.6)] hover:scale-105 transition-all duration-300"
            style={{ fontFamily: "var(--font-rubik)" }}
          >
            {isArabic ? "الدخول إلى المجتمع" : "Join the Community"}
          </a>
        </div>
      </main>
    </div>
  )
}
