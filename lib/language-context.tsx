"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"

type Language = "ar" | "en"
type Direction = "rtl" | "ltr"

interface LanguageContextType {
  language: Language
  direction: Direction
  isRTL: boolean
  toggleLanguage: () => void
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Cookie utilities for SSR support
const LANGUAGE_COOKIE_NAME = "preferred_language"
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60 // 1 year in seconds

function setCookie(name: string, value: string, maxAge: number) {
  if (typeof document !== "undefined") {
    document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; SameSite=Lax`
  }
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`))
  return match ? match[2] : null
}

export const translations = {
  ar: {
    // Navigation
    "nav.home": "الصفحة الرئيسية",
    "nav.certificates": "الشهادات",
    "nav.services": "الخدمات",
    "nav.features": "المميزات",
    "nav.about": "من نحن",
    "nav.courses": "دوراتنا",
    "nav.blog": "المدونة",
    "nav.community": "الدخول إلى المجتمع",

    // Courses Page
    "courses.title": "الدورات",
    "courses.subtitle":
      "اكتشف قوة الابتكار والتفكير الإبداعي مع دوراتنا المخصصة! في عالمنا اليوم، التفكير خارج الصندوق أصبح هو السبيل للتفوق والابتكار.",
    "courses.cta": "جاهز لبدء رحلتك؟",
    "courses.cta.subtitle": "انضم الآن إلى مجتمعنا واحصل على أحدث المحتويات والموارد",
    "courses.cta.button": "ابدأ الآن",
    "courses.more": "اعرف المزيد",

    // Course Details
    "course.overview": "نظرة عامة",
    "course.target": "الفئة المستهدفة",
    "course.syllabus": "المخطط التفصيلي للدورة",
    "course.pricing": "التكاليف المالية",
    "course.instructor": "المدرب:",
    "course.get.material": "احصل على المادة التحضيرية",
    "course.get.material.now": "احصل على المادة التحضيرية الآن",

    // Course Types
    "course.cinp": "محترف الابتكار المعتمد",
    "course.cins": "استراتيجي الابتكار المعتمد",
    "course.cdtp": "محترف التفكير التصميمي المعتمد",
    "course.ccino": "الرئيس التنفيذي للابتكار المعتمد",
    "course.aina": "مقيم الابتكار المعتمد",

    // Student Dashboard
    "student.dashboard": "لوحة التحكم",
    "student.my.courses": "دوراتي",
    "student.in.progress": "قيد التنفيذ",
    "student.completed": "مكتملة",
    "student.profile": "الملف الشخصي",
    "student.certificates": "الشهادات",
    "student.settings": "الإعدادات",
    "student.logout": "تسجيل الخروج",
    "student.progress": "التقدم",
    "student.lessons": "الدروس",
    "student.quiz.pending": "اختبار قيد الانتظار",
    "student.completed.lessons": "دروس مكتملة",

    // Authentication
    "auth.login": "تسجيل الدخول",
    "auth.register": "إنشاء حساب",
    "auth.email": "البريد الإلكتروني",
    "auth.password": "كلمة المرور",
    "auth.first.name": "الاسم الأول",
    "auth.last.name": "الاسم الأخير",
    "auth.remember.me": "تذكرني",
    "auth.forgot.password": "هل نسيت كلمة المرور؟",
    "auth.dont.have.account": "ليس لديك حساب؟",
    "auth.have.account": "هل لديك حساب؟",
  },
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.certificates": "Certificates",
    "nav.services": "Services",
    "nav.features": "Features",
    "nav.about": "About Us",
    "nav.courses": "Our Courses",
    "nav.blog": "Blog",
    "nav.community": "Join Community",

    // Courses Page
    "courses.title": "Courses",
    "courses.subtitle":
      "Discover the power of innovation and creative thinking with our specialized courses! In our world today, thinking outside the box is the key to excellence and innovation.",
    "courses.cta": "Ready to start your journey?",
    "courses.cta.subtitle": "Join our community now and get the latest content and resources",
    "courses.cta.button": "Get Started",
    "courses.more": "Learn More",

    // Course Details
    "course.overview": "Overview",
    "course.target": "Target Audience",
    "course.syllabus": "Course Syllabus",
    "course.pricing": "Pricing",
    "course.instructor": "Instructor:",
    "course.get.material": "Get Preparation Material",
    "course.get.material.now": "Get Preparation Material Now",

    // Course Types
    "course.cinp": "Certified Innovation Professional",
    "course.cins": "Certified Innovation Strategist",
    "course.cdtp": "Certified Design Thinking Professional",
    "course.ccino": "Certified Chief Innovation Officer",
    "course.aina": "Accredited Innovation Assessor",

    // Student Dashboard
    "student.dashboard": "Dashboard",
    "student.my.courses": "My Courses",
    "student.in.progress": "In Progress",
    "student.completed": "Completed",
    "student.profile": "Profile",
    "student.certificates": "Certificates",
    "student.settings": "Settings",
    "student.logout": "Logout",
    "student.progress": "Progress",
    "student.lessons": "Lessons",
    "student.quiz.pending": "Pending Quiz",
    "student.completed.lessons": "Completed Lessons",

    // Authentication
    "auth.login": "Login",
    "auth.register": "Sign Up",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.first.name": "First Name",
    "auth.last.name": "Last Name",
    "auth.remember.me": "Remember me",
    "auth.forgot.password": "Forgot password?",
    "auth.dont.have.account": "Don't have an account?",
    "auth.have.account": "Already have an account?",
  },
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("ar")
  const [isClient, setIsClient] = useState(false)

  // Derived values
  const direction: Direction = language === "ar" ? "rtl" : "ltr"
  const isRTL = language === "ar"

  // Apply direction and language to document
  const applyLanguageToDocument = useCallback((lang: Language) => {
    if (typeof document !== "undefined") {
      const dir = lang === "ar" ? "rtl" : "ltr"
      document.documentElement.lang = lang
      document.documentElement.dir = dir
      document.documentElement.setAttribute("data-direction", dir)
      document.body.style.direction = dir
      document.body.style.textAlign = lang === "ar" ? "right" : "left"
      
      // Add/remove RTL class for CSS targeting
      if (lang === "ar") {
        document.documentElement.classList.add("rtl")
        document.documentElement.classList.remove("ltr")
      } else {
        document.documentElement.classList.add("ltr")
        document.documentElement.classList.remove("rtl")
      }
    }
  }, [])

  // Initialize language on client
  useEffect(() => {
    setIsClient(true)
    
    // Priority: Cookie > localStorage > default (ar)
    const cookieLang = getCookie(LANGUAGE_COOKIE_NAME) as Language | null
    const storedLang = typeof localStorage !== "undefined" 
      ? localStorage.getItem("language") as Language | null 
      : null
    
    const savedLang = cookieLang || storedLang || "ar"
    
    if (savedLang && (savedLang === "ar" || savedLang === "en")) {
      setLanguageState(savedLang)
      applyLanguageToDocument(savedLang)
    } else {
      applyLanguageToDocument("ar")
    }
  }, [applyLanguageToDocument])

  // Set specific language
  const setLanguage = useCallback((newLang: Language) => {
    setLanguageState(newLang)
    
    // Persist to both localStorage and cookie
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("language", newLang)
    }
    setCookie(LANGUAGE_COOKIE_NAME, newLang, COOKIE_MAX_AGE)
    
    applyLanguageToDocument(newLang)
  }, [applyLanguageToDocument])

  // Toggle between languages
  const toggleLanguage = useCallback(() => {
    const newLanguage = language === "ar" ? "en" : "ar"
    setLanguage(newLanguage)
  }, [language, setLanguage])

  // Translation function with fallback
  const t = useCallback((key: string): string => {
    const translation = translations[language][key as keyof (typeof translations)["ar"]]
    return translation || key
  }, [language])

  const contextValue: LanguageContextType = {
    language,
    direction,
    isRTL,
    toggleLanguage,
    setLanguage,
    t,
  }

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    // Return default values for SSR or when used outside provider
    return {
      language: "ar" as Language,
      direction: "rtl" as Direction,
      isRTL: true,
      toggleLanguage: () => {},
      setLanguage: () => {},
      t: (key: string) => key,
    }
  }
  return context
}

// Custom hook for RTL-aware styling
export function useRTL() {
  const { isRTL, direction } = useLanguage()
  
  return {
    isRTL,
    direction,
    // Utility for conditional classes based on direction
    rtlClass: (rtlValue: string, ltrValue: string) => isRTL ? rtlValue : ltrValue,
    // Utility for inline styles
    rtlStyle: (rtlStyle: React.CSSProperties, ltrStyle: React.CSSProperties) => isRTL ? rtlStyle : ltrStyle,
    // Common directional utilities
    textAlign: isRTL ? "right" as const : "left" as const,
    flexDirection: isRTL ? "row-reverse" as const : "row" as const,
    marginStart: isRTL ? "marginRight" : "marginLeft",
    marginEnd: isRTL ? "marginLeft" : "marginRight",
    paddingStart: isRTL ? "paddingRight" : "paddingLeft",
    paddingEnd: isRTL ? "paddingLeft" : "paddingRight",
  }
}
