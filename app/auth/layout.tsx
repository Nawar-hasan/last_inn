"use client"

import type React from "react"
import { useLanguage } from "@/lib/language-context"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage()
  const isArabic = language === "ar"

  return (
    <div className="min-h-screen relative overflow-hidden" dir={isArabic ? "rtl" : "ltr"}>
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#1a1a2e] to-[#0a0a0a]" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#551FBD] rounded-full blur-[128px] opacity-20 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#7B3FDD] rounded-full blur-[128px] opacity-20 animate-pulse delay-1000" />
      </div>

      <main className="flex items-center justify-center min-h-screen py-12 px-4">{children}</main>
    </div>
  )
}
