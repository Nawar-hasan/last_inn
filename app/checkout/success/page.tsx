"use client"

import { useLanguage } from "@/lib/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, ArrowRight } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { AppverseFooter } from "@/components/appverse-footer"
import { useEffect, useState } from "react"

export default function CheckoutSuccessPage() {
  const { language } = useLanguage()
  const isArabic = language === "ar"
  const [showAnimation, setShowAnimation] = useState(false)

  useEffect(() => {
    setShowAnimation(true)
  }, [])

  return (
    <main>
      <SiteHeader />
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
        <Card className="max-w-md w-full liquid-glass animate-fade-in-up">
          <CardContent className="pt-8 text-center space-y-6">
            {/* Success Icon */}
            {showAnimation && (
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-[#53FBA1]/20 rounded-full blur-lg animate-pulse" />
                  <CheckCircle className="h-24 w-24 text-[#53FBA1] relative z-10 animate-bounce" />
                </div>
              </div>
            )}

            {/* Title */}
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2" style={{ fontFamily: "var(--font-rubik)" }}>
                {isArabic ? "تم بنجاح!" : "Success!"}
              </h1>
              <p className="text-lg text-foreground/70" style={{ fontFamily: "var(--font-rubik)" }}>
                {isArabic ? "تم تفعيل اشتراكك بنجاح" : "Your subscription has been activated"}
              </p>
            </div>

            {/* Message */}
            <div className="bg-foreground/5 rounded-lg p-4">
              <p className="text-sm text-foreground/80" style={{ fontFamily: "var(--font-rubik)" }}>
                {isArabic
                  ? "تم إرسال تأكيد الاشتراك إلى بريدك الإلكتروني. يمكنك الآن الوصول إلى جميع ميزات الباقة."
                  : "A confirmation email has been sent to your inbox. You now have access to all plan features."}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <Button
                asChild
                className="w-full bg-gradient-to-r from-[#551FBD] to-[#7B3FDD] py-6 font-bold hover:opacity-90"
                style={{ fontFamily: "var(--font-rubik)" }}
              >
                <a href="/student/courses" className="flex items-center justify-center gap-2">
                  {isArabic ? "ابدأ الآن" : "Get Started"}
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>

              <Button
                asChild
                variant="outline"
                className="w-full py-6 font-bold bg-transparent"
                style={{ fontFamily: "var(--font-rubik)" }}
              >
                <a href="/">{isArabic ? "العودة إلى الرئيسية" : "Back to Home"}</a>
              </Button>
            </div>

            {/* Support Note */}
            <p
              className="text-xs text-foreground/60 border-t border-border pt-4"
              style={{ fontFamily: "var(--font-rubik)" }}
            >
              {isArabic ? "هل تحتاج إلى مساعدة؟ اتصل بنا عبر الواتس" : "Need help? Contact us via WhatsApp"}
            </p>
          </CardContent>
        </Card>
      </div>
      <AppverseFooter />
    </main>
  )
}
