"use client"

import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { BookOpen, Award, Clock, TrendingUp, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface Enrollment {
  id: string
  course_id: string
  product_id: string
  title: string
  enrolled_at: string
  status: string
}

interface Certificate {
  id: string
  course_id: string
  title: string
  issued_at: string
  url: string
}

export default function StudentDashboard() {
  const { student, isAuthenticated, isLoading: authLoading } = useAuth()
  const { language } = useLanguage()
  const router = useRouter()
  const isArabic = language === "ar"

  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!student?.id) {
        setLoading(false)
        return
      }

      try {
        console.log("[v0] Fetching student data for user:", student.id)

        // جلب التسجيلات
        const enrollmentsRes = await fetch(`/api/student/enrollments?userId=${student.id}`)
        if (enrollmentsRes.ok) {
          const enrollmentsData = await enrollmentsRes.json()
          setEnrollments(enrollmentsData.enrollments || [])
          console.log("[v0] Enrollments loaded:", enrollmentsData.enrollments?.length || 0)
        }

        // جلب الشهادات
        const certificatesRes = await fetch(`/api/student/certificates?userId=${student.id}`)
        if (certificatesRes.ok) {
          const certificatesData = await certificatesRes.json()
          setCertificates(certificatesData.certificates || [])
          console.log("[v0] Certificates loaded:", certificatesData.certificates?.length || 0)
        }
      } catch (err: any) {
        console.error("[v0] Error fetching student data:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (!authLoading) {
      if (isAuthenticated) {
        fetchStudentData()
      } else {
        router.push("/auth/login?redirect=/student")
      }
    }
  }, [student, isAuthenticated, authLoading, router])

  if (authLoading || (loading && isAuthenticated)) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-40 w-full rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const inProgressCourses = enrollments.length
  const completedCourses = certificates.length
  const totalProgress = enrollments.length > 0 ? Math.round((completedCourses / enrollments.length) * 100) : 0

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#551FBD] to-[#7B3FDD] p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: "var(--font-rubik)" }}>
            {isArabic ? "مرحباً" : "Welcome"}, {student?.firstName || student?.email?.split("@")[0]}!
          </h1>
          <p className="text-white/90 text-lg" style={{ fontFamily: "var(--font-rubik)" }}>
            {isArabic
              ? "استمر في رحلتك التعليمية وحقق أهدافك الأكاديمية"
              : "Continue your learning journey and achieve your academic goals"}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          icon={BookOpen}
          label={isArabic ? "دوراتي" : "My Courses"}
          value={enrollments.length.toString()}
          color="from-blue-500 to-blue-600"
        />
        <StatCard
          icon={Award}
          label={isArabic ? "الشهادات" : "Certificates"}
          value={certificates.length.toString()}
          color="from-amber-500 to-amber-600"
        />
        <StatCard
          icon={Clock}
          label={isArabic ? "قيد التقدم" : "In Progress"}
          value={inProgressCourses.toString()}
          color="from-purple-500 to-purple-600"
        />
        <StatCard
          icon={TrendingUp}
          label={isArabic ? "معدل الإنجاز" : "Completion Rate"}
          value={`${totalProgress}%`}
          color="from-green-500 to-green-600"
        />
      </div>

      {/* Courses Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-rubik)" }}>
            {isArabic ? "دوراتي" : "My Courses"}
          </h2>
          <Link href="/student/courses">
            <Button
              variant="outline"
              className="gap-2 bg-transparent border-[#551FBD]/40 hover:bg-[#551FBD]/10"
              style={{ fontFamily: "var(--font-rubik)" }}
            >
              {isArabic ? "عرض الكل" : "View All"}
              <ArrowRight size={16} className={isArabic ? "rotate-180" : ""} />
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-64 rounded-lg" />
            ))}
          </div>
        ) : error ? (
          <Card className="p-12 text-center bg-muted/30">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>{isArabic ? "إعادة المحاولة" : "Retry"}</Button>
          </Card>
        ) : enrollments.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {enrollments.slice(0, 4).map((enrollment) => (
              <CourseCard key={enrollment.id} enrollment={enrollment} />
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center glass-border-enhanced bg-muted/30">
            <BookOpen className="mx-auto mb-4 text-muted-foreground" size={48} />
            <p className="text-muted-foreground mb-4" style={{ fontFamily: "var(--font-rubik)" }}>
              {isArabic ? "لا توجد دورات مسجلة بعد" : "No courses enrolled yet"}
            </p>
            <Link href="/courses">
              <Button className="bg-gradient-to-r from-[#551FBD] to-[#7B3FDD]">
                {isArabic ? "تصفح الدورات" : "Browse Courses"}
              </Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: any
  label: string
  value: string
  color: string
}) {
  return (
    <Card className="glass-border-enhanced p-6 hover:shadow-xl transition-all bg-card/80 backdrop-blur-sm border-border/50 hover:scale-[1.02]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1 font-medium" style={{ fontFamily: "var(--font-rubik)" }}>
            {label}
          </p>
          <p className="text-3xl font-bold text-foreground" style={{ fontFamily: "var(--font-rubik)" }}>
            {value}
          </p>
        </div>
        <div className={`bg-gradient-to-br ${color} p-4 rounded-xl text-white shadow-lg`}>
          <Icon size={24} />
        </div>
      </div>
    </Card>
  )
}

function CourseCard({ enrollment }: { enrollment: Enrollment }) {
  const { language } = useLanguage()
  const { student } = useAuth()
  const isArabic = language === "ar"
  const [progress, setProgress] = useState(0)

  const courseId = enrollment.product_id || enrollment.course_id || enrollment.id

  useEffect(() => {
    const fetchProgress = async () => {
      if (!student?.id || !courseId) {
        console.log("[v0] Missing student ID or course ID:", { studentId: student?.id, courseId })
        return
      }

      try {
        console.log("[v0] Fetching progress for:", { userId: student.id, courseId })
        const res = await fetch(`/api/student/progress?userId=${student.id}&courseId=${courseId}`)
        if (res.ok) {
          const data = await res.json()
          setProgress(data.progress?.percent || 0)
        }
      } catch (err) {
        console.error("[v0] Error fetching progress:", err)
      }
    }

    fetchProgress()
  }, [student, courseId])

  return (
    <Card className="glass-border-enhanced overflow-hidden hover:shadow-2xl transition-all group bg-card/80 backdrop-blur-sm border-border/50">
      {/* Course Header with Gradient */}
      <div className="relative h-32 bg-gradient-to-br from-[#551FBD] to-[#7B3FDD] overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="font-bold text-xl text-white mb-1" style={{ fontFamily: "var(--font-rubik)" }}>
            {enrollment.title || "Course"}
          </h3>
        </div>
      </div>

      {/* Course Body */}
      <div className="p-6 space-y-4">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground" style={{ fontFamily: "var(--font-rubik)" }}>
              {isArabic ? "التقدم" : "Progress"}
            </span>
            <span className="font-semibold text-[#551FBD]" style={{ fontFamily: "var(--font-rubik)" }}>
              {Math.round(progress)}%
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Action Button */}
        <Link href={`/student/courses/${courseId}`} className="block">
          <Button
            className="w-full bg-gradient-to-r from-[#551FBD] to-[#7B3FDD] hover:opacity-90 text-white shadow-lg shadow-[#551FBD]/30 group-hover:shadow-xl group-hover:shadow-[#551FBD]/40 transition-all"
            style={{ fontFamily: "var(--font-rubik)" }}
          >
            {progress === 100
              ? isArabic
                ? "مراجعة الدورة"
                : "Review Course"
              : isArabic
                ? "متابعة الدورة"
                : "Continue Course"}
            <ArrowRight size={16} className={`ml-2 ${isArabic ? "rotate-180" : ""}`} />
          </Button>
        </Link>
      </div>
    </Card>
  )
}
