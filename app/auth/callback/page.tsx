"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"
import { Card } from "@/components/ui/card"
import { Loader2, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AuthCallbackPage() {
  const router = useRouter()
  const { fetchUserSession } = useAuth()
  const { language } = useLanguage()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")

  useEffect(() => {
    const handleCallback = async () => {
      try {
        if (window.opener) {
          // Send message to parent window that login was successful
          window.opener.postMessage({ type: "learnworlds_login_success" }, window.location.origin)
          // Close popup immediately
          window.close()
          return
        }

        await fetchUserSession()

        setStatus("success")
        setMessage(language === "ar" ? "تم تسجيل الدخول بنجاح!" : "Login successful!")

        setTimeout(() => {
          router.push("/student")
        }, 2000)
      } catch (error) {
        console.error("[v0] Auth callback error:", error)
        setStatus("error")
        setMessage(
          language === "ar"
            ? "حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى."
            : "An error occurred during login. Please try again.",
        )
      }
    }

    handleCallback()
  }, [fetchUserSession, language, router])

  const isArabic = language === "ar"

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md glass-border p-8 text-center">
        {status === "loading" && (
          <>
            <Loader2 className="w-16 h-16 mx-auto mb-4 animate-spin text-primary" />
            <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "var(--font-rubik)" }}>
              {isArabic ? "جاري تسجيل الدخول..." : "Signing you in..."}
            </h2>
            <p className="text-muted-foreground" style={{ fontFamily: "var(--font-rubik)" }}>
              {isArabic ? "يرجى الانتظار قليلاً" : "Please wait a moment"}
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
            <h2 className="text-2xl font-bold mb-2 text-green-600" style={{ fontFamily: "var(--font-rubik)" }}>
              {message}
            </h2>
            <p className="text-muted-foreground" style={{ fontFamily: "var(--font-rubik)" }}>
              {isArabic ? "سيتم نقلك تلقائياً..." : "Redirecting automatically..."}
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h2 className="text-2xl font-bold mb-2 text-red-600" style={{ fontFamily: "var(--font-rubik)" }}>
              {message}
            </h2>
            <Button
              onClick={() => router.push("/auth/login")}
              className="mt-4 bg-gradient-to-r from-[#551FBD] to-[#7B3FDD]"
              style={{ fontFamily: "var(--font-rubik)" }}
            >
              {isArabic ? "حاول مرة أخرى" : "Try Again"}
            </Button>
          </>
        )}
      </Card>
    </div>
  )
}
