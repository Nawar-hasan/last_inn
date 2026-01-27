"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Bell, LogIn, User, ChevronDown } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageToggle } from "@/components/language-toggle"
import { useLanguage } from "@/lib/language-context"
import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function SiteHeader() {
  const { language, t } = useLanguage()
  const { isAuthenticated, student, logout } = useAuth()
  const router = useRouter()
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)

  const isArabic = language === "ar"

  const mainLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/courses", label: t("nav.certificates") },
    { href: "/#services", label: t("nav.services"), scroll: true },
    { href: "/blog", label: t("nav.blog") },
    { href: "/about-us", label: t("nav.about") },
  ]

  const notifications = [
    {
      id: 1,
      text: isArabic ? "تم قبول شهادتك" : "Your certificate has been approved",
      read: false,
      time: isArabic ? "منذ 5 دقائق" : "5 min ago",
    },
    {
      id: 2,
      text: isArabic ? "دورة جديدة متاحة" : "New course available",
      read: false,
      time: isArabic ? "منذ ساعة" : "1 hour ago",
    },
    {
      id: 3,
      text: isArabic ? "تم تحديث درجاتك" : "Your grades have been updated",
      read: true,
      time: isArabic ? "منذ يومين" : "2 days ago",
    },
  ]

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleServicesClick = (e: React.MouseEvent) => {
    e.preventDefault()
    
    // Check if we're on the home page
    const isHomePage = window.location.pathname === "/" || window.location.pathname === ""
    
    if (isHomePage) {
      // If on home page, scroll to services section
      const servicesSection = document.getElementById("services")
      if (servicesSection) {
        servicesSection.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    } else {
      // If on another page, navigate to home page with hash
      router.push("/#services")
      // After navigation, scroll to services (with delay to allow page load)
      setTimeout(() => {
        const servicesSection = document.getElementById("services")
        if (servicesSection) {
          servicesSection.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      }, 500)
    }
  }

  return (
    <header className="sticky top-0 z-50 p-4" dir={isArabic ? "rtl" : "ltr"}>
      <div className="container mx-auto max-w-7xl">
        <div className="flex h-16 items-center justify-between px-6 liquid-glass-header rounded-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 cursor-pointer">
            <Image src="/logo.png" alt="innovologia" width={160} height={40} className="h-8 w-auto" priority />
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden items-center gap-8 text-sm md:flex mx-auto"
            style={{ fontFamily: "var(--font-rubik)" }}
          >
            {mainLinks.map((link) =>
              link.scroll ? (
                <button
                  key={link.href}
                  onClick={handleServicesClick}
                  className="text-foreground font-semibold hover:text-[#53FBA1] dark:hover:text-[#53FBA1] transition-all duration-300 hover:scale-105 tracking-wide cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#53FBA1] focus:ring-offset-2 rounded-md px-2 py-1"
                >
                  {link.label}
                </button>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-foreground font-semibold hover:text-[#53FBA1] dark:hover:text-[#53FBA1] transition-all duration-300 hover:scale-105 tracking-wide cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#53FBA1] focus:ring-offset-2 rounded-md px-2 py-1"
                >
                  {link.label}
                </Link>
              ),
            )}
          </nav>

          {/* Right Section - Actions */}
          <div className={`flex items-center gap-3 ${isArabic ? "flex-row-reverse" : ""}`}>
            {isAuthenticated && (
              <DropdownMenu open={notificationsOpen} onOpenChange={setNotificationsOpen}>
                <DropdownMenuTrigger asChild>
                  <button
                    className="relative p-2.5 hover:bg-[#551FBD]/10 rounded-full transition-all duration-300 hover:scale-110 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#551FBD] focus:ring-offset-2"
                    aria-label={isArabic ? "الإشعارات" : "Notifications"}
                  >
                    <Bell size={20} className="text-foreground" />
                    {notifications.some((n) => !n.read) && (
                      <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse border border-background" />
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align={isArabic ? "end" : "start"}
                  className="w-96 bg-white dark:bg-black/98 border-[#551FBD]/40 backdrop-blur-xl shadow-2xl shadow-[#551FBD]/20 p-0"
                  dir={isArabic ? "rtl" : "ltr"}
                >
                  <div className="p-4 border-b border-[#551FBD]/30">
                    <h3
                      className="text-lg font-bold text-[#551FBD] dark:text-[#B388FF]"
                      style={{ fontFamily: "var(--font-rubik)" }}
                    >
                      {isArabic ? "الإشعارات" : "Notifications"}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {notifications.filter((n) => !n.read).length} {isArabic ? "إشعارات جديدة" : "new notifications"}
                    </p>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-4 border-b border-[#551FBD]/10 hover:bg-[#551FBD]/10 transition-colors cursor-pointer ${
                          !notif.read ? "bg-[#551FBD]/5" : ""
                        }`}
                      >
                        <div className={`flex items-start gap-3 ${isArabic ? "flex-row-reverse text-right" : ""}`}>
                          <div
                            className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${!notif.read ? "bg-gradient-to-r from-[#551FBD] to-[#B388FF]" : "bg-gray-600"}`}
                          />
                          <div className="flex-1">
                            <p
                              className={`text-sm ${!notif.read ? "font-semibold text-foreground" : "text-muted-foreground"}`}
                            >
                              {notif.text}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">{notif.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t border-[#551FBD]/30">
                    <button className="w-full text-center text-sm text-[#551FBD] dark:text-[#B388FF] hover:text-[#53FBA1] transition-colors font-semibold">
                      {isArabic ? "عرض جميع الإشعارات" : "View all notifications"}
                    </button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <LanguageToggle />
            <ThemeToggle />

            <Button
              asChild
              className="hidden sm:flex bg-[#551FBD] text-white font-bold rounded-full px-6 py-2 h-auto
                         hover:bg-[#551FBD]/90 hover:shadow-[0_0_20px_rgba(85,31,189,0.5)]
                         hover:scale-[1.05] transition-all duration-300
                         border-2 border-[#53FBA1]/20 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#53FBA1] focus:ring-offset-2"
              style={{ fontFamily: "var(--font-rubik)" }}
            >
              <a href="https://community-in.vercel.app" target="_blank" rel="noopener noreferrer">
                {isArabic ? "المجتمع" : "Community"}
              </a>
            </Button>

            {!isAuthenticated ? (
              <Button
                asChild
                variant="outline"
                className="hidden sm:flex rounded-full border-2 px-6 py-2 h-auto
                           hover:bg-foreground/5 transition-all duration-300 bg-transparent cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#551FBD] focus:ring-offset-2"
                style={{ fontFamily: "var(--font-rubik)" }}
              >
                <Link href="/auth/login" className={`flex items-center gap-2 ${isArabic ? "flex-row-reverse" : ""}`}>
                  <LogIn size={16} />
                  {isArabic ? "تسجيل الدخول" : "Login"}
                </Link>
              </Button>
            ) : (
              <DropdownMenu open={accountOpen} onOpenChange={setAccountOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="hidden sm:flex items-center gap-2 rounded-full border-2 border-[#551FBD]/40 px-6 py-2 h-auto
                               hover:bg-[#551FBD]/10 hover:border-[#551FBD] transition-all duration-300 bg-transparent font-semibold cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#551FBD] focus:ring-offset-2"
                    style={{ fontFamily: "var(--font-rubik)" }}
                  >
                    <User size={18} className="text-[#551FBD] dark:text-[#B388FF]" />
                    <span className="text-[#551FBD] dark:text-[#B388FF]">{isArabic ? "حسابي" : "My Account"}</span>
                    <ChevronDown size={16} className="text-[#551FBD] dark:text-[#B388FF]" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  sideOffset={12}
                  className="w-72 bg-white dark:bg-black border-2 border-[#551FBD]/40 shadow-2xl shadow-[#551FBD]/30 p-0 z-[100]"
                  dir={isArabic ? "rtl" : "ltr"}
                >
                  <div className="p-5 text-center border-b border-[#551FBD]/30 bg-gradient-to-br from-[#551FBD]/10 to-[#B388FF]/10">
                    <div className="flex justify-center mb-3">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#551FBD] to-[#B388FF] flex items-center justify-center shadow-lg">
                        <User size={32} className="text-white" />
                      </div>
                    </div>
                    <div
                      className="font-bold text-lg text-[#551FBD] dark:text-[#B388FF]"
                      style={{ fontFamily: "var(--font-rubik)" }}
                    >
                      {student?.firstName || (isArabic ? "الطالب الذهبي" : "Gold Student")}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{student?.email || "student@innovologia.com"}</p>
                  </div>

                  <div className="py-2">
                    <DropdownMenuItem
                      asChild
                      className="cursor-pointer focus:bg-[#551FBD]/20 focus:text-foreground"
                      onSelect={() => {
                        router.push("/student")
                        setAccountOpen(false)
                      }}
                    >
                      <div className="w-full px-5 py-3 hover:bg-[#551FBD]/10 transition-colors text-center cursor-pointer">
                        <span
                          className="text-[#551FBD] dark:text-[#B388FF] font-semibold text-base"
                          style={{ fontFamily: "var(--font-rubik)" }}
                        >
                          {isArabic ? "لوحة التحكم" : "Dashboard"}
                        </span>
                      </div>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      asChild
                      className="cursor-pointer focus:bg-[#551FBD]/20 focus:text-foreground"
                      onSelect={() => {
                        router.push("/student/courses")
                        setAccountOpen(false)
                      }}
                    >
                      <div className="w-full px-5 py-3 hover:bg-[#551FBD]/10 transition-colors text-center cursor-pointer">
                        <span
                          className="text-[#551FBD] dark:text-[#B388FF] font-semibold text-base"
                          style={{ fontFamily: "var(--font-rubik)" }}
                        >
                          {isArabic ? "دوراتي" : "My Courses"}
                        </span>
                      </div>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      asChild
                      className="cursor-pointer focus:bg-[#551FBD]/20 focus:text-foreground"
                      onSelect={() => {
                        router.push("/student/profile")
                        setAccountOpen(false)
                      }}
                    >
                      <div className="w-full px-5 py-3 hover:bg-[#551FBD]/10 transition-colors text-center cursor-pointer">
                        <span
                          className="text-[#551FBD] dark:text-[#B388FF] font-semibold text-base"
                          style={{ fontFamily: "var(--font-rubik)" }}
                        >
                          {isArabic ? "الملف الشخصي" : "Profile"}
                        </span>
                      </div>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      asChild
                      className="cursor-pointer focus:bg-[#551FBD]/20 focus:text-foreground"
                      onSelect={() => {
                        router.push("/student/settings")
                        setAccountOpen(false)
                      }}
                    >
                      <div className="w-full px-5 py-3 hover:bg-[#551FBD]/10 transition-colors text-center cursor-pointer">
                        <span
                          className="text-[#551FBD] dark:text-[#B388FF] font-semibold text-base"
                          style={{ fontFamily: "var(--font-rubik)" }}
                        >
                          {isArabic ? "الإعدادات" : "Settings"}
                        </span>
                      </div>
                    </DropdownMenuItem>
                  </div>

                  <DropdownMenuSeparator className="bg-[#551FBD]/30" />

                  <div className="py-2">
                    <DropdownMenuItem
                      onClick={() => {
                        handleLogout()
                        setAccountOpen(false)
                      }}
                      className="px-5 py-3 hover:bg-red-500/20 focus:bg-red-500/20 transition-colors cursor-pointer text-center w-full"
                    >
                      <span
                        className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 font-semibold text-base"
                        style={{ fontFamily: "var(--font-rubik)" }}
                      >
                        {isArabic ? "تسجيل الخروج" : "Logout"}
                      </span>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile Nav */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="border-border bg-card/80 text-foreground hover:bg-card"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side={isArabic ? "left" : "right"}
                className="liquid-glass border-border p-0 w-64 flex flex-col"
              >
                <div className="flex items-center gap-2 px-4 py-4 border-b border-border">
                  <Image src="/logo.png" alt="innovologia" width={140} height={35} className="h-7 w-auto" />
                </div>

                <nav
                  className="flex flex-col gap-1 mt-2 text-foreground flex-1"
                  style={{ fontFamily: "var(--font-rubik)" }}
                >
                  {mainLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-muted hover:text-[#53FBA1] transition-colors font-semibold cursor-pointer"
                    >
                      <span className="text-sm">{link.label}</span>
                    </Link>
                  ))}
                </nav>

                <div className="border-t border-border p-4 space-y-2">
                  <Button asChild className="w-full" size="sm">
                    <a href="https://community-in.vercel.app" target="_blank" rel="noopener noreferrer">
                      {isArabic ? "المجتمع" : "Community"}
                    </a>
                  </Button>
                  {!isAuthenticated && (
                    <Button asChild variant="outline" className="w-full bg-transparent" size="sm">
                      <Link href="/auth/login">{isArabic ? "تسجيل الدخول" : "Login"}</Link>
                    </Button>
                  )}
                  <div className="flex gap-2 pt-2">
                    <LanguageToggle />
                    <ThemeToggle />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
