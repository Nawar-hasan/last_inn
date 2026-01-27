// LearnWorld API Client - Ready for integration with actual API
import type { Course, StudentProgress, Certificate, QuizAttempt } from "./learnworld-types"

const API_BASE_URL = process.env.LEARNWORLD_API_URL || "https://api.learnworlds.com/v2"
const API_KEY = process.env.LEARNWORLD_API_KEY

class LearnWorldClient {
  private baseURL: string
  private apiKey: string | undefined

  constructor() {
    this.baseURL = API_BASE_URL
    this.apiKey = API_KEY
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(this.apiKey && { Authorization: `Bearer ${this.apiKey}` }),
      ...options.headers,
    }

    if (this.isDevelopmentMode()) {
      return this.getMockData(endpoint, options.method)
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    const text = await response.text()

    if (!response.ok) {
      console.error(`[LearnWorldClient] Error ${response.status}:`, text.substring(0, 500))

      let errorMessage = text
      try {
        const errorData = JSON.parse(text)
        errorMessage = errorData.message || errorData.error || text
      } catch {
        errorMessage = text.replace(/<[^>]*>/g, "")
      }

      throw new Error(errorMessage)
    }

    try {
      return JSON.parse(text)
    } catch {
      console.error("[LearnWorldClient] Failed to parse JSON:", text.substring(0, 200))
      throw new Error("Invalid response format")
    }
  }

  // Courses
  async getCourses(): Promise<Course[]> {
    return this.request("/courses")
  }

  async getCourse(courseId: string): Promise<Course> {
    return this.request(`/courses/${courseId}`)
  }

  async createCourse(courseData: Partial<Course>): Promise<Course> {
    return this.request("/courses", {
      method: "POST",
      body: JSON.stringify(courseData),
    })
  }

  async updateCourse(courseId: string, courseData: Partial<Course>): Promise<Course> {
    return this.request(`/courses/${courseId}`, {
      method: "PUT",
      body: JSON.stringify(courseData),
    })
  }

  async deleteCourse(courseId: string): Promise<void> {
    return this.request(`/courses/${courseId}`, {
      method: "DELETE",
    })
  }

  // Users & Students
  async getUsers(filters?: { tag?: string; enrolled?: boolean }): Promise<any[]> {
    const params = new URLSearchParams()
    if (filters?.tag) params.append("tag", filters.tag)
    if (filters?.enrolled !== undefined) params.append("enrolled", filters.enrolled.toString())
    return this.request(`/users?${params.toString()}`)
  }

  async getUser(userId: string): Promise<any> {
    return this.request(`/users/${userId}`)
  }

