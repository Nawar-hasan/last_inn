"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react"
import { useToast } from "@/hooks/use-toast"

/**
 * Auth Context - سياق المصادقة
 * يوفر:
 * - إدارة حالة المستخدم
 * - تسجيل الدخول/الخروج
 * - تجديد الجلسة تلقائياً
 * - دعم SSO
 */

interface AuthUser {
  id: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
  enrolledCourses: string[]
  role: "student" | "admin" | "instructor"
}

interface AuthContextType {
  user: AuthUser | null
  student: AuthUser | null // للتوافق مع الكود القديم
  isLoading: boolean
  isAuthenticated: boolean
  fetchUserSession: () => Promise<void>
  login: (email: string, password: string) => Promise<{ requiresSSO?: boolean; ssoUrl?: string } | void>
  register: (data: { email: string; password: string; firstName: string; lastName: string }) => Promise<void>
  logout: () => Promise<void>
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// فترة تجديد الجلسة (كل 5 دقائق)
const SESSION_REFRESH_INTERVAL = 5 * 60 * 1000

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [student, setStudent] = useState<AuthUser | null>(null) // Declared student variable
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // فحص الجلسة الحالية
  const checkExistingSession = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/session", {
        credentials: "include",
      })
      if (response.ok) {
        const data = await response.json()
        if (data.user && data.authenticated) {
          setUser(data.user)
          setStudent(data.user) // Set student variable
        } else {
          setUser(null)
          setStudent(null) // Set student variable
        }
      } else {
        setUser(null)
        setStudent(null) // Set student variable
      }
    } catch (error) {
      console.error("[Auth] Session check failed:", error)
      setUser(null)
      setStudent(null) // Set student variable
    } finally {
      setIsLoading(false)
    }
  }, [])

  // تجديد الجلسة تلقائياً
  const refreshSession = useCallback(async () => {
    if (!user) return
    
    try {
      const response = await fetch("/api/auth/session", {
        credentials: "include",
      })
      if (response.ok) {
        const data = await response.json()
        if (data.user && data.authenticated) {
          setUser(data.user)
          setStudent(data.user) // Set student variable
        }
      }
    } catch (error) {
      console.error("[Auth] Session refresh failed:", error)
    }
  }, [user])

  // فحص الجلسة عند التحميل وبدء التجديد التلقائي
  useEffect(() => {
    checkExistingSession()
    
    // تجديد الجلسة كل 5 دقائق
    refreshIntervalRef.current = setInterval(() => {
      refreshSession()
    }, SESSION_REFRESH_INTERVAL)
    
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current)
      }
    }
  }, [checkExistingSession, refreshSession])

  const fetchUserSession = async () => {
    setIsLoading(true)
    try {
      console.log("[v0] Fetching user session...")
      const response = await fetch("/api/auth/session", {
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Failed to fetch user session")
      }

      const data = await response.json()
      console.log("[v0] User session fetched successfully")

      setUser(data.user)
      setStudent(data.user) // Set student variable
    } catch (error) {
      console.error("[v0] Failed to fetch user session:", error)
      toast({
        variant: "destructive",
        title: "خطأ في جلب بيانات المستخدم",
        description: "فشل في جلب بيانات الجلسة. يرجى المحاولة مرة أخرى.",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<{ requiresSSO?: boolean; ssoUrl?: string } | void> => {
    setIsLoading(true)
    setStudent(null)

    try {
      console.log("[v0] Logging in...")
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      })

      const data = await response.json()

      // Handle SSO redirect requirement
      if (data.requiresSSO && data.ssoUrl) {
        console.log("[v0] SSO authentication required, redirecting...")
        toast({
          title: "جاري التحويل",
          description: "سيتم تحويلك لصفحة تسجيل الدخول الآمنة",
        })
        return { requiresSSO: true, ssoUrl: data.ssoUrl }
      }

      if (!response.ok) {
        throw new Error(data.error || "Login failed")
      }

      // Verify user email matches (with logging for debugging)
      const returnedEmail = (data.user.email || "").toLowerCase().trim()
      const inputEmail = email.toLowerCase().trim()
      
      console.log("[v0] Email comparison:", { returnedEmail, inputEmail, match: returnedEmail === inputEmail })
      
      // Skip email verification if the returned email is empty (some APIs don't return email)
      if (returnedEmail && returnedEmail !== inputEmail) {
        console.error("[v0] Login returned wrong user! Expected:", inputEmail, "Got:", returnedEmail)
        throw new Error("Session error. Please try again.")
      }

      setUser(data.user)
      setStudent(data.user) // Set student variable
      console.log("[v0] Login successful for:", data.user.id, data.user.email)

      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: `مرحباً بك، ${data.user.firstName}!`,
      })
    } catch (error: any) {
      console.error("[v0] Login failed:", error)
      setStudent(null)
      toast({
        variant: "destructive",
        title: "فشل تسجيل الدخول",
        description: error.message || "يرجى التحقق من البريد الإلكتروني وكلمة المرور.",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // تسجيل مستخدم جديد
  const register = async (data: { 
    email: string
    password: string
    firstName: string
    lastName: string 
  }): Promise<void> => {
    setIsLoading(true)
    setUser(null)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "فشل التسجيل")
      }

      setUser(result.user)
      setStudent(result.user)

      toast({
        title: "تم التسجيل بنجاح",
        description: `مرحباً بك، ${result.user.firstName}!`,
      })
    } catch (error: any) {
      console.error("[Auth] Registration failed:", error)
      toast({
        variant: "destructive",
        title: "فشل التسجيل",
        description: error.message || "يرجى المحاولة مرة أخرى.",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // تسجيل الخروج
  const logout = async () => {
    try {
      setUser(null)
      setStudent(null)

      await fetch("/api/auth/session", {
        method: "DELETE",
        credentials: "include",
      })

      // إيقاف تجديد الجلسة
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current)
      }

      toast({
        title: "تم تسجيل الخروج",
        description: "نراك قريباً!",
      })
      
      window.location.href = "/"
    } catch (error) {
      console.error("[Auth] Logout failed:", error)
      toast({
        variant: "destructive",
        title: "خطأ في تسجيل الخروج",
        description: "حدث خطأ أثناء تسجيل الخروج.",
      })
    }
  }

  return (
    <AuthContext.Provider
      value={{
        student,
        user,
        isLoading,
        isAuthenticated: !!user,
        fetchUserSession,
        login,
        register,
        logout,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
