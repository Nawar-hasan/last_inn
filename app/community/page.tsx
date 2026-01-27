import { SiteHeader } from "@/components/site-header"
import { CommunityPricing } from "@/components/community-pricing"
import { AppverseFooter } from "@/components/appverse-footer"

export const metadata = {
  title: "Community Plans | Innovologia",
  description: "Join our professional innovation community",
}

export default function CommunityPage() {
  return (
    <main className="min-h-[100dvh]">
      <SiteHeader />
      <div className="relative min-h-screen overflow-hidden">
        {/* Plasma Background */}
        <div className="plasma-bg" />

        <div className="relative z-10 pt-20 pb-12">
          <div className="container mx-auto px-4 text-center mb-12">
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4"
              style={{ fontFamily: "var(--font-rubik)" }}
            >
              <span className="bg-gradient-to-r from-[#551FBD] to-[#7B3FDD] bg-clip-text text-transparent">
                Join Our Community
              </span>
            </h1>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto" style={{ fontFamily: "var(--font-rubik)" }}>
              Choose a plan that fits your innovation journey and get started today
            </p>
          </div>

          <CommunityPricing />
        </div>
      </div>
      <AppverseFooter />
    </main>
  )
}
