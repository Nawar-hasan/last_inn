"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"
import { ExamplesDialog } from "./examples-dialog"

type Feature = { text: string; muted?: boolean }

const ACCENT = "#C6FF3A"

function FeatureItem({ text, muted = false }: Feature) {
  return (
    <li className="flex items-start gap-2">
      <CheckCircle2 className="mt-0.5 h-4 w-4" style={{ color: ACCENT }} />
      <span className={`text-sm ${muted ? "text-gray-400 dark:text-white" : "text-gray-800 dark:text-white"}`}>
        {text}
      </span>
    </li>
  )
}

type Currency = "INR" | "USD"

const PRICES: Record<Currency, { startup: string; pro: string; premium: string; save: string }> = {
  INR: {
    startup: "₹25,000/-",
    pro: "₹55,000/-",
    premium: "₹1,70,500/-",
    save: "Save Flat ₹1,500/-",
  },
  USD: {
    startup: "$299",
    pro: "$699",
    premium: "$2,049",
    save: "Save $20",
  },
}

function guessLocalCurrency(): Currency {
  const lang = typeof navigator !== "undefined" ? navigator.language : ""
  const tz = typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : ""
  if (/-(IN|PK|BD)\b/i.test(lang) || /(Kolkata|Karachi|Dhaka)/i.test(tz || "")) return "INR"
  return "USD"
}

const startupVideos = [
  "H1h5dHpp1Nw",
  "HXARcSSdfMU",
  "fd8zraQ1JdE",
  "ARQyF2FA3Ec",
  "dEZfHADlFtw",
  "wuyfdfKO6Rc",
  "VakkmhtrUA0",
  "o8DoIg9yNGk",
  "rtReBkFt-To",
]
const proVideos = [
  "ASV2myPRfKA",
  "eTfS2lqwf6A",
  "KALbYHmGV4I",
  "Go0AA9hZ4as",
  "sB7RZ9QCOAg",
  "TK2WboJOJaw",
  "5Xq7UdXXOxI",
  "kMjWCidQSK0",
  "RKKdQvwKOhQ",
]
const premiumVideos = [
  "v2AC41dglnM",
  "pRpeEdMmmQ0",
  "3AtDnEC4zak",
  "JRfuAukYTKg",
  "LsoLEjrDogU",
  "RB-RcX5DS5A",
  "hTWKbfoikeg",
  "YQHsXMglC9A",
  "09R8_2nJtjg",
]

