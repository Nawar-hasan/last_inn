"use client"

import { Lightbulb, Award, Trophy, Clock, Target, Users } from "lucide-react"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { useLanguage } from "@/lib/language-context"

const servicesArabic = [
  {
    id: 1,
    title: "هاكاثونات متكاملة",
    description: "تصميم وتشغيل هاكاثونات ابتكار عالية الأثر، حضوريًا أو عن بُعد",
    icon: Lightbulb,
    image: "/innovation-culture-workshop-team-brainstorming-cre.jpg",
    color: "from-purple-500 to-violet-500",
    highlights: [
      "تصميم تجربة الهاكاثون من الفكرة حتى التتويج",
      "إدارة متكاملة للهاكاثونات",
      "تحكيم رقمي وتقارير تفصيلية لنتائج الفرق",
      "تقييم منهجي للأفكار المبتكرة ومخرجات الفرق",
    ],
  },
  {
    id: 2,
    title: "تحديد التحديات",
    description: "تحويل الأهداف الاستراتيجية إلى تحديات ابتكارية قابلة للتنفيذ داخل المنظومة",
    icon: Award,
    image: "/professional-certificates-badges-achievement-award.jpg",
    color: "from-violet-500 to-purple-600",
    highlights: [
      "تحليل الوضع الحالي وتحديد أولويات الابتكار",
      "عقد جلسات تحديات قائمة على منهجية التفكير التصميمي مع فرق العمل",
      "صياغة تحديات واضحة لبرامج الهاكاثون والمشاريع منسجمة مع استراتيجية المنظمة",
      "وضع خريطة طريق عملية لتنفيذ الحلول الناتجة عن هذه التحديات",
    ],
  },
  {
    id: 3,
    title: "حلول مبتكرة",
    description: "مساعدة المنظمات على إيجاد حلول ابتكارية تعزز رؤيتها وتدعم أهدافها الاستراتيجية",
    icon: Trophy,
    image: "/hackathon-coding-competition-team-collaboration-te.jpg",
    color: "from-purple-600 to-violet-600",
    highlights: [
      "توليد أفكار وحلول جديدة مبنية على التحديات الاستراتيجية القائمة",
      "تيسير جلسات عمل تركّز على تحويل الأفكار إلى تصوّرات وحلول عملية",
      "مواءمة الحلول المقترحة مع أولويات المنظمة ومسارها الاستراتيجي",
    ],
  },
  {
    id: 4,
    title: "الشهادات الاحترافية في الابتكار",
    description: "GInI مسارات تدريب متكاملة للحصول على شهادات",
    icon: Clock,
    image: "/brainstorming-session-creative-meeting-sticky-note.jpg",
    color: "from-violet-600 to-purple-700",
    highlights: [
      "محترف الابتكار المعتمد CInP",
      "محترف التفكير التصميمي المعتمد CDTP",
      "استراتيجي الابتكار المعتمد CInS",
      "الرئيس التنفيذي للابتكار المعتمد CCInO",
      "مقيم الابتكار المعتمد AInA",
    ],
  },
  {
    id: 5,
    title: "التدريب المؤسسي",
    description: "برامج تدريب مخصصة لتطوير القيادات والفرق وفق احتياجاتك",
    icon: Target,
    image: "/strategic-planning-target-goals-business-objective.jpg",
    color: "from-purple-500 to-violet-500",
    highlights: [
      "تصميم محتوى تدريبي يتوافق مع سياق المنظمة",
      "ورش عمل تطبيقية للفرق والقيادات",
      "قياس أثر التدريب وربطه بأهداف العمل",
    ],
  },
  {
    id: 6,
    title: "تقييم النضوج المؤسسي",
    description: "قياس مستوى نضوج الابتكار في المنظمات والأفراد باستخدام برامج ومعايير عالمية معترف بها",
    icon: Users,
    image: "/corporate-training-team-development-professional-w.jpg",
    color: "from-violet-500 to-purple-600",
    highlights: [
      "إجراء تقييم نضوج الابتكار وفق أطر ومؤشرات دولية",
      "تحليل الفجوة بين الوضع الحالي وما تطمح إليه المنظمة في مسار الابتكار",
      "تقديم توصيات عملية تساعد في ردم الفجوة وتحسين الأداء الابتكاري",
      "تمكين المنظمات من الحصول على الاعتمادات العالمية في الابتكار ورفع جاهزيتها المستقبلية",
    ],
  },
]

