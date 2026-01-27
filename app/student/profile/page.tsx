"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Edit2, Save, Camera, Shield, Bell } from 'lucide-react'

export default function ProfilePage() {
  const { student } = useAuth()
  const { t } = useLanguage()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: student?.firstName || "",
    lastName: student?.lastName || "",
    email: student?.email || "",
    phone: student?.phone || "",
    bio: "مهتم بالابتكار والتفكير الإبداعي",
    organization: "",
    country: "السعودية",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSave = () => {
    // TODO: Update student profile via LearnWorld API
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="glass-border overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-secondary h-32" />
        <div className="px-6 pb-6 -mt-16 relative z-10">
          <div className="flex items-end gap-4 mb-6">
            <div className="relative">
              <Avatar className="w-32 h-32 border-4 border-background">
                <AvatarImage src={student?.profileImage || "/placeholder.svg"} />
                <AvatarFallback className="text-2xl">
                  {student?.firstName?.[0]}
                </AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full hover:bg-primary/80">
                <Camera size={20} />
              </button>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold">
                {student?.firstName} {student?.lastName}
              </h1>
              <p className="text-muted-foreground">{student?.email}</p>
            </div>
            <Button
              variant={isEditing ? "secondary" : "default"}
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              className="gap-2"
            >
              {isEditing ? (
                <>
                  <Save size={20} />
                  حفظ التغييرات
                </>
              ) : (
                <>
                  <Edit2 size={20} />
                  تعديل الملف الشخصي
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="general" className="glass-border p-6 rounded-xl">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">المعلومات العامة</TabsTrigger>
          <TabsTrigger value="security">الأمان</TabsTrigger>
          <TabsTrigger value="notifications">الإشعارات</TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("auth.first.name")}</Label>
              <Input
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("auth.last.name")}</Label>
              <Input
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("auth.email")}</Label>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>رقم الهاتف</Label>
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="+966 5X XXX XXXX"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>جهة العمل</Label>
              <Input
                name="organization"
                value={formData.organization}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="أدخل اسم جهة العمل"
              />
            </div>
            <div className="space-y-2">
              <Label>الدولة</Label>
              <Input
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>النبذة الشخصية</Label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full min-h-24 p-3 border border-border rounded-lg bg-background disabled:opacity-50"
              placeholder="اكتب نبذة عن نفسك..."
            />
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6 mt-6">
          <Card className="glass-border p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="font-bold mb-1">كلمة المرور</h3>
                <p className="text-sm text-muted-foreground">
                  غيّر كلمة المرور الخاصة بك بانتظام
                </p>
              </div>
              <Button variant="outline" className="gap-2">
                <Shield size={16} />
                تغيير كلمة المرور
              </Button>
            </div>
          </Card>

          <Card className="glass-border p-6">
            <h3 className="font-bold mb-4">جلسات النشاط</h3>
            <div className="space-y-3">
              <div className="flex items-start justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-semibold text-sm">جهاز الكمبيوتر الحالي</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    آخر استخدام: الآن
                  </p>
                </div>
                <span className="text-xs font-semibold text-green-500">نشط</span>
              </div>
              <div className="flex items-start justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-semibold text-sm">الهاتف الذكي</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    آخر استخدام: منذ يومين
                  </p>
                </div>
                <Button variant="ghost" size="sm" className="text-destructive">
                  تسجيل الخروج
                </Button>
              </div>
            </div>
          </Card>

          <Card className="glass-border p-6 border-destructive/50">
            <h3 className="font-bold text-destructive mb-2">حذف الحساب</h3>
            <p className="text-sm text-muted-foreground mb-4">
              حذف حسابك والبيانات المرتبطة به بشكل دائم
            </p>
            <Button variant="destructive">حذف الحساب</Button>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6 mt-6">
          <Card className="glass-border p-6">
            <h3 className="font-bold mb-6">تفضيلات الإشعارات</h3>
            <div className="space-y-4">
              {[
                { id: "email-updates", label: "رسائل البريد الإلكتروني التعليمية" },
                { id: "course-updates", label: "تحديثات الدورات الجديدة" },
                { id: "quiz-reminders", label: "تذكيرات الاختبارات" },
                { id: "certificate-ready", label: "إشعارات الشهادات الجاهزة" },
              ].map((item) => (
                <label key={item.id} className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </label>
              ))}
            </div>
          </Card>

          <Card className="glass-border p-6">
            <h3 className="font-bold mb-4">قنوات الإشعارات</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-semibold text-sm">البريد الإلكتروني</p>
                  <p className="text-xs text-muted-foreground">{student?.email}</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4" />
              </div>
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-semibold text-sm">WhatsApp</p>
                  <p className="text-xs text-muted-foreground">
                    {student?.phone || "لم يتم إضافة رقم"}
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  ربط WhatsApp
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
