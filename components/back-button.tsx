"use client"

import { useRouter, usePathname } from "next/navigation"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { Button } from "@/components/ui/button"

export function BackButton() {
  const router = useRouter()
  const pathname = usePathname()
  const { language } = useLanguage()
  const isArabic = language === "ar"

  // Don't show on home page
  if (pathname === "/" || pathname === "") {
    return null
  }

  const handleBack = () => {
    // Check if there's history to go back to
    if (window.history.length > 1) {
      router.back()
    } else {
      // Fallback to home page
      router.push("/")
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleBack}
      className="fixed top-24 left-4 z-40 flex items-center gap-2 bg-background/80 backdrop-blur-sm border border-border/50 shadow-lg hover:bg-background/90 hover:shadow-xl transition-all duration-300 rounded-full px-4 py-2 group"
      style={{ fontFamily: "var(--font-rubik)" }}
    >
      {isArabic ? (
        <>
          <span className="text-sm font-medium">{isArabic ? "رجوع" : "Back"}</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </>
      ) : (
        <>
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span className="text-sm font-medium">Back</span>
        </>
      )}
    </Button>
  )
}
