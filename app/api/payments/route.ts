import { type NextRequest, NextResponse } from "next/server"
import { getUserPayments, LearnWorldsError } from "@/lib/learnworlds-service"
import { learnworldsClient } from "@/lib/learnworlds-client"

/**
 * Payments API
 * GET: جلب المدفوعات من LearnWorlds
 * يدعم filtering حسب المستخدم، المنتج، التاريخ، إلخ
 * يستخدم retry logic للتعامل مع الأخطاء المؤقتة
 */

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    const userId = searchParams.get("user_id")
    const productId = searchParams.get("product_id")
    const productType = searchParams.get("product_type") as "course" | "bundle" | "subscription" | null
    const affiliateId = searchParams.get("affiliate_id")
    const createdAfter = searchParams.get("created_after")
    const createdBefore = searchParams.get("created_before")
    const page = searchParams.get("page")
    const itemsPerPage = searchParams.get("items_per_page")

    // إذا كان هناك userId فقط، استخدم الخدمة المحسنة
    if (userId && !productId && !affiliateId) {
      console.log("[Payments API] Fetching user payments:", userId)
      
      const result = await getUserPayments(
        userId,
        page ? Number.parseInt(page) : 1,
        itemsPerPage ? Number.parseInt(itemsPerPage) : 20
      )
      
      return NextResponse.json({
        ...result,
        success: true,
      })
    }

    // للفلاتر المتقدمة، استخدم الـ client مباشرة
    const filters: any = {}
    if (userId) filters.user_id = userId
    if (productId) filters.product_id = productId
    if (productType) filters.product_type = productType
    if (affiliateId) filters.affiliate_id = affiliateId
    if (createdAfter) filters.created_after = Number.parseInt(createdAfter)
    if (createdBefore) filters.created_before = Number.parseInt(createdBefore)
    if (page) filters.page = Number.parseInt(page)
    if (itemsPerPage) filters.items_per_page = Number.parseInt(itemsPerPage)

    console.log("[Payments API] Fetching payments with filters:", filters)

    const result = await learnworldsClient.getPayments(filters)

    return NextResponse.json({
      ...result,
      success: true,
    })
  } catch (error: any) {
    console.error("[Payments API] Error:", error.message)
    
    const statusCode = error instanceof LearnWorldsError ? error.statusCode || 500 : 500
    
    return NextResponse.json(
      { 
        error: error.message || "Failed to fetch payments",
        code: error instanceof LearnWorldsError ? error.code : "UNKNOWN_ERROR",
        payments: [],
        success: false 
      }, 
      { status: statusCode }
    )
  }
}
