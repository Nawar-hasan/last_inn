import { type NextRequest, NextResponse } from "next/server"
import { learnworldsClient } from "@/lib/learnworlds-client"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const paymentId = params.id

    console.log("[v0] Fetching invoice link for payment:", paymentId)

    const invoiceData = await learnworldsClient.getPaymentInvoiceLink(paymentId)

    return NextResponse.json(invoiceData)
  } catch (error: any) {
    console.error("[v0] Error fetching invoice:", error.message)
    return NextResponse.json({ error: error.message || "Failed to fetch invoice" }, { status: 500 })
  }
}