const servicesEnglish = [
  {
    id: 1,
    title: "Integrated Hackathons",
    description: "Designing and running high-impact innovation hackathons, either in-person or remotely",
    icon: Lightbulb,
    image: "/innovation-culture-workshop-team-brainstorming-cre.jpg",
    color: "from-purple-500 to-violet-500",
    highlights: [
      "Designing the hackathon experience from concept to crowning",
      "Integrated hackathon management",
      "Digital judging and detailed reports on team results",
      "Systematic evaluation of innovative ideas and team outputs",
    ],
  },
  {
    id: 2,
    title: "Identifying Challenges",
    description: "Transforming strategic goals into actionable innovative challenges within the ecosystem",
    icon: Award,
    image: "/professional-certificates-badges-achievement-award.jpg",
    color: "from-violet-500 to-purple-600",
    highlights: [
      "Analyzing current situation and identifying innovation priorities",
      "Conducting challenge sessions based on design thinking methodology with work teams",
      "Formulating clear challenges for hackathons and projects aligned with organizational strategy",
      "Developing practical roadmap for implementing solutions from these challenges",
    ],
  },
  {
    id: 3,
    title: "Innovative Solutions",
    description:
      "Helping organizations find innovative solutions that enhance their vision and support their strategic goals",
    icon: Trophy,
    image: "/hackathon-coding-competition-team-collaboration-te.jpg",
    color: "from-purple-600 to-violet-600",
    highlights: [
      "Generating new ideas and solutions based on existing strategic challenges",
      "Facilitating workshops focused on transforming ideas into practical concepts and solutions",
      "Aligning proposed solutions with organizational priorities and strategic path",
    ],
  },
  {
    id: 4,
    title: "Professional Innovation Certifications",
    description: "Integrated training paths to obtain GInI certifications",
    icon: Clock,
    image: "/brainstorming-session-creative-meeting-sticky-note.jpg",
    color: "from-violet-600 to-purple-700",
    highlights: [
      "Certified Innovation Professional CInP",
      "Certified Design Thinking Professional CDTP",
      "Certified Innovation Strategist CInS",
      "Certified Chief Innovation Officer CCInO",
      "Accredited Innovation Assessor AInA",
    ],
  },
  {
    id: 5,
    title: "Institutional Training",
    description: "Customized training programs to develop leaders and teams according to your needs",
    icon: Target,
    image: "/strategic-planning-target-goals-business-objective.jpg",
    color: "from-purple-500 to-violet-500",
    highlights: [
      "Designing training content that aligns with organizational context",
      "Practical workshops for teams and leaders",
      "Measuring training impact and linking it to business goals",
    ],
  },
  {
    id: 6,
    title: "Institutional Maturity Assessment",
    description:
      "Measuring the level of innovation maturity in organizations and individuals using globally recognized programs and standards",
    icon: Users,
    image: "/corporate-training-team-development-professional-w.jpg",
    color: "from-violet-500 to-purple-600",
    highlights: [
      "Conducting innovation maturity assessment according to international frameworks and indicators",
      "Analyzing the gap between current state and organizational innovation aspirations",
      "Providing practical recommendations to bridge the gap and improve innovation performance",
      "Enabling organizations to obtain global innovation accreditations and enhance future readiness",
    ],
  },
]

export function Services() {
  const { language } = useLanguage()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const isArabic = language === "ar"

  const services = language === "ar" ? servicesArabic : servicesEnglish
  const titleAr = "خدماتنا"
  const titleEn = "Our Services"
  const subtitleAr = "حلول متكاملة لتحويل الأفكار إلى واقع ملموس"
  const subtitleEn = "Integrated solutions to turn ideas into tangible reality"

  return (
  <section id="services" ref={ref} className="py-20 sm:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 dark:via-purple-500/10 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 text-gray-900 dark:text-white">
            <span className="bg-gradient-to-r from-purple-600 via-violet-500 to-purple-600 bg-clip-text text-transparent">
              {language === "ar" ? titleAr : titleEn}
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-700 dark:text-white max-w-2xl mx-auto">
            {language === "ar" ? subtitleAr : subtitleEn}
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className="relative h-full rounded-2xl overflow-hidden liquid-glass-enhanced border border-border/50 hover:border-purple-500/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 flex flex-col">
                  {/* Service Image Header */}
                  <div className="relative h-48 overflow-hidden">
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-60 group-hover:opacity-80 transition-opacity duration-500`}
                    />
                    <img
                      src={service.image || "/placeholder.svg"}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />

                    {/* Floating Icon */}
                    <motion.div
                      animate={{
                        y: [0, -10, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }}
                      className="absolute top-4 right-4 w-14 h-14 rounded-xl bg-white/20 dark:bg-black/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-lg"
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </motion.div>
                  </div>

                  <div className="p-6 space-y-4 flex flex-col flex-1">
                    <h3
                      className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300"
                      dir={language === "ar" ? "rtl" : "ltr"}
                      style={{ fontFamily: "var(--font-rubik)" }}
                    >
                      {service.title}
                    </h3>
                    <p
                      className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm"
                      dir={language === "ar" ? "rtl" : "ltr"}
                      style={{ fontFamily: "var(--font-rubik)" }}
                    >
                      {service.description}
                    </p>

                    <div className="pt-4 border-t border-border/30 flex-1" dir={isArabic ? "rtl" : "ltr"}>
                      <ul className="space-y-2">
                        {service.highlights.map((highlight, idx) => (
                          <li 
                            key={idx} 
                            className={`flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300 ${isArabic ? "text-right" : "text-left"}`}
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                            <span style={{ fontFamily: "var(--font-rubik)" }}>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Shine Effect on Hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
