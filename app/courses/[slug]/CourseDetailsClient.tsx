"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  ArrowRight,
  Clock,
  Users,
  Award,
  BookOpen,
  CheckCircle2,
  PlayCircle,
  FileText,
  ChevronDown,
  ChevronUp,
  Globe,
  BarChart3,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { SiteHeader } from "@/components/site-header"
import { AppverseFooter } from "@/components/appverse-footer"
import { useLanguage } from "@/lib/language-context"
import { useAuth } from "@/lib/auth-context"
import type { Course } from "@/lib/learnworld-types"

interface CourseDetailsClientProps {
  course: Course
}

export default function CourseDetailsClient({ course }: CourseDetailsClientProps) {
  const { language } = useLanguage()
  const isArabic = language === "ar"
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [expandedSections, setExpandedSections] = useState<string[]>([])

  const handleEnroll = () => {
    if (!isAuthenticated) {
      router.push(`/auth/login?redirect=/checkout?type=course&id=${course.id}`)
    } else {
      router.push(`/checkout?type=course&id=${course.id}`)
    }
  }

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  const formatPrice = (price: typeof course.price) => {
    if (price.amount === 0) return isArabic ? "مجاني" : "Free"
    return `${price.currency} ${price.amount.toFixed(2)}`
  }

  const getLevelText = (level: Course["level"]) => {
    const levels = {
      beginner: { ar: "مبتدئ", en: "Beginner" },
      intermediate: { ar: "متوسط", en: "Intermediate" },
      advanced: { ar: "متقدم", en: "Advanced" },
      all: { ar: "جميع المستويات", en: "All Levels" },
    }
    return isArabic ? levels[level].ar : levels[level].en
  }

  const content = isArabic
    ? {
        enrollNow: "اشترك الآن",
        overview: "نظرة عامة",
        curriculum: "المنهاج",
        instructor: "المدرب",
        reviews: "التقييمات",
        whatYouLearn: "ماذا ستتعلم",
        targetAudience: "الفئة المستهدفة",
        requirements: "المتطلبات",
        duration: "المدة",
        lessons: "درس",
        quizzes: "اختبار",
        level: "المستوى",
        language: "اللغة",
        certificate: "شهادة معتمدة",
        includes: "تشمل الدورة",
        lifetime: "وصول مدى الحياة",
        mobile: "الوصول عبر الجوال",
        resources: "موارد قابلة للتحميل",
        noDescription: "لا يوجد وصف متاح",
        noCurriculum: "المنهاج قيد الإعداد",
        noGoals: "سيتم تحديث أهداف الدورة قريباً",
        noAudience: "هذه الدورة مناسبة للجميع",
        noRequirements: "لا توجد متطلبات مسبقة",
        freeLesson: "درس مجاني",
      }
    : {
        enrollNow: "Enroll Now",
        overview: "Overview",
        curriculum: "Curriculum",
        instructor: "Instructor",
        reviews: "Reviews",
        whatYouLearn: "What You'll Learn",
        targetAudience: "Target Audience",
        requirements: "Requirements",
        duration: "Duration",
        lessons: "lessons",
        quizzes: "quizzes",
        level: "Level",
        language: "Language",
        certificate: "Certified Certificate",
        includes: "Course Includes",
        lifetime: "Lifetime Access",
        mobile: "Mobile Access",
        resources: "Downloadable Resources",
        noDescription: "No description available",
        noCurriculum: "Curriculum coming soon",
        noGoals: "Course goals will be updated soon",
        noAudience: "This course is suitable for everyone",
        noRequirements: "No prerequisites required",
        freeLesson: "Free Preview",
      }

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-[#0A0014] via-[#1a0533] to-[#0A0014]"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <SiteHeader />

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="relative py-16 px-4 overflow-hidden">
          <div className="container mx-auto max-w-7xl">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Categories */}
                {course.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {course.categories.map((cat) => (
                      <Badge
                        key={cat}
                        variant="secondary"
                        className="bg-purple-600/20 text-purple-300"
                      >
                        {cat}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Title */}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight"
                >
                  {course.title}
                </motion.h1>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-lg text-gray-300 leading-relaxed"
                >
                  {course.description || content.noDescription}
                </motion.p>

                {/* Meta Info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-wrap items-center gap-6 text-gray-400"
                >
                  <div className="flex items-center gap-2">
                    <Clock size={18} />
                    <span>{course.durationFormatted}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen size={18} />
                    <span>
                      {course.totalLessons} {content.lessons}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BarChart3 size={18} />
                    <span>{getLevelText(course.level)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe size={18} />
                    <span>{course.language === "ar" ? "العربية" : "English"}</span>
                  </div>
                  {course.certificateEnabled && (
                    <div className="flex items-center gap-2">
                      <Award size={18} className="text-yellow-400" />
                      <span>{content.certificate}</span>
                    </div>
                  )}
                </motion.div>

                {/* Instructor */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center overflow-hidden">
                    {course.instructor.avatar ? (
                      <Image
                        src={course.instructor.avatar || "/placeholder.svg"}
                        alt={course.instructor.name}
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    ) : (
                      <Users size={24} className="text-white" />
                    )}
                  </div>
                  <div>
                    <p className="text-white font-semibold">
                      {course.instructor.name}
                    </p>
                    {course.instructor.bio && (
                      <p className="text-gray-400 text-sm line-clamp-1">
                        {course.instructor.bio}
                      </p>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Sidebar - Pricing Card */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="sticky top-24"
                >
                  <Card className="bg-gradient-to-br from-[#1a0533] to-[#0A0014] border-purple-600/30 overflow-hidden">
                    {/* Course Image */}
                    <div className="relative aspect-video">
                      <Image
                        src={course.image || "/placeholder.svg"}
                        alt={course.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                          <PlayCircle size={40} className="text-white" />
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-6 space-y-6">
                      {/* Price */}
                      <div className="flex items-end gap-3">
                        <span className="text-4xl font-bold text-white">
                          {formatPrice(course.price)}
                        </span>
                        {course.price.originalAmount &&
                          course.price.originalAmount > course.price.amount && (
                            <>
                              <span className="text-xl text-gray-500 line-through">
                                {course.price.currency}{" "}
                                {course.price.originalAmount.toFixed(2)}
                              </span>
                              <Badge className="bg-green-500 text-white">
                                -{course.price.discount}%
                              </Badge>
                            </>
                          )}
                      </div>

                      {/* Enroll Button */}
                      <Button
                        size="lg"
                        className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white h-14 text-lg"
                        onClick={handleEnroll}
                      >
                        {content.enrollNow}
                        <ArrowRight
                          className={`h-5 w-5 ${isArabic ? "mr-2 rotate-180" : "ml-2"}`}
                        />
                      </Button>

                      {/* Course Includes */}
                      <div className="space-y-4 pt-4 border-t border-purple-600/20">
                        <h4 className="font-semibold text-white">
                          {content.includes}
                        </h4>
                        <ul className={`space-y-3 text-gray-300 ${isArabic ? "custom-list-rtl" : "custom-list-ltr"}`}>
                          <li className="list-item-check">
                            <PlayCircle size={18} className="text-purple-400 flex-shrink-0" />
                            <span>
                              {course.totalLessons} {content.lessons}
                            </span>
                          </li>
                          {course.totalQuizzes > 0 && (
                            <li className="list-item-check">
                              <FileText size={18} className="text-purple-400 flex-shrink-0" />
                              <span>
                                {course.totalQuizzes} {content.quizzes}
                              </span>
                            </li>
                          )}
                          <li className="list-item-check">
                            <Clock size={18} className="text-purple-400 flex-shrink-0" />
                            <span>{content.lifetime}</span>
                          </li>
                          {course.certificateEnabled && (
                            <li className="list-item-check">
                              <Award size={18} className="text-purple-400 flex-shrink-0" />
                              <span>{content.certificate}</span>
                            </li>
                          )}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Tabs Section */}
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-7xl">
            <Tabs defaultValue="overview" className="space-y-8">
              <TabsList className="bg-[#1a0533]/50 border border-purple-600/20 p-1 w-full md:w-auto flex flex-wrap">
                <TabsTrigger
                  value="overview"
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                >
                  {content.overview}
                </TabsTrigger>
                <TabsTrigger
                  value="curriculum"
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                >
                  {content.curriculum}
                </TabsTrigger>
                <TabsTrigger
                  value="instructor"
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                >
                  {content.instructor}
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-8">
                {/* Full Description */}
                {course.fullDescription && (
                  <Card className="bg-gradient-to-br from-[#1a0533] to-[#0A0014] border-purple-600/30">
                    <CardHeader>
                      <CardTitle className="text-white text-2xl">
                        {content.overview}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div
                        className="text-gray-300 leading-relaxed prose prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: course.fullDescription }}
                      />
                    </CardContent>
                  </Card>
                )}

                {/* What You'll Learn */}
                <Card className="bg-gradient-to-br from-[#1a0533] to-[#0A0014] border-purple-600/30">
                  <CardHeader>
                    <CardTitle className="text-white text-2xl">
                      {content.whatYouLearn}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {course.goals && course.goals.length > 0 ? (
                      <ul className={`grid-list ${isArabic ? "custom-list-rtl" : "custom-list-ltr"}`}>
                        {course.goals.map((goal, index) => (
                          <li key={index} className="list-item-check">
                            <CheckCircle2
                              size={20}
                              className="text-green-500 flex-shrink-0"
                            />
                            <span className="text-gray-300">{goal}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-400">{content.noGoals}</p>
                    )}
                  </CardContent>
                </Card>

                {/* Target Audience */}
                <Card className="bg-gradient-to-br from-[#1a0533] to-[#0A0014] border-purple-600/30">
                  <CardHeader>
                    <CardTitle className="text-white text-2xl">
                      {content.targetAudience}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {course.targetAudience && course.targetAudience.length > 0 ? (
                      <ul className={`space-y-3 ${isArabic ? "custom-list-rtl" : "custom-list-ltr"}`}>
                        {course.targetAudience.map((audience, index) => (
                          <li key={index} className="list-item-check text-gray-300">
                            <Users
                              size={18}
                              className="text-purple-400 flex-shrink-0"
                            />
                            <span>{audience}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-400">{content.noAudience}</p>
                    )}
                  </CardContent>
                </Card>

                {/* Requirements */}
                <Card className="bg-gradient-to-br from-[#1a0533] to-[#0A0014] border-purple-600/30">
                  <CardHeader>
                    <CardTitle className="text-white text-2xl">
                      {content.requirements}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {course.requirements && course.requirements.length > 0 ? (
                      <ul className={`space-y-3 ${isArabic ? "custom-list-rtl" : "custom-list-ltr"}`}>
                        {course.requirements.map((req, index) => (
                          <li key={index} className="list-item-check text-gray-300">
                            <CheckCircle2
                              size={18}
                              className="text-purple-400 flex-shrink-0"
                            />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-400">{content.noRequirements}</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Curriculum Tab */}
              <TabsContent value="curriculum">
                <Card className="bg-gradient-to-br from-[#1a0533] to-[#0A0014] border-purple-600/30">
                  <CardHeader>
                    <CardTitle className="text-white text-2xl flex items-center justify-between">
                      <span>{content.curriculum}</span>
                      <span className="text-sm font-normal text-gray-400">
                        {course.totalLessons} {content.lessons} •{" "}
                        {course.durationFormatted}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {course.curriculum.length > 0 ? (
                      <Accordion
                        type="multiple"
                        value={expandedSections}
                        onValueChange={setExpandedSections}
                        className="space-y-4"
                      >
                        {course.curriculum.map((section, sectionIndex) => (
                          <AccordionItem
                            key={section.id}
                            value={section.id}
                            className="border border-purple-600/20 rounded-lg overflow-hidden"
                          >
                            <AccordionTrigger className="px-6 py-4 hover:bg-purple-600/10 text-white">
                              <div className="flex items-center gap-4">
                                <span className="w-8 h-8 rounded-full bg-purple-600/30 flex items-center justify-center text-sm">
                                  {sectionIndex + 1}
                                </span>
                                <div className="text-right">
                                  <p className="font-semibold">{section.title}</p>
                                  <p className="text-sm text-gray-400">
                                    {section.lessons.length} {content.lessons}
                                  </p>
                                </div>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-6 pb-4">
                              <ul className="space-y-2">
                                {section.lessons.map((lesson, lessonIndex) => (
                                  <li
                                    key={lesson.id}
                                    className="flex items-center justify-between p-3 rounded-lg bg-purple-600/10 hover:bg-purple-600/20 transition-colors"
                                  >
                                    <div className="flex items-center gap-3">
                                      <PlayCircle
                                        size={18}
                                        className="text-purple-400"
                                      />
                                      <span className="text-gray-300">
                                        {lesson.title}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-400">
                                      {lesson.duration > 0 && (
                                        <span>{lesson.duration} min</span>
                                      )}
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    ) : (
                      <p className="text-gray-400 text-center py-8">
                        {content.noCurriculum}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Instructor Tab */}
              <TabsContent value="instructor">
                <Card className="bg-gradient-to-br from-[#1a0533] to-[#0A0014] border-purple-600/30">
                  <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {course.instructor.avatar ? (
                          <Image
                            src={course.instructor.avatar || "/placeholder.svg"}
                            alt={course.instructor.name}
                            width={128}
                            height={128}
                            className="object-cover"
                          />
                        ) : (
                          <Users size={64} className="text-white" />
                        )}
                      </div>
                      <div className="text-center md:text-right flex-1">
                        <h3 className="text-2xl font-bold text-white mb-2">
                          {course.instructor.name}
                        </h3>
                        {course.instructor.credentials &&
                          course.instructor.credentials.length > 0 && (
                            <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                              {course.instructor.credentials.map((cred, i) => (
                                <Badge
                                  key={i}
                                  variant="secondary"
                                  className="bg-purple-600/20 text-purple-300"
                                >
                                  {cred}
                                </Badge>
                              ))}
                            </div>
                          )}
                        {course.instructor.bio && (
                          <p className="text-gray-300 leading-relaxed">
                            {course.instructor.bio}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              {isArabic ? "ابدأ رحلتك التعليمية الآن" : "Start Your Learning Journey Now"}
            </h2>
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white text-lg px-12 h-14"
              onClick={handleEnroll}
            >
              {content.enrollNow}
              <ArrowRight
                className={`h-5 w-5 ${isArabic ? "mr-2 rotate-180" : "ml-2"}`}
              />
            </Button>
          </div>
        </section>
      </main>

      <AppverseFooter />
    </div>
  )
}