export function Pricing() {
  const [openPlan, setOpenPlan] = useState<null | "Startup" | "Pro" | "Premium">(null)
  const [currency, setCurrency] = useState<Currency>("USD")

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const res = await fetch("/api/geo", { cache: "no-store" })
        if (!res.ok) throw new Error("geo failed")
        const data = await res.json()
        if (!cancelled) setCurrency(data?.currency === "INR" ? "INR" : "USD")
      } catch {
        if (!cancelled) setCurrency(guessLocalCurrency())
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section
      id="pricing"
      className="text-gray-900 dark:text-white"
      itemScope
      itemType="https://schema.org/PriceSpecification"
    >
      <div className="container mx-auto px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <div
            className="mx-auto mb-4 inline-flex items-center rounded-full px-3 py-1 text-xs font-medium text-gray-900 dark:text-white"
            style={{ backgroundColor: "rgba(139, 92, 246, 0.2)", border: `1px solid rgb(139, 92, 246)` }}
          >
            الأسعار والباقات
          </div>
          <h2
            className="text-4xl font-extrabold tracking-tight sm:text-5xl text-gray-900 dark:text-white"
            itemProp="name"
          >
            أسعارنا.
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-gray-700 dark:text-white" itemProp="description">
            برامج تدريبية متخصصة تناسب احتياجات مؤسستك. بلا رسوم خفية، فقط قيمة حقيقية.
          </p>
          <div className="mt-6">
            <Button
              asChild
              className="rounded-full px-5 bg-gradient-to-r from-[#551FBD] to-[#7B3FDD] hover:from-[#551FBD]/90 hover:to-[#7B3FDD]/90 text-white"
            >
              <Link href="https://wa.link/rc25na" target="_blank">
                تواصل معنا الآن
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {/* Startup */}
          <Card
            className="relative overflow-hidden rounded-2xl liquid-glass shadow-[0_12px_40px_rgba(139,92,246,0.2)] transition-all duration-300 hover:shadow-[0_12px_50px_rgba(139,92,246,0.3)]"
            itemScope
            itemType="https://schema.org/Offer"
          >
            <div className="absolute right-4 top-11 rounded-full px-2 py-0.5 text-[10px] bg-purple-600 text-white">
              {PRICES[currency].save}
            </div>
            <CardHeader className="space-y-3 pb-4">
              <div className="text-sm font-semibold text-gray-900 dark:text-white" itemProp="name">
                Startup
              </div>
              <div className="flex items-end gap-2 text-gray-900 dark:text-white">
                <div className="text-xl font-bold tracking-tight" itemProp="price">
                  {PRICES[currency].startup}
                </div>
                <span className="pb-0.5 text-[11px] text-gray-700 dark:text-white">per video</span>
                <meta itemProp="priceCurrency" content={currency} />
              </div>
              <Button
                type="button"
                onClick={() => setOpenPlan("Startup")}
                onTouchStart={() => setOpenPlan("Startup")}
                className="w-full rounded-full px-4 py-2 text-sm font-medium transition-colors bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white border-0"
              >
                عرض مثال
              </Button>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="grid gap-2" itemProp="description">
                {[
                  "10–15s Reel/Teaser (1 SKU)",
                  "Simple background + lighting",
                  "1 revision",
                  "Delivered in 10 days",
                  "Social reel/ad-ready visuals",
                  "3D Modelling - Included",
                ].map((f, i) => (
                  <FeatureItem key={i} text={f} />
                ))}
              </ul>
            </CardContent>
            <CardFooter />
          </Card>

          {/* Pro */}
          <Card
            className="relative overflow-hidden rounded-2xl liquid-glass shadow-[0_12px_40px_rgba(139,92,246,0.2)] transition-all duration-300 hover:shadow-[0_12px_50px_rgba(139,92,246,0.3)]"
            itemScope
            itemType="https://schema.org/Offer"
          >
            <CardHeader className="space-y-3 pb-4">
              <div className="text-sm font-semibold text-gray-900 dark:text-white" itemProp="name">
                Pro
              </div>
              <div className="flex items-end gap-2 text-gray-900 dark:text-white">
                <div className="text-xl font-bold tracking-tight" itemProp="price">
                  {PRICES[currency].pro}
                </div>
                <span className="pb-0.5 text-[11px] text-gray-700 dark:text-white">per video</span>
                <meta itemProp="priceCurrency" content={currency} />
              </div>
              <Button
                type="button"
                onClick={() => setOpenPlan("Pro")}
                onTouchStart={() => setOpenPlan("Pro")}
                className="w-full rounded-full px-4 py-2 text-sm font-medium transition-colors bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white border-0"
              >
                عرض مثال
              </Button>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="grid gap-2" itemProp="description">
                {[
                  "20–25s Animation (1 SKU)",
                  "Fixed Shot-list (no surprises)",
                  "Creative background + pro graphics",
                  "2 structured revisions",
                  "Delivered in 3 weeks",
                  "3D Modelling - Included",
                ].map((f, i) => (
                  <FeatureItem key={i} text={f} />
                ))}
              </ul>
            </CardContent>
            <CardFooter />
          </Card>

          {/* Premium */}
          <Card
            className="relative overflow-hidden rounded-2xl liquid-glass-enhanced shadow-[0_16px_50px_rgba(139,92,246,0.3)] transition-all duration-300 hover:shadow-[0_16px_60px_rgba(139,92,246,0.4)]"
            itemScope
            itemType="https://schema.org/Offer"
          >
            <CardHeader className="relative space-y-3 pb-4">
              <div className="text-sm font-semibold text-gray-900 dark:text-white" itemProp="name">
                Premium
              </div>
              <div className="flex items-end gap-2 text-gray-900 dark:text-white">
                <div className="text-xl font-bold tracking-tight" itemProp="price">
                  {PRICES[currency].premium}
                </div>
                <span className="pb-0.5 text-[11px] text-gray-700 dark:text-white">per video</span>
                <meta itemProp="priceCurrency" content={currency} />
              </div>
              <Button
                type="button"
                onClick={() => setOpenPlan("Premium")}
                onTouchStart={() => setOpenPlan("Premium")}
                className="w-full rounded-full px-4 py-2 text-sm font-medium transition-colors bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white border-0"
              >
                عرض مثال
              </Button>
            </CardHeader>
            <CardContent className="relative pt-0">
              <ul className="grid gap-2" itemProp="description">
                {[
                  "30–40s Animation (up to 5 SKUs)",
                  "Advanced storyboard + shot design",
                  "Delivered in 4 week",
                  "Lighting, Camera Animation, Depth effects",
                  "Up to 3 structured revisions",
                  "3D Modelling - Included",
                ].map((f, i) => (
                  <FeatureItem key={i} text={f} />
                ))}
              </ul>
            </CardContent>
            <CardFooter />
          </Card>
        </div>
      </div>

      {/* Modals */}
      <ExamplesDialog
        open={openPlan === "Startup"}
        onOpenChange={(v) => setOpenPlan(v ? "Startup" : null)}
        planName="Startup Plan"
        price={PRICES[currency].startup}
        videoIds={startupVideos}
      />
      <ExamplesDialog
        open={openPlan === "Pro"}
        onOpenChange={(v) => setOpenPlan(v ? "Pro" : null)}
        planName="Pro Plan"
        price={PRICES[currency].pro}
        videoIds={proVideos}
      />
      <ExamplesDialog
        open={openPlan === "Premium"}
        onOpenChange={(v) => setOpenPlan(v ? "Premium" : null)}
        planName="Premium Plan"
        price={PRICES[currency].premium}
        videoIds={premiumVideos}
      />
    </section>
  )
}
