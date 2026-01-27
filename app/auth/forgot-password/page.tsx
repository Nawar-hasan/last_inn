"use client"

import type React from "react"

import { useState } from "react"
import { useLanguage } from "@/lib/language-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { Mail, AlertCircle, CheckCircle } from "lucide-react"

export default function ForgotPasswordPage() {
  const { t, language } = useLanguage()
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        throw new Error("فشل إرسال رابط إعادة تعيين كلمة المرور")
      }

      setIsSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ ما")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md glass-border p-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">{t("auth.forgot.password")}</h1>
        <p className="text-muted-foreground">
          {language === "ar"
            ? "أدخل بريدك الإلكتروني لتلقي رابط إعادة تعيين كلمة المرور"
            : "Enter your email to receive a password reset link"}
        </p>
      </div>

      {isSubmitted ? (
        <div className="space-y-4">
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {language === "ar"
                ? "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني"
                : "Password reset link sent to your email"}
            </AlertDescription>
          </Alert>
          <p className="text-sm text-muted-foreground text-center">
            {language === "ar"
              ? "تحقق من بريدك الإلكتروني واتبع التعليمات"
              : "Check your email and follow the instructions"}
          </p>
          <Link href="/auth/login" className="block">
            <Button className="w-full">{t("auth.login")}</Button>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">{t("auth.email")}</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-muted-foreground" size={20} />
              <Input
                type="email"
                placeholder={t("auth.email")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "جاري الإرسال..." : "إرسال رابط إعادة التعيين"}
          </Button>
        </form>
      )}

      <div className="mt-6 text-center">
        <Link href="/auth/login" className="text-sm text-primary hover:underline">
          {language === "ar" ? "العودة إلى تسجيل الدخول" : "Back to login"}
        </Link>
      </div>
    </Card>
  )
}
