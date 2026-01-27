"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Instagram, Twitter, Youtube, Linkedin } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

interface FooterContent {
  tagline: string
  copyright: string
}

const defaultContent: FooterContent = {
  tagline:
    "نحن في Innovologia نؤمن أن الابتكار ليس رفاهية، بل مهارة ضرورية في هذا العصر المتغير. نصنع الفُرص ونُعيد تعريف الممكن.",
  copyright: "© 2025 — Innovologia International",
}

export function AppverseFooter() {
  const [content, setContent] = useState<FooterContent>(defaultContent)
  const { language } = useLanguage()
  const isArabic = language === "ar"

  useEffect(() => {
    // No need to load from localStorage anymore
  }, [])

  return (
    <section className="text-foreground">
      {/* Contact CTA */}
      <div className="container mx-auto px-4 pt-12 sm:pt-16">
        <div className="flex justify-center">
          <Button
            asChild
            className="rounded-full bg-gradient-to-r from-[#551FBD] to-[#7B3FDD] px-6 py-2 text-sm font-medium text-white shadow-[0_0_20px_rgba(85,31,189,0.35)] hover:from-[#551FBD]/90 hover:to-[#7B3FDD]/90"
          >
            <a
              href="https://wa.link/rc25na"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontFamily: "var(--font-rubik)" }}
            >
              {isArabic ? "تواصل معنا" : "Contact Us"}
            </a>
          </Button>
        </div>
      </div>
      {/* Footer */}
      <footer className="border-t border-white/10 py-16 sm:py-20">
        <div className="container mx-auto px-4">
          {/* Logo and Tagline - Centered */}
          <div className="text-center mb-16">
            <div className="flex justify-center mb-4">
              <img src="/logo.png" alt="Innovologia Logo" className="h-12 w-auto" />
            </div>
            <p
              className="max-w-2xl mx-auto text-sm sm:text-base text-foreground/75 leading-relaxed"
              style={{ fontFamily: "var(--font-rubik)" }}
            >
              {content.tagline}
            </p>
          </div>

          {/* Navigation Grid - Two Columns */}
          <div
            className={`grid gap-8 md:gap-24 mb-12 ${isArabic ? "md:grid-cols-2 text-right" : "md:grid-cols-2"} max-w-4xl mx-auto`}
          >
            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <h5
                  className="text-xs font-semibold uppercase tracking-widest text-foreground/60 mb-4"
                  style={{ fontFamily: "var(--font-rubik)" }}
                >
                  {isArabic ? "الرئيسية" : "Main"}
                </h5>
                <ul className="space-y-3 text-sm">
                  {(isArabic
                    ? [
                        { name: "الدورات", href: "/courses" },
                        { name: "الخدمات", href: "/#services" },
                      ]
                    : [
                        { name: "Home", href: "/" },
                        { name: "Courses", href: "/courses" },
                        { name: "Services", href: "/#services" },
                      ]
                  ).map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-foreground/70 hover:text-[#551FBD] transition-colors font-medium"
                        style={{ fontFamily: "var(--font-rubik)" }}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <h5
                  className="text-xs font-semibold uppercase tracking-widest text-foreground/60 mb-4"
                  style={{ fontFamily: "var(--font-rubik)" }}
                >
                  {isArabic ? "من نحن" : "About"}
                </h5>
                <ul className="space-y-3 text-sm">
                  {(isArabic
                    ? [
                        { name: "المدونة", href: "/blog" },
                      ]
                    : [
                        { name: "Blog", href: "/blog" },
                        { name: "About Us", href: "/about-us" },
                      ]
                  ).map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-foreground/70 hover:text-[#551FBD] transition-colors font-medium"
                        style={{ fontFamily: "var(--font-rubik)" }}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Social Links and Copyright */}
          <div className="border-t border-white/10 pt-8">
            {/* Social Media Links */}
            <div className="flex justify-center gap-6 mb-6">
              <a
                href="https://twitter.com/innovologia"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-foreground/5 rounded-lg transition-colors"
                aria-label={isArabic ? "تويتر" : "Twitter"}
              >
                <Twitter className="h-5 w-5 text-foreground/60 hover:text-[#551FBD]" />
              </a>
              <a
                href="https://linkedin.com/company/innovologia"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-foreground/5 rounded-lg transition-colors"
                aria-label={isArabic ? "لينكدإن" : "LinkedIn"}
              >
                <Linkedin className="h-5 w-5 text-foreground/60 hover:text-[#551FBD]" />
              </a>
              <a
                href="https://instagram.com/innovologia"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-foreground/5 rounded-lg transition-colors"
                aria-label={isArabic ? "إنستغرام" : "Instagram"}
              >
                <Instagram className="h-5 w-5 text-foreground/60 hover:text-[#551FBD]" />
              </a>
              <a
                href="https://youtube.com/@innovologia"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-foreground/5 rounded-lg transition-colors"
                aria-label={isArabic ? "يوتيوب" : "YouTube"}
              >
                <Youtube className="h-5 w-5 text-foreground/60 hover:text-[#551FBD]" />
              </a>
            </div>

            {/* Copyright and Legal */}
            <div
              className={`flex flex-col gap-4 items-center text-xs text-foreground/60 ${isArabic ? "text-right" : "text-center"}`}
            >
              <p style={{ fontFamily: "var(--font-rubik)" }}>{content.copyright}</p>
              <div className={`flex items-center gap-4 ${isArabic ? "flex-row-reverse" : ""}`}>
                <Link
                  href="/privacy"
                  className="hover:text-[#551FBD] transition-colors"
                  style={{ fontFamily: "var(--font-rubik)" }}
                >
                  {isArabic ? "سياسة الخصوصية" : "Privacy Policy"}
                </Link>
                <span className="text-foreground/30">•</span>
                <Link
                  href="/t&c"
                  className="hover:text-[#551FBD] transition-colors"
                  style={{ fontFamily: "var(--font-rubik)" }}
                >
                  {isArabic ? "الشروط والأحكام" : "Terms & Conditions"}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </section>
  )
}