  async updateUser(userId: string, userData: any): Promise<any> {
    return this.request(`/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    })
  }

  async addUserTags(userId: string, tags: string[]): Promise<void> {
    return this.request(`/users/${userId}/tags`, {
      method: "POST",
      body: JSON.stringify({ tags }),
    })
  }

  async removeUserTags(userId: string, tags: string[]): Promise<void> {
    return this.request(`/users/${userId}/tags`, {
      method: "DELETE",
      body: JSON.stringify({ tags }),
    })
  }

  // Enrollments
  async enrollUser(userId: string, courseId: string): Promise<void> {
    return this.request(`/users/${userId}/enrollments`, {
      method: "POST",
      body: JSON.stringify({ courseId }),
    })
  }

  async unenrollUser(userId: string, courseId: string): Promise<void> {
    return this.request(`/users/${userId}/enrollments/${courseId}`, {
      method: "DELETE",
    })
  }

  // Student Progress
  async getStudentProgress(studentId: string, courseId: string): Promise<StudentProgress> {
    return this.request(`/students/${studentId}/progress/${courseId}`)
  }

  async updateLessonCompletion(studentId: string, lessonId: string) {
    return this.request(`/students/${studentId}/lessons/${lessonId}/complete`, {
      method: "POST",
    })
  }

  // Community & Discussions
  async getCommunitySpaces(): Promise<any[]> {
    return this.request("/community/spaces")
  }

  async getSpacePosts(spaceId: string): Promise<any[]> {
    return this.request(`/community/spaces/${spaceId}/posts`)
  }

  async createPost(spaceId: string, content: string): Promise<any> {
    return this.request(`/community/spaces/${spaceId}/posts`, {
      method: "POST",
      body: JSON.stringify({ content }),
    })
  }

  async getCourseDiscussions(courseId: string): Promise<any[]> {
    return this.request(`/courses/${courseId}/discussions`)
  }

  // Quiz Attempts
  async submitQuizAttempt(studentId: string, quizId: string, answers: string[]): Promise<QuizAttempt> {
    return this.request(`/students/${studentId}/quizzes/${quizId}/submit`, {
      method: "POST",
      body: JSON.stringify({ answers }),
    })
  }

  async getQuizAttempts(studentId: string, quizId: string): Promise<QuizAttempt[]> {
    return this.request(`/students/${studentId}/quizzes/${quizId}/attempts`)
  }

  // Certificates
  async requestCertificate(studentId: string, courseId: string): Promise<Certificate> {
    return this.request(`/students/${studentId}/certificates/request`, {
      method: "POST",
      body: JSON.stringify({ courseId }),
    })
  }

  async getCertificates(studentId: string): Promise<Certificate[]> {
    return this.request(`/students/${studentId}/certificates`)
  }

  async downloadCertificate(certificateId: string): Promise<Blob> {
    const response = await fetch(`${this.baseURL}/certificates/${certificateId}/download`)
    return response.blob()
  }

  // Payments & Subscriptions
  async getPayments(userId?: string): Promise<any[]> {
    const endpoint = userId ? `/payments?userId=${userId}` : "/payments"
    return this.request(endpoint)
  }

  async getSubscriptions(userId?: string): Promise<any[]> {
    const endpoint = userId ? `/subscriptions?userId=${userId}` : "/subscriptions"
    return this.request(endpoint)
  }

  // Promotions & Coupons
  async getPromotions(): Promise<any[]> {
    return this.request("/promotions")
  }

  async createCoupon(couponData: any): Promise<any> {
    return this.request("/coupons", {
      method: "POST",
      body: JSON.stringify(couponData),
    })
  }

  // Reports & Analytics
  async getCourseReport(courseId: string): Promise<any> {
    return this.request(`/reports/courses/${courseId}`)
  }

  async getUserReport(userId: string): Promise<any> {
    return this.request(`/reports/users/${userId}`)
  }

  async getEnrollmentStats(): Promise<any> {
    return this.request("/reports/enrollments")
  }

  // Webhooks
  async registerWebhook(url: string, events: string[]): Promise<any> {
    return this.request("/webhooks", {
      method: "POST",
      body: JSON.stringify({ url, events }),
    })
  }

  async listWebhooks(): Promise<any[]> {
    return this.request("/webhooks")
  }

  async deleteWebhook(webhookId: string): Promise<void> {
    return this.request(`/webhooks/${webhookId}`, {
      method: "DELETE",
    })
  }

  private isDevelopmentMode(): boolean {
    return !this.apiKey || this.apiKey === ""
  }

  private async getMockData(endpoint: string, method?: string): Promise<any> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    // Courses endpoints
    if (endpoint === "/courses") {
      return [
        {
          id: "cins",
          title: "الرئيس التنفيذي للابتكار المعتمد",
          slug: "cins",
          instructor: "Innovologia Academy",
          description: "دورة تحضيرية شاملة لامتحان شهادة استراتيجي الابتكار المعتمد",
          duration: "8 أسابيع",
          price: 3700,
          originalPrice: 4500,
          thumbnail: "/images/course-badge.jpg",
          tags: ["innovation", "certification", "advanced"],
        },
        {
          id: "aina",
          title: "استراتيجي الابتكار المعتمد",
          slug: "aina",
          instructor: "Innovologia Academy",
          description: "تعلم استراتيجيات الابتكار على مستوى عالي",
          duration: "6 أسابيع",
          price: 2375,
          originalPrice: 2675,
          thumbnail: "/images/course-badge.jpg",
          tags: ["innovation", "strategy"],
        },
      ]
    }

    // Users endpoints
    if (endpoint.startsWith("/users")) {
      if (endpoint.includes("/tags")) {
        return { success: true }
      }
      return [
        {
          id: "user-1",
          email: "student@example.com",
          firstName: "محمد",
          lastName: "أحمد",
          tags: ["premium", "active"],
          enrolledCourses: ["cins", "aina"],
        },
      ]
    }

    // Community & Discussions
    if (endpoint.includes("/community/spaces")) {
      if (endpoint.includes("/posts")) {
        return [
          {
            id: "post-1",
            content: "هذا منشور تجريبي في المجتمع",
            author: "محمد أحمد",
            createdAt: new Date().toISOString(),
            likes: 5,
            comments: 3,
          },
        ]
      }
      return [
        {
          id: "space-1",
          name: "مجتمع دورة CInS",
          description: "نقاشات خاصة بدورة الرئيس التنفيذي للابتكار",
          members: 125,
          posts: 45,
        },
      ]
    }

    // Student progress
    if (endpoint.includes("/progress/")) {
      return {
        courseId: endpoint.split("/")[4],
        lessonsTotal: 24,
        lessonsCompleted: 18,
        quizzesTotal: 6,
        quizzesCompleted: 4,
        lastAccessedAt: new Date().toISOString(),
      }
    }

    // Certificates
    if (endpoint.includes("/certificates")) {
      if (method === "POST") {
        return {
          id: "cert-" + Date.now(),
          courseId: "cins",
          courseName: "الرئيس التنفيذي للابتكار المعتمد",
          studentId: "test-student",
          studentName: "Test Student",
          issuedAt: new Date().toISOString(),
          certificateUrl: "/api/certificates/download/cert-123",
        }
      }
      return [
        {
          id: "cert-123",
          courseId: "aina",
          courseName: "استراتيجي الابتكار المعتمد",
          studentId: "test-student",
          studentName: "Test Student",
          issuedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          certificateUrl: "/api/certificates/download/cert-123",
        },
      ]
    }

    // Quiz attempts
    if (endpoint.includes("/quizzes/") && endpoint.includes("/attempts")) {
      return [
        {
          id: "attempt-1",
          quizId: endpoint.split("/")[5],
          score: 85,
          totalQuestions: 20,
          correctAnswers: 17,
          completedAt: new Date().toISOString(),
        },
      ]
    }

    // Reports & Analytics
    if (endpoint.includes("/reports/")) {
      return {
        totalStudents: 1250,
        activeStudents: 890,
        completionRate: 72,
        averageScore: 85,
        revenue: 125000,
      }
    }

    // Webhooks
    if (endpoint.includes("/webhooks")) {
      if (method === "POST") {
        return {
          id: "webhook-" + Date.now(),
          url: "https://example.com/webhook",
          events: ["user.enrolled", "course.completed"],
          active: true,
        }
      }
      return [
        {
          id: "webhook-1",
          url: "https://example.com/webhook",
          events: ["user.enrolled", "course.completed"],
          active: true,
        },
      ]
    }

    // Default empty response
    return {}
  }
}

export const learnworldClient = new LearnWorldClient()
