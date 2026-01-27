"use client"
import { useLanguage } from "@/lib/language-context"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, LogIn, ExternalLink } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const { language } = useLanguage()
  const { user, login } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  useEffect(() => {
    if (user) {
      router.push("/student")
    }
  }, [user, router])

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await login(email, password)

      // Handle SSO redirect if required
      if (result?.requiresSSO && result?.ssoUrl) {
        window.location.href = result.ssoUrl
        return
      }

      router.push("/student")
    } catch (err: any) {
      console.error("Login error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    setIsGoogleLoading(true)
    window.location.href = "/api/auth/google"
  }

  const handleLearnWorldsLogin = () => {
    const schoolDomain = process.env.NEXT_PUBLIC_LEARNWORLD_SCHOOL_DOMAIN || "innovologia.learnworlds.com"
    window.location.href = `https://${schoolDomain}/login`
  }

  const isArabic = language === "ar"

  return (
    <>
      <Button
        variant="ghost"
        className={`absolute top-8 ${isArabic ? "right-8" : "left-8"} flex items-center gap-2 hover:bg-foreground/5`}
        onClick={() => router.back()}
      >
        <ArrowRight size={20} className={isArabic ? "" : "rotate-180"} />
        <span>{isArabic ? "رجوع" : "Back"}</span>
      </Button>

      <Card className="w-full max-w-md glass-border p-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="p-4 bg-gradient-to-br from-[#551FBD] to-[#7B3FDD] rounded-full">
              <LogIn className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-rubik)" }}>
            {isArabic ? "سجّل الدخول للبدء بالتعلّم" : "Sign In to Start Learning"}
          </h1>
          <p className="text-muted-foreground" style={{ fontFamily: "var(--font-rubik)" }}>
            {isArabic ? "مرحباً بعودتك إلى Innovologia" : "Welcome back to Innovologia"}
          </p>
        </div>

        <Button
          onClick={handleGoogleLogin}
          disabled={isGoogleLoading || isLoading}
          className="w-full h-14 gap-3 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm mb-4"
          style={{ fontFamily: "var(--font-rubik)" }}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span className="font-medium">
            {isGoogleLoading
              ? isArabic
                ? "جاري التحميل..."
                : "Loading..."
              : isArabic
                ? "المتابعة مع Google"
                : "Continue with Google"}
          </span>
        </Button>

        <Button
          onClick={handleLearnWorldsLogin}
          disabled={isLoading || isGoogleLoading}
          className="w-full h-14 gap-3 bg-gradient-to-r from-[#551FBD] to-[#7B3FDD] hover:opacity-90 text-white mb-6"
          style={{ fontFamily: "var(--font-rubik)" }}
        >
          <ExternalLink className="w-5 h-5" />
          <span className="font-medium">{isArabic ? "تسجيل الدخول من LearnWorlds" : "Login via LearnWorlds"}</span>
        </Button>

        {/* Divider */}
        <div className="my-6 flex items-center gap-4">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground">
            {isArabic ? "أو استخدم البريد الإلكتروني" : "or use email"}
          </span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Email/Password Login Form */}
        <form onSubmit={handleEmailLogin} className="space-y-4 mb-6">
          <div className="space-y-2">
            <Label htmlFor="email" style={{ fontFamily: "var(--font-rubik)" }}>
              {isArabic ? "البريد الإلكتروني" : "Email"}
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={isArabic ? "أدخل بريدك الإلكتروني" : "Enter your email"}
              required
              disabled={isLoading || isGoogleLoading}
              className="h-12"
              style={{ fontFamily: "var(--font-rubik)" }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" style={{ fontFamily: "var(--font-rubik)" }}>
              {isArabic ? "كلمة المرور" : "Password"}
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isArabic ? "أدخل كلمة المرور" : "Enter your password"}
              required
              disabled={isLoading || isGoogleLoading}
              className="h-12"
              style={{ fontFamily: "var(--font-rubik)" }}
            />
          </div>

          <p className="text-xs text-muted-foreground text-center" style={{ fontFamily: "var(--font-rubik)" }}>
            {isArabic
              ? "سيتم تحويلك لصفحة LearnWorlds للتحقق من هويتك"
              : "You will be redirected to LearnWorlds for secure authentication"}
          </p>

          <Button
            type="submit"
            disabled={isLoading || isGoogleLoading}
            className="w-full h-12 bg-foreground hover:bg-foreground/90 text-background"
            style={{ fontFamily: "var(--font-rubik)" }}
          >
            {isLoading ? (isArabic ? "جاري تسجيل الدخول..." : "Signing in...") : isArabic ? "تسجيل الدخول" : "Sign In"}
          </Button>
        </form>

        {/* Forgot Password Link */}
        <div className="text-center mb-4">
          <Link
            href="/auth/forgot-password"
            className="text-sm text-primary hover:underline"
            style={{ fontFamily: "var(--font-rubik)" }}
          >
            {isArabic ? "نسيت كلمة المرور؟" : "Forgot password?"}
          </Link>
        </div>

        {/* Register Link */}
        <div className="text-center mb-4">
          <p className="text-sm text-muted-foreground" style={{ fontFamily: "var(--font-rubik)" }}>
            {isArabic ? "ليس لديك حساب؟ " : "Don't have an account? "}
            <Link href="/auth/register" className="text-primary hover:underline font-semibold">
              {isArabic ? "إنشاء حساب جديد" : "Create Account"}
            </Link>
          </p>
        </div>

        {/* Guest Option */}
        <Link href="/courses" className="block">
          <Button variant="outline" className="w-full h-12 bg-transparent" style={{ fontFamily: "var(--font-rubik)" }}>
            {isArabic ? "تصفح الدورات كزائر" : "Browse Courses as Guest"}
          </Button>
        </Link>
      </Card>
    </>
  )
}
