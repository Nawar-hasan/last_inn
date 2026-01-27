import { type NextRequest, NextResponse } from "next/server"
import { learnworldsClient } from "@/lib/learnworlds-client"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const paymentId = params.id

    console.log("[v0] Fetching payment details:", paymentId)

    const payment = await learnworldsClient.getPaymentById(paymentId)

    return NextResponse.json(payment)
  } catch (error: any) {
    console.error("[v0] Error fetching payment:", error.message)
    return NextResponse.json({ error: error.message || "Failed to fetch payment" }, { status: 500 })
  }
}
