"use client"

import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"
import { Button } from "@/components/ui/button"
import { Globe, Bell } from 'lucide-react'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function StudentHeader() {
  const { student } = useAuth()
  const { language, toggleLanguage, t } = useLanguage()

  return (
    <header className="glass-border-header border-b border-border px-6 py-4 flex justify-between items-center">
      <div className="flex-1" />

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
        </Button>

        {/* Language Toggle */}
        <Button variant="ghost" size="icon" onClick={toggleLanguage}>
          <Globe size={20} />
          <span className="text-xs ml-1">{language.toUpperCase()}</span>
        </Button>

        {/* Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="text-right">
            <p className="font-semibold text-sm">{student?.firstName}</p>
            <p className="text-xs text-muted-foreground">{student?.email}</p>
          </div>
          <Avatar>
            <AvatarFallback>{student?.firstName?.[0]}</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
