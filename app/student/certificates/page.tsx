"use client"

import { useLanguage } from "@/lib/language-context"
import { useStudentCertificates } from "@/lib/hooks/use-student-data"
import { useAuth } from "@/lib/auth-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Share2, Eye, Award, ExternalLink, AlertCircle, RefreshCw } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export default function CertificatesPage() {
  const { t, language } = useLanguage()
  const { certificates, isLoading, error } = useStudentCertificates()
  const { isAuthenticated } = useAuth()
  const { toast } = useToast()
  const isArabic = language === "ar"
  const [sharingId, setSharingId] = useState<string | null>(null)

  // مشاركة الشهادة
  const handleShare = async (cert: any) => {
    setSharingId(cert.id)
    
    const shareText = isArabic
      ? `لقد حصلت على شهادة "${cert.courseName}" من Innovologia!`
      : `I've earned the "${cert.courseName}" certificate from Innovologia!`
    
    const shareUrl = cert.verifyUrl || `${window.location.origin}/verify/${cert.certificateNumber}`

    try {
      if (navigator.share) {
        await navigator.share({
          title: cert.courseName,
          text: shareText,
          url: shareUrl,
        })
      } else {
        // نسخ الرابط للمشاركة
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`)
        toast({
          title: isArabic ? "تم نسخ الرابط" : "Link Copied",
          description: isArabic ? "تم نسخ رابط الشهادة للمشاركة" : "Certificate link copied to clipboard",
        })
      }
    } catch (err) {
      // المستخدم ألغى المشاركة
    } finally {
      setSharingId(null)
    }
  }

  // تحديد حالة الشهادة
  const getCertificateStatus = (cert: any) => {
    if (cert.expiresAt && new Date(cert.expiresAt) < new Date()) {
      return { label: isArabic ? "منتهية الصلاحية" : "Expired", color: "text-red-500" }
    }
    return { label: isArabic ? "ساري المفعول" : "Valid", color: "text-green-500" }
  }

  // إذا لم يكن المستخدم مسجل الدخول
  if (!isAuthenticated) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{t("student.certificates")}</h1>
        </div>
        <Card className="glass-border p-12 text-center">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <p className="text-muted-foreground mb-6">
            {isArabic ? "يرجى تسجيل الدخول لعرض شهاداتك" : "Please log in to view your certificates"}
          </p>
          <Link href="/login">
            <Button>{isArabic ? "تسجيل الدخول" : "Log In"}</Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">{t("student.certificates")}</h1>
          <p className="text-muted-foreground">
            {isArabic
              ? "جميع الشهادات التي حصلت عليها من الدورات المكتملة"
              : "All certificates you've earned from completed courses"}
          </p>
        </div>
        {certificates.length > 0 && (
          <div className="text-sm text-muted-foreground">
            {certificates.length} {isArabic ? "شهادة" : certificates.length === 1 ? "certificate" : "certificates"}
          </div>
        )}
      </div>

      {/* حالة الخطأ */}
      {error && (
        <Card className="glass-border p-6 border-destructive/50 bg-destructive/5">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        </Card>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4">
          {[...Array(2)].map((_, i) => (
            <Card key={i} className="glass-border p-6 animate-pulse">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-lg bg-muted" />
                <div className="flex-1 space-y-3">
                  <div className="h-5 bg-muted rounded w-1/3" />
                  <div className="h-4 bg-muted rounded w-1/4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : certificates.length > 0 ? (
        <div className="space-y-4">
          {certificates.map((cert) => {
            const status = getCertificateStatus(cert)
            
            return (
              <Card key={cert.id} className="glass-border p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  {/* أيقونة الشهادة */}
                  <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center flex-shrink-0">
                    <Award className="h-8 w-8 text-white" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-1 truncate">
                          {isArabic ? cert.courseName : (cert.courseNameEn || cert.courseName)}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {isArabic ? "رقم الشهادة" : "Certificate #"}: 
                          <span className="font-mono mx-1">{cert.certificateNumber}</span>
                        </p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground mb-1">
                              {isArabic ? "تاريخ الإصدار" : "Issue Date"}
                            </p>
                            <p className="font-semibold">
                              {cert.issuedAt 
                                ? new Date(cert.issuedAt).toLocaleDateString(isArabic ? "ar-SA" : "en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })
                                : "-"}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-1">
                              {isArabic ? "الحالة" : "Status"}
                            </p>
                            <p className={`font-semibold ${status.color}`}>{status.label}</p>
                          </div>
                          {cert.expiresAt && (
                            <div>
                              <p className="text-muted-foreground mb-1">
                                {isArabic ? "تاريخ الانتهاء" : "Expires"}
                              </p>
                              <p className="font-semibold">
                                {new Date(cert.expiresAt).toLocaleDateString(isArabic ? "ar-SA" : "en-US")}
                              </p>
                            </div>
                          )}
                          {cert.instructorName && (
                            <div>
                              <p className="text-muted-foreground mb-1">
                                {isArabic ? "المدرب" : "Instructor"}
                              </p>
                              <p className="font-semibold">{cert.instructorName}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* أزرار الإجراءات */}
                      <div className="flex flex-col gap-2 flex-shrink-0">
                        {cert.verifyUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 bg-transparent"
                            onClick={() => window.open(cert.verifyUrl, "_blank")}
                          >
                            <Eye size={16} />
                            {isArabic ? "تحقق" : "Verify"}
                          </Button>
                        )}
                        {cert.downloadUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 bg-transparent"
                            onClick={() => window.open(cert.downloadUrl, "_blank")}
                          >
                            <Download size={16} />
                            {isArabic ? "تحميل" : "Download"}
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 bg-transparent"
                          onClick={() => handleShare(cert)}
                          disabled={sharingId === cert.id}
                        >
                          {sharingId === cert.id ? (
                            <RefreshCw size={16} className="animate-spin" />
                          ) : (
                            <Share2 size={16} />
                          )}
                          {isArabic ? "مشاركة" : "Share"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card className="glass-border p-12 text-center">
          <Award className="mx-auto mb-4 h-16 w-16 text-muted-foreground/50" />
          <h3 className="text-lg font-semibold mb-2">
            {isArabic ? "لم تحصل على أي شهادات حتى الآن" : "No certificates earned yet"}
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            {isArabic
              ? "أكمل دوراتك للحصول على شهادات معتمدة تثبت مهاراتك ومعرفتك"
              : "Complete your courses to earn certified credentials that demonstrate your skills"}
          </p>
          <Link href="/student/courses">
            <Button className="gap-2">
              <ExternalLink size={16} />
              {isArabic ? "استعرض دوراتك" : "View Your Courses"}
            </Button>
          </Link>
        </Card>
      )}
    </div>
  )
}
