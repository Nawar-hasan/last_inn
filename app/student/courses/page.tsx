"use client"

import { useLanguage } from "@/lib/language-context"
import { useStudentCourses } from "@/lib/hooks/use-student-data"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Filter, Search, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Input } from "@/components/ui/input"

export default function StudentCoursesPage() {
  const { t } = useLanguage()
  const { courses, isLoading } = useStudentCourses()
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "progress" | "completed">("all")

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">{t("student.my.courses")}</h1>
        <p className="text-muted-foreground">أنت مشترك في {courses.length} دورة. استمر في التعلم وحقق أهدافك</p>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 flex-wrap">
        <div className="flex-1 min-w-xs relative">
          <Search className="absolute left-3 top-3 text-muted-foreground" size={20} />
          <Input
            placeholder="ابحث عن دورة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="gap-2 bg-transparent">
          <Filter size={20} />
          تصفية
        </Button>
      </div>

      {/* Courses Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="h-40 bg-muted" />
          ))}
        </div>
      ) : filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCourses.map((course) => (
            <CourseTile key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground mb-4">لا توجد دورات متطابقة</p>
          <Link href="/courses">
            <Button>{t("courses.more")}</Button>
          </Link>
        </Card>
      )}
    </div>
  )
}

function CourseTile({ course }: { course: any }) {
  const { language } = useLanguage()
  const isArabic = language === "ar"

  return (
    <Card className="glass-border overflow-hidden group hover:shadow-xl transition-all">
      <div className="relative h-32 bg-gradient-to-br from-[#551FBD] to-[#7B3FDD] overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="font-bold text-xl text-white mb-1" style={{ fontFamily: "var(--font-rubik)" }}>
            {course.title}
          </h3>
          <p className="text-sm text-white/90">{course.instructor}</p>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{isArabic ? "التقدم" : "Progress"}</span>
            <span className="font-semibold text-[#551FBD]">75%</span>
          </div>
          <Progress value={75} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-gradient-to-br from-[#551FBD]/10 to-[#7B3FDD]/10 p-3 rounded-lg">
            <p className="text-muted-foreground mb-1">{isArabic ? "دروس" : "Lessons"}</p>
            <p className="font-bold text-lg">{course.lessons?.length || 0}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-3 rounded-lg">
            <p className="text-muted-foreground mb-1">{isArabic ? "المدة" : "Duration"}</p>
            <p className="font-bold text-lg">{course.duration}h</p>
          </div>
        </div>

        <Link href={`/student/courses/${course.id}`} className="block">
          <Button
            className="w-full bg-gradient-to-r from-[#551FBD] to-[#7B3FDD] hover:opacity-90 text-white shadow-lg shadow-[#551FBD]/30 hover:shadow-xl hover:shadow-[#551FBD]/40 transition-all"
            style={{ fontFamily: "var(--font-rubik)" }}
          >
            {isArabic ? "متابعة الدورة" : "Continue Course"}
            <ArrowRight size={16} className={`ml-2 ${isArabic ? "rotate-180" : ""}`} />
          </Button>
        </Link>
      </div>
    </Card>
  )
}
