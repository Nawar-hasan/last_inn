"use client"

import React from "react"

import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/language-context"
import { useAuth } from "@/lib/auth-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Download, Mail, Share2, CheckCircle2, Loader2, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useToast } from "@/hooks/use-toast"

interface CertificateData {
  id: string
  courseTitle: string
  courseTitleEn: string
  studentName: string
  issueDate: string
  certificateNumber: string
  validUntil: string | null
  instructor: string
  downloadUrl?: string
  verifyUrl?: string
}

export default function CertificatePage({ params }: { params: { id: string } }) {
  const { t, language } = useLanguage()
  const { student, user, isAuthenticated } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const isArabic = language === "ar"
  
  const currentUser = user || student
  
  const [step, setStep] = useState<"loading" | "form" | "preview" | "success" | "already-issued">("loading")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [existingCertificate, setExistingCertificate] = useState<CertificateData | null>(null)
  const [courseData, setCourseData] = useState<any>(null)
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    organization: "",
  })

  // جلب بيانات الدورة والتحقق من وجود شهادة
  useEffect(() => {
    if (!isAuthenticated || !currentUser) {
      router.push("/login")
      return
    }

    const fetchData = async () => {
      try {
        // جلب بيانات الدورة
        const courseResponse = await fetch(`/api/courses/${params.id}`)
        if (courseResponse.ok) {
          const courseResult = await courseResponse.json()
          setCourseData(courseResult.course || courseResult)
        }

        // التحقق من وجود شهادة مسبقة
        const certResponse = await fetch(`/api/student/certificates?userId=${currentUser.id}`, {
          credentials: "include",
        })
        
        if (certResponse.ok) {
          const certData = await certResponse.json()
          const certificates = certData.certificates || certData.data || []
          
          // البحث عن شهادة لهذه الدورة
          const existing = certificates.find((c: any) => 
            c.courseId === params.id || c.course_id === params.id
          )
          
          if (existing) {
            setExistingCertificate({
              id: existing.id,
              courseTitle: existing.courseName || existing.course_name,
              courseTitleEn: existing.courseNameEn || existing.course_name_en,
              studentName: `${currentUser.firstName} ${currentUser.lastName}`,
              issueDate: existing.issuedAt || existing.issued_at,
              certificateNumber: existing.certificateNumber || existing.certificate_number,
              validUntil: existing.expiresAt || existing.expires_at,
              instructor: existing.instructorName || existing.instructor_name || "",
              downloadUrl: existing.downloadUrl || existing.download_url,
              verifyUrl: existing.verifyUrl || existing.verify_url,
            })
            setStep("already-issued")
            return
          }
        }

        // تعبئة بيانات النموذج
        setFormData({
          fullName: `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim(),
          email: currentUser.email || "",
          phone: "",
          organization: "",
        })
        
        setStep("form")
      } catch (error) {
        console.error("Error fetching data:", error)
        setStep("form")
      }
    }

    fetchData()
  }, [isAuthenticated, currentUser, params.id, router])

  // بيانات الشهادة للعرض
  const certificate: CertificateData = existingCertificate || {
    id: `CERT-${params.id}`,
    courseTitle: courseData?.title || courseData?.titleAr || "الدورة التدريبية",
    courseTitleEn: courseData?.titleEn || courseData?.title || "Training Course",
    studentName: formData.fullName,
    issueDate: new Date().toLocaleDateString(isArabic ? "ar-SA" : "en-US"),
    certificateNumber: `INNO-${Date.now().toString(36).toUpperCase()}`,
    validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString(isArabic ? "ar-SA" : "en-US"),
    instructor: courseData?.instructor?.name || courseData?.instructor || "Innovologia",
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep("preview")
  }

  const handleConfirm = async () => {
    if (!currentUser) return
    
    setIsSubmitting(true)
    try {
      // طلب إصدار الشهادة من LearnWorlds API
      const response = await fetch("/api/certificates/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          userId: currentUser.id,
          courseId: params.id,
          ...formData,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "فشل في إصدار الشهادة")
      }

      const result = await response.json()
      
      if (result.certificate) {
        setExistingCertificate({
          ...certificate,
          certificateNumber: result.certificate.certificateNumber || result.certificate.certificate_number,
          downloadUrl: result.certificate.downloadUrl || result.certificate.download_url,
          verifyUrl: result.certificate.verifyUrl || result.certificate.verify_url,
        })
      }

      toast({
        title: isArabic ? "تم إصدار الشهادة" : "Certificate Issued",
        description: isArabic ? "تم إصدار شهادتك بنجاح" : "Your certificate has been issued successfully",
      })
      
      setStep("success")
    } catch (error: any) {
      console.error("Certificate request error:", error)
      toast({
        variant: "destructive",
        title: isArabic ? "خطأ" : "Error",
        description: error.message || (isArabic ? "فشل في إصدار الشهادة" : "Failed to issue certificate"),
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDownload = () => {
    if (certificate.downloadUrl) {
      window.open(certificate.downloadUrl, "_blank")
    } else {
      toast({
        title: isArabic ? "غير متاح" : "Not Available",
        description: isArabic ? "رابط التحميل غير متاح حالياً" : "Download link is not available yet",
      })
    }
  }

  const handleShare = async () => {
    const shareText = isArabic
      ? `لقد حصلت على شهادة "${certificate.courseTitle}" من Innovologia!`
      : `I've earned the "${certificate.courseTitleEn}" certificate from Innovologia!`
    
    const shareUrl = certificate.verifyUrl || `${window.location.origin}/verify/${certificate.certificateNumber}`

    try {
      if (navigator.share) {
        await navigator.share({
          title: certificate.courseTitle,
          text: shareText,
          url: shareUrl,
        })
      } else {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`)
        toast({
          title: isArabic ? "تم نسخ الرابط" : "Link Copied",
          description: isArabic ? "تم نسخ رابط الشهادة للمشاركة" : "Certificate link copied to clipboard",
        })
      }
    } catch (err) {
      // المستخدم ألغى المشاركة
    }
  }

  // حالة التحميل
  if (step === "loading") {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="glass-border p-12 text-center">
          <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">
            {isArabic ? "جارٍ التحميل..." : "Loading..."}
          </p>
        </Card>
      </div>
    )
  }

  // الشهادة موجودة مسبقاً
  if (step === "already-issued" && existingCertificate) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="glass-border-enhanced p-12 rounded-xl text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle2 size={40} className="text-green-500" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">
            {isArabic ? "لديك شهادة بالفعل" : "You Already Have This Certificate"}
          </h1>
          <p className="text-muted-foreground mb-8">
            {isArabic 
              ? "تم إصدار شهادتك مسبقاً لهذه الدورة"
              : "Your certificate for this course has already been issued"}
          </p>

          <div className="bg-primary/10 border border-primary/30 rounded-lg p-6 mb-8 text-right space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">{isArabic ? "رقم الشهادة" : "Certificate Number"}</p>
              <p className="font-bold text-lg font-mono">{existingCertificate.certificateNumber}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{isArabic ? "تاريخ الإصدار" : "Issue Date"}</p>
              <p className="font-semibold">
                {new Date(existingCertificate.issueDate).toLocaleDateString(isArabic ? "ar-SA" : "en-US")}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="gap-2 bg-transparent" onClick={handleDownload}>
              <Download size={20} />
              {isArabic ? "تحميل" : "Download"}
            </Button>
            <Button variant="outline" className="gap-2 bg-transparent" onClick={handleShare}>
              <Share2 size={20} />
              {isArabic ? "مشاركة" : "Share"}
            </Button>
            <Button onClick={() => router.push("/student/certificates")}>
              {isArabic ? "عرض جميع الشهادات" : "View All Certificates"}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (step === "form") {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="glass-border-enhanced p-8 rounded-xl text-center">
          <h1 className="text-3xl font-bold mb-2">طلب شهادة الإكمال</h1>
          <p className="text-muted-foreground">
            ملء البيانات أدناه لإصدار شهادتك الرسمية
          </p>
        </div>

        <Card className="glass-border p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">الاسم الكامل</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="أدخل الاسم الكامل"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="أدخل البريد الإلكتروني"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">رقم الهاتف</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="أدخل رقم الهاتف"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="organization">جهة العمل</Label>
                <Input
                  id="organization"
                  name="organization"
                  value={formData.organization}
                  onChange={handleInputChange}
                  placeholder="أدخل جهة العمل"
                />
              </div>
            </div>

            <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
              <p className="text-sm">
                ستتلقى شهادتك الرسمية برقم تسلسلي فريد ويمكن التحقق منها عبر الإنترنت
              </p>
            </div>

            <div className="flex gap-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                إلغاء
              </Button>
              <Button type="submit" className="flex-1">
                عرض معاينة
              </Button>
            </div>
          </form>
        </Card>
      </div>
    )
  }

  if (step === "preview") {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="glass-border-enhanced p-8 rounded-xl text-center">
          <h1 className="text-3xl font-bold mb-2">معاينة الشهادة</h1>
          <p className="text-muted-foreground">
            تحقق من البيانات أدناه قبل تأكيد الطلب
          </p>
        </div>

        {/* Certificate Preview */}
        <Card className="glass-border p-12 bg-gradient-to-b from-amber-50 to-amber-100 dark:from-amber-950/20 dark:to-amber-900/10 aspect-video flex flex-col justify-center items-center">
          <div className="text-center space-y-8">
            {/* Header */}
            <div className="space-y-2">
              <div className="text-amber-900 dark:text-amber-100 text-sm font-semibold tracking-widest">
                INNOVOLOGIA INTERNATIONAL
              </div>
              <div className="text-amber-900 dark:text-amber-100 text-lg font-bold">
                شهادة إكمال
              </div>
              <div className="text-amber-900 dark:text-amber-100 text-sm">
                Certificate of Completion
              </div>
            </div>

            {/* Main Content */}
            <div className="space-y-4">
              <p className="text-amber-900 dark:text-amber-100 text-sm">
                This is to certify that
              </p>
              <p className="text-amber-900 dark:text-amber-100 text-3xl font-bold">
                {certificate.studentName}
              </p>
              <p className="text-amber-900 dark:text-amber-100 text-sm">
                has successfully completed the course
              </p>
              <p className="text-amber-900 dark:text-amber-100 text-2xl font-bold italic">
                {certificate.courseTitle}
              </p>
            </div>

            {/* Footer */}
            <div className="grid grid-cols-3 gap-8 text-amber-900 dark:text-amber-100 text-xs">
              <div>
                <p className="font-semibold mb-2">Certificate No.</p>
                <p>{certificate.certificateNumber}</p>
              </div>
              <div>
                <p className="font-semibold mb-2">Issue Date</p>
                <p>{certificate.issueDate}</p>
              </div>
              <div>
                <p className="font-semibold mb-2">Valid Until</p>
                <p>{certificate.validUntil}</p>
              </div>
            </div>

            <div className="pt-8 border-t border-amber-900/20">
              <p className="text-amber-900 dark:text-amber-100 text-sm font-semibold">
                {certificate.instructor}
              </p>
              <p className="text-amber-900 dark:text-amber-100 text-xs">Instructor</p>
            </div>
          </div>
        </Card>

        {/* Confirmation */}
        <Card className="glass-border p-6 space-y-4">
          <h3 className="font-bold">تفاصيل الطلب</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">الاسم الكامل</span>
              <span className="font-semibold">{certificate.studentName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">البريد الإلكتروني</span>
              <span className="font-semibold">{formData.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">الدورة</span>
              <span className="font-semibold">{certificate.courseTitle}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">رقم الشهادة</span>
              <span className="font-semibold">{certificate.certificateNumber}</span>
            </div>
          </div>
        </Card>

        <div className="flex gap-4">
          <Button variant="outline" onClick={() => setStep("form")}>
            تعديل البيانات
          </Button>
          <Button onClick={handleConfirm} className="flex-1">
            تأكيد الطلب
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="glass-border-enhanced p-12 rounded-xl text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
            <CheckCircle2 size={40} className="text-green-500" />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-2">تم تقديم الطلب بنجاح</h1>
        <p className="text-muted-foreground mb-8">
          سيتم إرسال شهادتك إلى بريدك الإلكتروني قريباً
        </p>

        <div className="bg-primary/10 border border-primary/30 rounded-lg p-6 mb-8 text-left space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">رقم الشهادة</p>
            <p className="font-bold text-lg">{certificate.certificateNumber}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">البريد الإلكتروني</p>
            <p className="font-semibold">{formData.email}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">تاريخ الإصدار</p>
            <p className="font-semibold">{certificate.issueDate}</p>
          </div>
        </div>
      </div>

      <Card className="glass-border p-8">
        <h3 className="font-bold text-lg mb-6">الخطوات التالية</h3>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
              1
            </div>
            <div>
              <p className="font-semibold mb-1">تحقق من بريدك الإلكتروني</p>
              <p className="text-sm text-muted-foreground">
                ستصل الشهادة إليك في خلال 24 ساعة
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
              2
            </div>
            <div>
              <p className="font-semibold mb-1">تحميل وحفظ الشهادة</p>
              <p className="text-sm text-muted-foreground">
                احفظ الشهادة بصيغة PDF لسهولة الوصول إليها
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
              3
            </div>
            <div>
              <p className="font-semibold mb-1">شارك الشهادة</p>
              <p className="text-sm text-muted-foreground">
                شارك إنجازك في الشبكات الاجتماعية أو في ملفك الشخصي
              </p>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button variant="outline" className="gap-2 bg-transparent">
          <Download size={20} />
          تحميل الآن
        </Button>
        <Button variant="outline" className="gap-2 bg-transparent">
          <Mail size={20} />
          إعادة إرسال
        </Button>
        <Button className="gap-2">
          <Share2 size={20} />
          مشاركة الشهادة
        </Button>
      </div>

      <div className="text-center">
        <Button variant="ghost" onClick={() => router.push("/student")}>
          العودة إلى لوحة التحكم
        </Button>
      </div>
    </div>
  )
}
