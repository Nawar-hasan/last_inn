"use client"

import { useRouter, usePathname } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

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
    <button
      onClick={handleBack}
      className="fixed top-24 right-4 z-40 group cursor-pointer"
      aria-label={isArabic ? "رجوع للخلف" : "Go back"}
    >
      {/* Outer glow */}
      <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-md group-hover:blur-lg transition-all duration-300 scale-110 group-hover:scale-125" />
      
      {/* Main button with 3D effect */}
      <div 
        className="relative h-12 w-12 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-active:scale-95"
        style={{
          background: 'linear-gradient(145deg, #7C3AED 0%, #551FBD 50%, #4C1D95 100%)',
          boxShadow: `
            0 6px 24px rgba(124, 58, 237, 0.4),
            0 3px 12px rgba(0, 0, 0, 0.2),
            inset 0 2px 4px rgba(255, 255, 255, 0.2),
            inset 0 -2px 4px rgba(0, 0, 0, 0.2)
          `,
        }}
      >
        {/* Inner highlight */}
        <div className="absolute inset-1 rounded-full bg-gradient-to-b from-white/15 to-transparent pointer-events-none" />
        
        {/* Arrow icon - rotated for RTL */}
        <ArrowLeft 
          className={`h-5 w-5 text-white drop-shadow-md transition-transform duration-300 group-hover:-translate-x-0.5 ${isArabic ? "rotate-180 group-hover:translate-x-0.5" : ""}`}
        />
      </div>
    </button>
  )
}
