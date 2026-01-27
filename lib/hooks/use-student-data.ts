"use client"

import { useAuth } from "@/lib/auth-context"
import type { Course, StudentProgress, Certificate } from "@/lib/learnworld-types"
import { useEffect, useState } from "react"

export function useStudentCourses() {
  const { student, isAuthenticated } = useAuth()
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated || !student) return

    const fetchCourses = async () => {
      setIsLoading(true)
      try {
        // Fetch user's enrollments from LearnWorlds
        const response = await fetch(`/api/enrollments?userId=${student.id}`)

        if (!response.ok) {
          throw new Error("Failed to fetch enrollments")
        }

        const enrollmentsData = await response.json()

        // If user has enrollments, fetch course details for each
        if (enrollmentsData.data && Array.isArray(enrollmentsData.data)) {
          const courseIds = enrollmentsData.data.map((e: any) => e.product_id)

          // Fetch all courses
          const coursesResponse = await fetch("/api/courses")
          if (!coursesResponse.ok) {
            throw new Error("Failed to fetch courses")
          }

          const allCoursesData = await coursesResponse.json()
          const allCourses = Array.isArray(allCoursesData) ? allCoursesData : allCoursesData.data || []

          // Filter only enrolled courses
          const enrolledCourses = allCourses.filter((course: any) => courseIds.includes(course.id))

          setCourses(enrolledCourses)
        } else {
          setCourses([])
        }
      } catch (err) {
        console.error("[useStudentCourses] Error:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch courses")
        setCourses([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchCourses()
  }, [isAuthenticated, student])

  return { courses, isLoading, error }
}

export function useStudentProgress(courseId: string) {
  const { student, isAuthenticated } = useAuth()
  const [progress, setProgress] = useState<StudentProgress | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!isAuthenticated || !student || !courseId) return

    const fetchProgress = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/progress?userId=${student.id}&courseId=${courseId}`)

        if (!response.ok) {
          throw new Error("Failed to fetch progress")
        }

        const data = await response.json()
        setProgress(data)
      } catch (err) {
        console.error("[useStudentProgress] Error:", err)
        setProgress(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProgress()
  }, [isAuthenticated, student, courseId])

  return { progress, isLoading }
}

export function useStudentCertificates() {
  const { student, user, isAuthenticated } = useAuth()
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const currentUser = user || student

  useEffect(() => {
    if (!isAuthenticated || !currentUser) {
      setIsLoading(false)
      return
    }

    const fetchCertificates = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        // جلب الشهادات من API الخاص بالطالب (يتحقق من الجلسة)
        const response = await fetch(`/api/student/certificates?userId=${currentUser.id}`, {
          credentials: "include",
        })

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("يرجى تسجيل الدخول للوصول إلى شهاداتك")
          }
          throw new Error("فشل في جلب الشهادات")
        }

        const data = await response.json()

        if (!data.success && data.error) {
          throw new Error(data.error)
        }

        // تحويل البيانات من LearnWorlds إلى صيغتنا
        const transformedCerts = (data.certificates || data.data || []).map((cert: any) => ({
          id: cert.id || cert.certificate_id,
          courseId: cert.courseId || cert.course_id || cert.product_id,
          courseName: cert.courseName || cert.course_name || cert.product_name || "دورة تدريبية",
          courseNameEn: cert.courseNameEn || cert.course_name_en,
          certificateNumber: cert.certificateNumber || cert.certificate_number || cert.id,
          issuedAt: cert.issuedAt || cert.issued_at || cert.created_at,
          expiresAt: cert.expiresAt || cert.expires_at || null,
          downloadUrl: cert.downloadUrl || cert.download_url || cert.url,
          verifyUrl: cert.verifyUrl || cert.verify_url,
          status: cert.status || "valid",
          instructorName: cert.instructorName || cert.instructor_name,
        }))

        setCertificates(transformedCerts)
      } catch (err) {
        console.error("[useStudentCertificates] Error:", err)
        setError(err instanceof Error ? err.message : "فشل في جلب الشهادات")
        setCertificates([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchCertificates()
  }, [isAuthenticated, currentUser])

  return { certificates, isLoading, error, refetch: () => {
    if (currentUser) {
      setIsLoading(true)
      // إعادة جلب البيانات
    }
  }}
}
