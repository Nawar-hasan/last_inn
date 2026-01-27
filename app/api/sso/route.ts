import { NextResponse } from "next/server"
import { createSSOLink } from "@/lib/learnworlds-client"

export async function POST(req: Request) {
  try {
    const { email, redirectUrl } = await req.json()

    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 })
    }

    console.log("[SSO] Request for:", email)

    const url = await createSSOLink(email, redirectUrl)

    console.log("[SSO] Success, URL:", url)
    return NextResponse.json({ url })
  } catch (err: any) {
    console.error("[SSO] Exception:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
