"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/language-context"
import { useAuth } from "@/lib/auth-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Globe, Moon, Sun } from 'lucide-react'
import { useTheme } from "@/components/theme-provider"
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const { t, language, toggleLanguage } = useLanguage()
  const { theme, setTheme } = useTheme()
  const { logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold mb-2">{t("student.settings")}</h1>
        <p className="text-muted-foreground">
          أدِر إعداداتك وتفضيلاتك الشخصية
        </p>
      </div>

      <Tabs defaultValue="appearance" className="glass-border p-6 rounded-xl">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="appearance">المظهر</TabsTrigger>
          <TabsTrigger value="language">اللغة</TabsTrigger>
          <TabsTrigger value="account">الحساب</TabsTrigger>
        </TabsList>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="space-y-6 mt-6">
          <Card className="glass-border p-6">
            <h3 className="font-bold mb-6">مظهر التطبيق</h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: "light", label: "فاتح", icon: Sun },
                { value: "dark", label: "داكن", icon: Moon },
                { value: "system", label: "النظام", icon: Globe },
              ].map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setTheme(value)}
                  className={`p-4 rounded-lg border-2 transition-colors flex flex-col items-center gap-2 ${
                    theme === value
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <Icon size={24} />
                  <span className="text-sm font-medium">{label}</span>
                </button>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Language Tab */}
        <TabsContent value="language" className="space-y-6 mt-6">
          <Card className="glass-border p-6">
            <h3 className="font-bold mb-6">لغة التطبيق</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { code: "ar", name: "العربية" },
                { code: "en", name: "English" },
              ].map(({ code, name }) => (
                <button
                  key={code}
                  onClick={language === code ? undefined : toggleLanguage}
                  className={`p-4 rounded-lg border-2 transition-colors text-center ${
                    language === code
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50 cursor-pointer"
                  }`}
                >
                  <p className="font-bold">{name}</p>
                </button>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Account Tab */}
        <TabsContent value="account" className="space-y-6 mt-6">
          <Card className="glass-border p-6">
            <h3 className="font-bold mb-4">تسجيل الخروج</h3>
            <p className="text-sm text-muted-foreground mb-4">
              قم بتسجيل الخروج من حسابك على هذا الجهاز
            </p>
            <Button variant="outline" onClick={handleLogout}>
              تسجيل الخروج
            </Button>
          </Card>

          <Card className="glass-border p-6 border-destructive/50">
            <div className="flex gap-3">
              <AlertCircle className="text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-destructive mb-2">منطقة الخطر</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  إجراءات حساب دائمة لا يمكن التراجع عنها
                </p>
                <Button variant="destructive" size="sm">
                  حذف الحساب بشكل دائم
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
