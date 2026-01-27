"use client"

import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, BookOpen, Award, Settings, LogOut, Menu, X, ExternalLink } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import Image from "next/image"

export function StudentSidebar() {
  const { logout } = useAuth()
  const { language, t } = useLanguage()
  const pathname = usePathname()
  const router = useRouter()
  const isArabic = language === "ar"
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    { icon: LayoutDashboard, label: t("student.dashboard"), href: "/student", id: "dashboard" },
    { icon: BookOpen, label: t("student.my.courses"), href: "/student/courses", id: "courses" },
    { icon: Award, label: t("student.certificates"), href: "/student/certificates", id: "certificates" },
    { icon: Settings, label: t("student.settings"), href: "/student/settings", id: "settings" },
  ]

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/")

  const handleLogout = async () => {
    await logout()
    setIsOpen(false)
    router.push("/")
  }

  return (
    <>
      {/* Mobile Toggle */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-card border border-border rounded-lg hover:bg-card/80 transition-colors shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isArabic ? "قائمة" : "Menu"}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 fixed md:sticky top-0 ${isArabic ? "right-0" : "left-0"} w-64 h-screen md:h-[calc(100vh-2rem)] bg-card border-${isArabic ? "l" : "r"} border-border liquid-glass-subtle flex flex-col z-40 md:rounded-xl md:my-4 md:ml-4 overflow-hidden`}
        dir={isArabic ? "rtl" : "ltr"}
      >
        {/* Logo Area - استبدال النص باللوغو */}
        <div className="p-6 border-b border-border flex items-center justify-center">
          <Link href="/" className="block">
            <Image src="/logo.png" alt="Innovologia Logo" width={160} height={40} className="h-10 w-auto" priority />
          </Link>
        </div>

        {/* Navigation - إضافة مسافات بين العناصر */}
        <nav className="flex-1 p-4 space-y-3">
          {menuItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                <Button
                  variant={active ? "default" : "ghost"}
                  className={`w-full justify-start gap-3 font-medium transition-all ${
                    active
                      ? "bg-gradient-to-r from-[#551FBD] to-[#7B3FDD] text-white hover:opacity-90 shadow-lg shadow-[#551FBD]/30"
                      : "hover:bg-foreground/10 text-foreground"
                  }`}
                  style={{ fontFamily: "var(--font-rubik)" }}
                >
                  <Icon size={20} className="flex-shrink-0" />
                  <span>{item.label}</span>
                </Button>
              </Link>
            )
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-border space-y-3">
          <Link href="/" onClick={() => setIsOpen(false)} className="w-full block">
            <Button
              variant="outline"
              className="w-full justify-start gap-3 text-[#551FBD] hover:text-[#551FBD] hover:bg-[#551FBD]/10 bg-transparent border-[#551FBD]/30"
              style={{ fontFamily: "var(--font-rubik)" }}
            >
              <ExternalLink size={20} />
              <span>{isArabic ? "العودة للرئيسية" : "Back to Home"}</span>
            </Button>
          </Link>

          <div className="text-xs text-foreground/60 px-2">{isArabic ? "إدارة الحساب" : "Account"}</div>
          <Button
            variant="outline"
            className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10 bg-transparent border-destructive/30"
            onClick={handleLogout}
            style={{ fontFamily: "var(--font-rubik)" }}
          >
            <LogOut size={20} />
            <span>{t("student.logout")}</span>
          </Button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && <div className="fixed inset-0 bg-black/50 md:hidden z-30" onClick={() => setIsOpen(false)} />}
    </>
  )
}
