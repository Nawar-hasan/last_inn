"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/language-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2, Circle, PlayCircle, FileText, Clock, Users, Lock, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Course, Lesson } from "@/lib/learnworld-types"

interface CourseData {
  course: Course | null
  lessons: Lesson[]
  isLoading: boolean
  error: string | null
}

export default function CoursePlayerPage({ params }: { params: { id: string } }) {
  const { language } = useLanguage()
  const isArabic = language === "ar"
  const router = useRouter()
  const [selectedLesson, setSelectedLesson] = useState(0)
  const [completedLessons, setCompletedLessons] = useState<number[]>([])
  const [isEnrolled, setIsEnrolled] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [courseData, setCourseData] = useState<CourseData>({
    course: null,
    lessons: [],
    isLoading: true,
    error: null,
  })

  const lessons = courseData.lessons

  // جلب بيانات الدورة من LearnWorlds API
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        // جلب تفاصيل الدورة
        const courseResponse = await fetch(`/api/courses/${params.id}`)
        const courseResult = await courseResponse.json()

        if (!courseResult.success || !courseResult.course) {
          setCourseData({
            course: null,
            lessons: [],
            isLoading: false,
            error: isArabic ? "لم نتمكن من إيجاد الدورة" : "Course not found",
          })
          return
        }

        // جلب محتوى الدورة
        const contentsResponse = await fetch(`/api/courses/${params.id}/contents`)
        const contentsResult = await contentsResponse.json()

        // تحويل الأقسام إلى قائمة دروس مسطحة
        const allLessons: Lesson[] = []
        const sections = contentsResult.sections || contentsResult.contents || []
        
        for (const section of sections) {
          const units = section.learning_units || section.items || []
          for (const unit of units) {
            allLessons.push({
              id: unit.id,
              courseId: params.id,
              title: unit.title || unit.name || "درس",
              titleAr: unit.title || unit.name || "درس",
              description: unit.description || "",
              descriptionAr: unit.description || "",
              videoUrl: unit.video_url || unit.content_url || "",
              duration: unit.duration || 0,
              materials: (unit.resources || []).map((r: any) => ({
                id: r.id,
                title: r.title || r.name || "مادة",
                type: r.type || "resource",
                url: r.url || "#",
              })),
              order: allLessons.length,
            })
          }
        }

        setCourseData({
          course: courseResult.course,
          lessons: allLessons,
          isLoading: false,
          error: null,
        })
      } catch (error) {
        console.error("Failed to fetch course data:", error)
        setCourseData({
          course: null,
          lessons: [],
          isLoading: false,
          error: isArabic ? "حدث خطأ في تحميل الدورة" : "Error loading course",
        })
      }
    }

    fetchCourseData()
  }, [params.id, isArabic])

  // التحقق من التسجيل
  useEffect(() => {
    const checkEnrollment = async () => {
      try {
        const response = await fetch(`/api/courses/${params.id}/enrollment`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        const data = await response.json()
        setIsEnrolled(data.enrolled)
      } catch (error) {
        console.error("Failed to check enrollment:", error)
        setIsEnrolled(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkEnrollment()
  }, [params.id])

  // استخدام البيانات من API أو fallback
  const course = courseData.course || {
    id: params.id,
    title: "جاري التحميل...",
    description: "",
    instructor: { id: "", name: "المدرب", email: "", avatar: "", bio: "" },
    curriculum: [],
    totalLessons: 0,
    totalQuizzes: 0,
    duration: 0,
    durationFormatted: "",
    price: { amount: 0, currency: "USD" },
    accessType: "paid" as const,
    level: "all" as const,
    language: "ar",
    categories: [],
    slug: params.id,
    image: "/images/course-badge.jpg",
    certificateEnabled: true,
    published: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const currentLesson = lessons[selectedLesson] || {
    id: "",
    courseId: params.id,
    title: isArabic ? "جاري التحميل..." : "Loading...",
    titleAr: "جاري التحميل...",
    description: "",
    descriptionAr: "",
    videoUrl: "",
    duration: 0,
    materials: [],
    order: 0,
  }
  const progressPercent = lessons.length > 0 ? (completedLessons.length / lessons.length) * 100 : 0
  
  // عرض حالة التحميل
  if (courseData.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{isArabic ? "جاري تحميل الدورة..." : "Loading course..."}</p>
        </div>
      </div>
    )
  }

  // عرض حالة الخطأ
  if (courseData.error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="glass-border p-8 text-center max-w-md">
          <AlertCircle size={64} className="mx-auto mb-4 text-red-500" />
          <h2 className="text-2xl font-bold mb-4">{isArabic ? "خطأ" : "Error"}</h2>
          <p className="text-muted-foreground mb-6">{courseData.error}</p>
          <Button onClick={() => router.push("/courses")} className="cursor-pointer">
            {isArabic ? "العودة للدورات" : "Back to Courses"}
          </Button>
        </Card>
      </div>
    )
  }

  const canAccessLesson = (lessonIndex: number) => {
    if (lessonIndex === 0) return true
    return completedLessons.includes(lessonIndex - 1)
  }

  const handleLessonComplete = () => {
    if (!completedLessons.includes(selectedLesson)) {
      setCompletedLessons([...completedLessons, selectedLesson])
    }
  }

  const handleMaterialAccess = (materialUrl: string) => {
    if (!isEnrolled) {
      alert(isArabic ? "يجب التسجيل في الدورة للوصول إلى المواد" : "You must enroll in the course to access materials")
      return
    }
    window.open(materialUrl, "_blank")
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{isArabic ? "جاري التحميل..." : "Loading..."}</p>
        </div>
      </div>
    )
  }

  if (isEnrolled === false) {
    return (
      <div className="space-y-6">
        <div className="glass-border-enhanced p-6 rounded-xl">
          <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
        <p className="text-muted-foreground mb-4">
          {isArabic ? "بواسطة" : "By"} {typeof course.instructor === "object" ? course.instructor.name : course.instructor}
        </p>
        </div>

        <Alert className="border-amber-500/50 bg-amber-500/10">
          <AlertCircle className="h-5 w-5 text-amber-500" />
          <AlertDescription className="text-base">
            {isArabic
              ? "يجب عليك التسجيل في هذه الدورة للوصول إلى المحتوى والمواد التعليمية"
              : "You must enroll in this course to access the content and learning materials"}
          </AlertDescription>
        </Alert>

        <Card className="glass-border p-8 text-center">
          <Lock size={64} className="mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-4">{isArabic ? "المحتوى محمي" : "Content Protected"}</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            {isArabic
              ? "هذا المحتوى متاح فقط للطلاب المسجلين في الدورة. يرجى التسجيل للوصول إلى جميع الدروس والمواد."
              : "This content is only available to students enrolled in the course. Please enroll to access all lessons and materials."}
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => router.push(`/checkout?course=${params.id}`)} className="cursor-pointer">
              {isArabic ? "سجل في الدورة" : "Enroll in Course"}
            </Button>
            <Button size="lg" variant="outline" onClick={() => router.push("/courses")} className="cursor-pointer">
              {isArabic ? "عودة إلى الدورات" : "Back to Courses"}
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-border-enhanced p-6 rounded-xl">
        <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
        <p className="text-muted-foreground mb-4">
          {isArabic ? "بواسطة" : "By"} {typeof course.instructor === "object" ? course.instructor.name : course.instructor}
        </p>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{isArabic ? "تقدم الدورة" : "Course Progress"}</span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Player */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Section */}
          <Card className="glass-border overflow-hidden">
            <div className="bg-black aspect-video flex items-center justify-center">
              <div className="text-center">
                <PlayCircle size={80} className="text-white/50 mx-auto mb-4" />
                <p className="text-white/70">Video Player</p>
                <p className="text-white/50 text-sm">URL: {currentLesson.videoUrl}</p>
              </div>
            </div>
          </Card>

          {/* Lesson Info */}
          <Card className="glass-border p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold mb-2">{currentLesson.title}</h2>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock size={16} />
                  <span>{currentLesson.duration} دقيقة</span>
                </div>
              </div>
              <Button
                onClick={handleLessonComplete}
                variant={completedLessons.includes(selectedLesson) ? "secondary" : "default"}
                className="cursor-pointer"
              >
                {completedLessons.includes(selectedLesson) ? "مكتمل" : "وضع كمكتمل"}
              </Button>
            </div>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="materials" className="glass-border p-6 rounded-xl">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="materials" className="cursor-pointer">
                {isArabic ? "المواد" : "Materials"}
              </TabsTrigger>
              <TabsTrigger value="description" className="cursor-pointer">
                {isArabic ? "الوصف" : "Description"}
              </TabsTrigger>
              <TabsTrigger value="discussions" className="cursor-pointer">
                {isArabic ? "النقاشات" : "Discussions"}
              </TabsTrigger>
              <TabsTrigger value="notes" className="cursor-pointer">
                {isArabic ? "ملاحظاتي" : "My Notes"}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="materials" className="space-y-4 mt-6">
              <h3 className="font-semibold mb-4">{isArabic ? "مواد الدرس" : "Lesson Materials"}</h3>
              {currentLesson.materials.map((material) => (
                <div
                  key={material.id}
                  className={`flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors ${isEnrolled ? "cursor-pointer" : "opacity-60"}`}
                >
                  <div className="flex items-center gap-3">
                    {isEnrolled ? (
                      <FileText size={20} className="text-primary" />
                    ) : (
                      <Lock size={20} className="text-muted-foreground" />
                    )}
                    <div>
                      <p className="font-semibold">{material.title}</p>
                      <p className="text-sm text-muted-foreground">{material.type.toUpperCase()}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 cursor-pointer"
                    onClick={() => handleMaterialAccess(material.url)}
                    disabled={!isEnrolled}
                  >
                    {isEnrolled ? <FileText size={16} /> : <Lock size={16} />}
                    {isArabic ? (isEnrolled ? "فتح" : "مقفل") : isEnrolled ? "Open" : "Locked"}
                  </Button>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="description" className="mt-6">
              <p className="text-muted-foreground leading-relaxed">
                {isArabic
                  ? "في هذا الدرس سنتعلم المبادئ الأساسية للابتكار والتفكير الإبداعي، وكيفية تطبيقها في حياتنا اليومية والعملية."
                  : "In this lesson, we will learn the fundamental principles of innovation and creative thinking, and how to apply them in our daily and professional lives."}
              </p>
            </TabsContent>

            <TabsContent value="discussions" className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#551FBD] to-[#7B3FDD] flex items-center justify-center">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{isArabic ? "نقاشات الدورة" : "Course Discussions"}</h3>
                      <p className="text-sm text-muted-foreground">
                        {isArabic ? "تواصل مع زملائك في الدورة" : "Connect with your course colleagues"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-muted/30 p-6 rounded-lg border border-dashed border-border">
                  <p className="text-muted-foreground mb-4 text-center">
                    {isArabic
                      ? "شارك أفكارك واحصل على الدعم من المدربين والطلاب الآخرين"
                      : "Share your ideas and get support from instructors and other students"}
                  </p>
                  <Link href={`/student/courses/${params.id}/discussions`} className="block">
                    <Button className="w-full bg-gradient-to-r from-[#551FBD] to-[#7B3FDD] gap-2 h-12 text-base cursor-pointer hover:opacity-90 transition-opacity">
                      <Users size={20} />
                      {isArabic ? "انتقل إلى نقاشات الدورة" : "Go to Course Discussions"}
                    </Button>
                  </Link>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notes" className="mt-6">
              <div className="bg-muted/30 p-4 rounded-lg min-h-40 border border-dashed border-border">
                <p className="text-muted-foreground">{isArabic ? "أضف ملاحظاتك هنا..." : "Add your notes here..."}</p>
              </div>
            </TabsContent>
          </Tabs>

          {/* Quiz Button */}
          <Button className="w-full h-12 text-base gap-2 cursor-pointer" size="lg" disabled={!isEnrolled}>
            {isEnrolled ? <PlayCircle size={20} /> : <Lock size={20} />}
            {isArabic
              ? isEnrolled
                ? "أكمل الاختبار"
                : "يجب التسجيل لإكمال الاختبار"
              : isEnrolled
                ? "Complete Quiz"
                : "Enroll to Complete Quiz"}
          </Button>
        </div>

        {/* Sidebar - Lessons List */}
        <div>
          <Card className="glass-border sticky top-4">
            <div className="p-6">
              <h3 className="font-bold mb-6">
                {isArabic ? `الدروس (${lessons.length})` : `Lessons (${lessons.length})`}
              </h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {lessons.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    {isArabic ? "لا توجد دروس حالياً" : "No lessons available"}
                  </p>
                ) : (
                  lessons.map((lesson, index) => {
                    const accessible = canAccessLesson(index)
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => accessible && setSelectedLesson(index)}
                        disabled={!accessible}
                        className={`w-full text-right p-3 rounded-lg transition-colors group ${
                          !accessible
                            ? "opacity-50 cursor-not-allowed"
                            : selectedLesson === index
                              ? "bg-primary text-primary-foreground cursor-pointer"
                              : "hover:bg-muted cursor-pointer"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="pt-1">
                            {!accessible ? (
                              <Lock size={20} className="text-muted-foreground" />
                            ) : completedLessons.includes(index) ? (
                              <CheckCircle2 size={20} className="text-green-500" />
                            ) : (
                              <Circle
                                size={20}
                                className={selectedLesson === index ? "text-white" : "text-muted-foreground"}
                              />
                            )}
                          </div>
                          <div className="flex-1">
                            <p
                              className={`font-semibold text-sm leading-tight ${selectedLesson === index ? "text-white" : ""}`}
                            >
                              {isArabic ? lesson.titleAr || lesson.title : lesson.title}
                            </p>
                            <p
                              className={`text-xs mt-1 ${selectedLesson === index ? "text-white/70" : "text-muted-foreground"}`}
                            >
                              {lesson.duration} {isArabic ? "دقيقة" : "minutes"}
                            </p>
                          </div>
                        </div>
                      </button>
                    )
                  })
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
