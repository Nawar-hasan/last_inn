"use client"

import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"
import { Bell, LogOut, Settings, User, Home } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageToggle } from "@/components/language-toggle"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

export function StudentTopbar() {
  const { student, logout } = useAuth()
  const { language, t } = useLanguage()
  const router = useRouter()
  const isArabic = language === "ar"

  const unreadNotifications = 3

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6 gap-4">
        {/* Left - Greeting and breadcrumb */}
        <div className="flex-1 flex items-center gap-4">
          <h2 className="text-lg font-semibold text-foreground" style={{ fontFamily: "var(--font-rubik)" }}>
            {isArabic ? "مرحباً" : "Welcome"}, {student?.firstName}
          </h2>
          <Link
            href="/"
            className="hidden sm:flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-foreground/5 transition-colors text-sm text-foreground/70 hover:text-foreground cursor-pointer"
            title={isArabic ? "الذهاب للصفحة الرئيسية" : "Go to home page"}
          >
            <Home size={16} />
            <span className="hidden lg:inline">{isArabic ? "الرئيسية" : "Home"}</span>
          </Link>
        </div>

        {/* Right - Actions */}
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="relative p-2 hover:bg-accent/10 rounded-lg transition-colors cursor-pointer"
                aria-label={isArabic ? "الإشعارات" : "Notifications"}
              >
                <Bell size={20} className="text-foreground" />
                {unreadNotifications > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {unreadNotifications}
                  </Badge>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={isArabic ? "end" : "start"} className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>{isArabic ? "الإشعارات" : "Notifications"}</span>
                {unreadNotifications > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {unreadNotifications} {isArabic ? "جديد" : "new"}
                  </Badge>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer flex-col items-start gap-1 py-3">
                <div className="font-medium text-sm">
                  {isArabic ? "تم قبول شهادتك" : "Your certificate has been approved"}
                </div>
                <div className="text-xs text-muted-foreground">{isArabic ? "منذ ساعتين" : "2 hours ago"}</div>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer flex-col items-start gap-1 py-3">
                <div className="font-medium text-sm">{isArabic ? "دورة جديدة متاحة" : "New course is available"}</div>
                <div className="text-xs text-muted-foreground">{isArabic ? "منذ 5 ساعات" : "5 hours ago"}</div>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer flex-col items-start gap-1 py-3">
                <div className="font-medium text-sm">
                  {isArabic ? "تم تحديث درجاتك" : "Your grades have been updated"}
                </div>
                <div className="text-xs text-muted-foreground">{isArabic ? "منذ يوم واحد" : "1 day ago"}</div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  href="/student/notifications"
                  className="cursor-pointer text-center justify-center text-primary font-medium"
                >
                  {isArabic ? "عرض جميع الإشعارات" : "View all notifications"}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme and Language Toggles */}
          <LanguageToggle />
          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="flex items-center gap-2 p-1.5 hover:bg-accent/10 rounded-lg transition-colors cursor-pointer"
                aria-label={isArabic ? "الحساب" : "Account"}
              >
                <Avatar className="h-9 w-9 border-2 border-primary/20">
                  <AvatarFallback className="text-xs font-bold bg-gradient-to-br from-[#551FBD] to-[#7B3FDD] text-white">
                    {student?.firstName?.[0]}
                    {student?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={isArabic ? "start" : "end"} className="w-64">
              <DropdownMenuLabel className="flex items-center gap-3 py-3">
                <Avatar className="h-12 w-12 border-2 border-primary/30">
                  <AvatarFallback className="text-sm font-bold bg-gradient-to-br from-[#551FBD] to-[#7B3FDD] text-white">
                    {student?.firstName?.[0]}
                    {student?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">
                    {student?.firstName} {student?.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{student?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/student/profile" className="flex items-center gap-3 cursor-pointer py-2.5">
                  <User size={18} />
                  <span>{isArabic ? "الملف الشخصي" : "Profile"}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/student/settings" className="flex items-center gap-3 cursor-pointer py-2.5">
                  <Settings size={18} />
                  <span>{isArabic ? "الإعدادات" : "Settings"}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer text-destructive focus:text-destructive py-2.5"
              >
                <LogOut size={18} />
                <span className="font-medium">{isArabic ? "تسجيل الخروج" : "Logout"}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
