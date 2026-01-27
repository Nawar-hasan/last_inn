"use client"

import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage()

  return (
    <Button
      onClick={toggleLanguage}
      variant="outline"
      size="icon"
      className="border-border bg-card/80 text-foreground hover:bg-card"
      title={language === "ar" ? "Switch to English" : "التبديل إلى العربية"}
    >
      <Globe className="h-5 w-5" />
      <span className="sr-only">Language Toggle</span>
    </Button>
  )
}
