import { SiteHeader } from "@/components/site-header"
import { Hero } from "@/components/hero"
import { StatsSection } from "@/components/stats-section"
import { AppverseFooter } from "@/components/appverse-footer"
import { Services } from "@/components/services"
import { FeaturedCourses } from "@/components/featured-courses"
import { FeaturedArticles } from "@/components/featured-articles"
import Script from "next/script"

export const dynamic = "force-static"

export const metadata = {
  title: "Innovologia | ابدأ رحلة الابتكار",
  description: "منصة تدريب متخصصة في الابتكار والإبداع المؤسسي مع شهادات دولية معترف بها",
}

export default function Page() {
  const pageStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://innovologia.com/",
    name: "Innovologia | ابدأ رحلة الابتكار",
    description: "منصة تدريب في الابتكار والإبداع المؤسسي",
    url: "https://innovologia.com",
    mainEntity: {
      "@type": "Organization",
      name: "Innovologia",
      url: "https://innovologia.com",
    },
  }

  return (
    <>
      <main className="min-h-[100dvh]">
        <SiteHeader />
        <Hero />
        <Services />
        <FeaturedArticles />
        <FeaturedCourses />
        <StatsSection />
        <AppverseFooter />
      </main>

      <Script
        id="page-structured-data"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(pageStructuredData),
        }}
      />
    </>
  )
}
