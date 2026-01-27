"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/lib/language-context"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ArrowRight, Minus, Plus, ShoppingCart, X } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { AppverseFooter } from "@/components/appverse-footer"
import { useAuth } from "@/lib/auth-context"
import Image from "next/image"

interface CartItem {
  id: string
  type: "course" | "community"
  title: string
  titleEn: string
  price: number
  image: string
  duration?: string
  quantity: number
  forSomeoneElse: boolean
}

export default function CheckoutPage() {
  const { language } = useLanguage()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { isAuthenticated, student } = useAuth()
  const [isProcessing, setIsProcessing] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [hasRedirected, setHasRedirected] = useState(false)

  const isArabic = language === "ar"

  useEffect(() => {
    if (!isAuthenticated && !hasRedirected) {
      setHasRedirected(true)
      const currentPath = `/checkout?${searchParams.toString()}`
      router.push(`/auth/login?redirect=${encodeURIComponent(currentPath)}`)
      return
    }

    if (isAuthenticated && cartItems.length === 0) {
      const itemType = searchParams.get("type")
      const itemId = searchParams.get("id")
      const planName = searchParams.get("plan")

      if (itemType === "course" && itemId) {
        const courseData = getCourseData(itemId)
        if (courseData) {
          setCartItems([
            {
              id: itemId,
              type: "course",
              title: courseData.title,
              titleEn: courseData.titleEn,
              price: courseData.price,
              image: courseData.image,
              duration: "90 يوم وصول من تاريخ الشراء",
              quantity: 1,
              forSomeoneElse: false,
            },
          ])
        }
      } else if (itemType === "community" && planName) {
        const planData = getCommunityPlanData(planName)
        if (planData) {
          setCartItems([
            {
              id: planName,
              type: "community",
              title: planData.title,
              titleEn: planData.titleEn,
              price: planData.price,
              image: "/diverse-community-gathering.png",
              duration: "اشتراك شهري",
              quantity: 1,
              forSomeoneElse: false,
            },
          ])
        }
      }
    }
  }, [isAuthenticated, hasRedirected, searchParams, router, cartItems.length])

  const updateQuantity = (itemId: string, delta: number) => {
    setCartItems((items) =>
      items.map((item) => (item.id === itemId ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item)),
    )
  }

  const togglePurchaseForOther = (itemId: string) => {
    setCartItems((items) =>
      items.map((item) => (item.id === itemId ? { ...item, forSomeoneElse: !item.forSomeoneElse } : item)),
    )
  }

  const removeItem = (itemId: string) => {
    setCartItems((items) => items.filter((item) => item.id !== itemId))
  }

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  const handleCheckout = async () => {
    if (cartItems.length === 0) return

    setIsProcessing(true)

    try {
      console.log("[v0] Starting checkout process...")

      const firstItem = cartItems[0]

      const response = await fetch("/api/payments/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: student?.id,
          courseId: firstItem.id,
          priceId: firstItem.id,
          email: student?.email,
          fullName: `${student?.firstName || ""} ${student?.lastName || ""}`.trim(),
        }),
      })

      console.log("[v0] Payment API response status:", response.status)

      const contentType = response.headers.get("content-type")

      if (!contentType || !contentType.includes("application/json")) {
        console.error("[v0] Response is not JSON, content-type:", contentType)
        const text = await response.text()
        console.error("[v0] Response body:", text.substring(0, 200))
        throw new Error("Server returned invalid response format")
      }

      if (response.ok) {
        const data = await response.json()
        console.log("[v0] Payment response data:", data)

        if (data.checkoutUrl) {
          console.log("[v0] Redirecting to checkout URL:", data.checkoutUrl)
          window.location.href = data.checkoutUrl
        } else if (data.success) {
          router.push("/checkout/success")
        } else {
          throw new Error("No checkout URL provided")
        }
      } else {
        try {
          const errorData = await response.json()
          console.error("[v0] Payment API error:", errorData)
          alert(
            isArabic
              ? `حدث خطأ: ${errorData.error || "خطأ في المعالجة"}`
              : `Error: ${errorData.error || "Processing failed"}`,
          )
        } catch {
          console.error("[v0] Failed to parse error response")
          alert(isArabic ? "حدث خطأ في معالجة الطلب" : "Payment processing failed")
        }
      }
    } catch (error) {
      console.error("[v0] Checkout error:", error)
      alert(
        isArabic
          ? `حدث خطأ: ${error instanceof Error ? error.message : "خطأ غير معروف"}`
          : `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      )
    } finally {
      setIsProcessing(false)
    }
  }

  if (!isAuthenticated) {
    return null
  }

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-background to-background">
        <SiteHeader />
        <div className="container mx-auto px-4 py-20 text-center">
          <ShoppingCart className="w-20 h-20 mx-auto mb-6 text-muted-foreground" />
          <h1 className="text-3xl font-bold mb-4">{isArabic ? "السلة فارغة" : "Cart is Empty"}</h1>
          <p className="text-muted-foreground mb-8">
            {isArabic ? "لم تقم بإضافة أي عناصر بعد" : "You haven't added any items yet"}
          </p>
          <Button onClick={() => router.push("/courses")}>{isArabic ? "تصفح الدورات" : "Browse Courses"}</Button>
        </div>
        <AppverseFooter />
      </main>
    )
  }

  const subtotal = calculateSubtotal()

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-background to-background">
      <SiteHeader />

      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1
            className="text-4xl md:text-5xl font-bold mb-4 text-foreground"
            style={{ fontFamily: "var(--font-rubik)" }}
          >
            {isArabic ? "صفحة الدفع" : "Checkout"}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto" dir={isArabic ? "rtl" : "ltr"}>
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <Card key={item.id} className="bg-background/50 backdrop-blur-sm border-purple-500/20">
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    <div className="relative w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-purple-600 to-purple-800">
                      <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
                    </div>

                    <div className="flex-1 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold mb-1" style={{ fontFamily: "var(--font-rubik)" }}>
                            {isArabic ? item.title : item.titleEn}
                          </h3>
                          {item.duration && <p className="text-sm text-muted-foreground">{item.duration}</p>}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <X className="w-5 h-5" />
                        </Button>
                      </div>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={item.forSomeoneElse}
                          onChange={() => togglePurchaseForOther(item.id)}
                          className="w-4 h-4 rounded border-purple-500"
                        />
                        <span className="text-sm">{isArabic ? "الشراء لشخص آخر" : "Purchasing for someone else"}</span>
                      </label>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, -1)}
                            className="h-8 w-8"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="font-bold w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, 1)}
                            className="h-8 w-8"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="text-2xl font-bold text-purple-500">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card className="bg-purple-500/10 border-purple-500/30">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground text-center" style={{ fontFamily: "var(--font-rubik)" }}>
                  {isArabic
                    ? "هل تشتري عدة دورات؟ تأكد من اختيار تواريخ البدء المفضلة لكل دورة."
                    : "Taking multiple courses? Make sure you've selected your preferred start dates for each course."}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="bg-background/80 backdrop-blur-sm border-purple-500/30 sticky top-4">
              <CardHeader className="border-b border-purple-500/20">
                <h2 className="text-2xl font-bold text-center" style={{ fontFamily: "var(--font-rubik)" }}>
                  {isArabic ? "ملخص الطلب" : "Order Summary"}
                </h2>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">
                        {isArabic ? item.title : item.titleEn} x{item.quantity}
                      </span>
                      <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-purple-500/20 pt-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>{isArabic ? "المجموع الفرعي" : "Subtotal"}</span>
                    <span className="text-2xl text-purple-500">${subtotal.toFixed(2)} USD</span>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground text-center">
                  {isArabic ? "من" : "From"} ${(subtotal / 12).toFixed(2)}/mo with{" "}
                  <span className="text-purple-500 font-semibold">Shop Pay</span>
                </div>

                <div className="bg-muted/30 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground text-center">
                    {isArabic ? "الضرائب محسوبة عند عنوان الفاتورة" : "Taxes calculated with billing address"}
                  </p>
                </div>

                <Button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold py-6 text-lg"
                  style={{ fontFamily: "var(--font-rubik)" }}
                >
                  {isProcessing ? (
                    isArabic ? (
                      "جاري المعالجة..."
                    ) : (
                      "Processing..."
                    )
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      CHECKOUT
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground leading-relaxed">
                  {isArabic ? "عند الشراء، أنت توافق على" : "By purchasing, you agree to our"}{" "}
                  <a href="/t&c" className="text-purple-500 hover:underline">
                    {isArabic ? "شروط الاستخدام" : "terms of use"}
                  </a>
                  . {isArabic ? "نقترح أيضاً قراءة" : "We also suggest you read our"}{" "}
                  <a href="/privacy" className="text-purple-500 hover:underline">
                    {isArabic ? "سياسة الخصوصية" : "privacy policy"}
                  </a>
                  .
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <AppverseFooter />
    </main>
  )
}

function getCourseData(courseId: string) {
  const courses: Record<string, any> = {
    cins: {
      title: "الرئيس التنفيذي للابتكار المعتمد",
      titleEn: "Certified Innovation Strategic",
      price: 2375,
      image: "/images/course-badge.jpg",
    },
    aina: {
      title: "استراتيجي الابتكار المعتمد",
      titleEn: "AI Innovation Architect",
      price: 2375,
      image: "/images/course-badge.jpg",
    },
    cdtp: {
      title: "محترف التفكير التصميمي المعتمد",
      titleEn: "Certified Design Thinking Professional",
      price: 1990,
      image: "/images/course-badge.jpg",
    },
    ccino: {
      title: "مقيم الابتكار المعتمد",
      titleEn: "Certified Chief Innovation Officer",
      price: 3700,
      image: "/images/course-badge.jpg",
    },
    cinp: {
      title: "محترف الابتكار المعتمد",
      titleEn: "Certified Innovation Professional",
      price: 3990,
      image: "/images/course-badge.jpg",
    },
  }
  return courses[courseId]
}

function getCommunityPlanData(planName: string) {
  const plans: Record<string, any> = {
    Professional: {
      title: "الباقة المتقدمة",
      titleEn: "Professional Plan",
      price: 47,
    },
    Elite: {
      title: "الباقة النخبة",
      titleEn: "Elite Plan",
      price: 197,
    },
    Basic: {
      title: "الباقة الأساسية",
      titleEn: "Basic Plan",
      price: 0,
    },
  }
  return plans[planName]
}
