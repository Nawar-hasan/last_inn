"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"
import { SiteHeader } from "@/components/site-header"
import { AppverseFooter } from "@/components/appverse-footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Receipt, CreditCard, Calendar, DollarSign } from "lucide-react"
import { format } from "date-fns"
import { ar } from "date-fns/locale"

interface Payment {
  id: string
  transaction_id: string
  type: "subscription" | "installment" | "one-off"
  product: {
    id: string
    type: "course" | "bundle" | "subscription"
    name: string
    description: string | null
    image: string | null
  }
  price: number
  discount: number
  user_id: string
  paid_at: number | null
  invoice: string | null
  coupon: string | null
  tax_amount: number
  tax_percentage: number
  gateway: string | null
  created: number
}

export default function PaymentsPage() {
  const { student, isAuthenticated } = useAuth()
  const { language } = useLanguage()
  const isArabic = language === "ar"

  const [payments, setPayments] = useState<Payment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    if (isAuthenticated && student?.id) {
      fetchPayments()
    }
  }, [isAuthenticated, student?.id, currentPage])

  const fetchPayments = async () => {
    try {
      setIsLoading(true)
      console.log("[v0] Fetching user payments...")

      const response = await fetch(`/api/payments?user_id=${student?.id}&page=${currentPage}&items_per_page=10`)
      const data = await response.json()

      console.log("[v0] Payments loaded:", data.payments.length)
      setPayments(data.payments || [])
      setTotalPages(data.meta?.totalPages || 1)
    } catch (error) {
      console.error("[v0] Error loading payments:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const downloadInvoice = async (paymentId: string, invoiceNumber: string) => {
    try {
      console.log("[v0] Downloading invoice:", invoiceNumber)

      const response = await fetch(`/api/payments/${paymentId}/invoice`)
      const data = await response.json()

      if (data.url) {
        window.open(data.url, "_blank")
      }
    } catch (error) {
      console.error("[v0] Error downloading invoice:", error)
      alert(isArabic ? "فشل تحميل الفاتورة" : "Failed to download invoice")
    }
  }

  const formatDate = (timestamp: number) => {
    return format(new Date(timestamp * 1000), "PPP", {
      locale: isArabic ? ar : undefined,
    })
  }

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen">
        <SiteHeader />
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-xl">{isArabic ? "يرجى تسجيل الدخول" : "Please login"}</p>
        </div>
        <AppverseFooter />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-background to-background">
      <SiteHeader />

      <div className="container mx-auto px-4 py-12" dir={isArabic ? "rtl" : "ltr"}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: "var(--font-rubik)" }}>
              {isArabic ? "سجل المدفوعات" : "Payment History"}
            </h1>
            <p className="text-muted-foreground">
              {isArabic ? "جميع معاملاتك ومشترياتك" : "All your transactions and purchases"}
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">{isArabic ? "جاري التحميل..." : "Loading..."}</p>
            </div>
          ) : payments.length === 0 ? (
            <Card className="bg-background/50 backdrop-blur-sm border-purple-500/20">
              <CardContent className="py-12 text-center">
                <Receipt className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">{isArabic ? "لا توجد مدفوعات" : "No Payments Yet"}</h3>
                <p className="text-muted-foreground">
                  {isArabic ? "لم تقم بأي عملية شراء بعد" : "You haven't made any purchases yet"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {payments.map((payment) => (
                <Card key={payment.id} className="bg-background/50 backdrop-blur-sm border-purple-500/20">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-bold mb-1" style={{ fontFamily: "var(--font-rubik)" }}>
                              {payment.product.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {isArabic ? "رقم المعاملة:" : "Transaction ID:"} {payment.transaction_id}
                            </p>
                          </div>
                          <Badge variant={payment.type === "one-off" ? "default" : "secondary"}>
                            {payment.type === "one-off"
                              ? isArabic
                                ? "دفعة واحدة"
                                : "One-time"
                              : payment.type === "subscription"
                                ? isArabic
                                  ? "اشتراك"
                                  : "Subscription"
                                : isArabic
                                  ? "تقسيط"
                                  : "Installment"}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <p className="text-muted-foreground text-xs">{isArabic ? "تاريخ الدفع" : "Paid Date"}</p>
                              <p className="font-semibold">{payment.paid_at ? formatDate(payment.paid_at) : "-"}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <p className="text-muted-foreground text-xs">{isArabic ? "المبلغ" : "Amount"}</p>
                              <p className="font-semibold text-purple-500">{formatPrice(payment.price)}</p>
                            </div>
                          </div>

                          {payment.discount > 0 && (
                            <div className="flex items-center gap-2">
                              <div>
                                <p className="text-muted-foreground text-xs">{isArabic ? "الخصم" : "Discount"}</p>
                                <p className="font-semibold text-green-500">-{formatPrice(payment.discount)}</p>
                              </div>
                            </div>
                          )}

                          {payment.tax_amount > 0 && (
                            <div className="flex items-center gap-2">
                              <div>
                                <p className="text-muted-foreground text-xs">{isArabic ? "الضريبة" : "Tax"}</p>
                                <p className="font-semibold">
                                  {formatPrice(payment.tax_amount)} ({payment.tax_percentage}%)
                                </p>
                              </div>
                            </div>
                          )}

                          {payment.gateway && (
                            <div className="flex items-center gap-2">
                              <CreditCard className="w-4 h-4 text-muted-foreground" />
                              <div>
                                <p className="text-muted-foreground text-xs">{isArabic ? "البوابة" : "Gateway"}</p>
                                <p className="font-semibold capitalize">{payment.gateway}</p>
                              </div>
                            </div>
                          )}
                        </div>

                        {payment.coupon && (
                          <div className="flex items-center gap-2 text-sm">
                            <Badge variant="outline" className="text-purple-500 border-purple-500">
                              {isArabic ? "كوبون:" : "Coupon:"} {payment.coupon}
                            </Badge>
                          </div>
                        )}
                      </div>

                      <div className="flex md:flex-col gap-2">
                        {payment.invoice && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadInvoice(payment.id, payment.invoice!)}
                            className="gap-2"
                          >
                            <Download className="w-4 h-4" />
                            {isArabic ? "الفاتورة" : "Invoice"}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    {isArabic ? "السابق" : "Previous"}
                  </Button>
                  <span className="px-4 py-2">
                    {isArabic ? `صفحة ${currentPage} من ${totalPages}` : `Page ${currentPage} of ${totalPages}`}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    {isArabic ? "التالي" : "Next"}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <AppverseFooter />
    </main>
  )
}
