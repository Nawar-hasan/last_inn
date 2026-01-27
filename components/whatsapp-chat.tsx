"use client"

import { useState, useEffect } from "react"
import { X, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useLanguage } from "@/lib/language-context"
import { MessageCircle } from "lucide-react"

// WhatsApp SVG Icon for better quality
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}

export function WhatsAppChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const { language } = useLanguage()
  const isArabic = language === "ar"

  const whatsappNumber = "+963932692088"
  const defaultMessage = isArabic ? "مرحباً، أريد الاستفسار عن دوراتكم" : "Hello, I want to inquire about your courses"

  const handleSendMessage = () => {
    const finalMessage = message || defaultMessage
    const encodedMessage = encodeURIComponent(finalMessage)
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, "_blank")
  }

  return (
    <>
      {/* Floating Button Container */}
      <div className="fixed bottom-6 right-6 z-50">
        {/* 3D Floating WhatsApp Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative group cursor-pointer"
          aria-label={isArabic ? "فتح دردشة واتساب" : "Open WhatsApp Chat"}
        >
          {/* Outer glow ring */}
          <div className="absolute inset-0 rounded-full bg-green-400/30 blur-md group-hover:blur-lg transition-all duration-300 scale-110 group-hover:scale-125" />
          
          {/* Pulse rings */}
          <div className="absolute inset-0 rounded-full bg-green-500/20 animate-ping" style={{ animationDuration: '2s' }} />
          <div className="absolute inset-0 rounded-full bg-green-500/10 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.5s' }} />
          
          {/* Main button with 3D effect */}
          <div 
            className="relative h-16 w-16 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-active:scale-95"
            style={{
              background: 'linear-gradient(145deg, #25D366 0%, #128C7E 50%, #075E54 100%)',
              boxShadow: `
                0 8px 32px rgba(37, 211, 102, 0.4),
                0 4px 16px rgba(0, 0, 0, 0.2),
                inset 0 2px 4px rgba(255, 255, 255, 0.3),
                inset 0 -2px 4px rgba(0, 0, 0, 0.2)
              `,
              transform: 'perspective(100px) rotateX(5deg)',
            }}
          >
            {/* Inner highlight */}
            <div className="absolute inset-1 rounded-full bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
            
            {/* Icon */}
            {isOpen ? (
              <X className="h-7 w-7 text-white drop-shadow-lg transition-transform duration-300" />
            ) : (
              <WhatsAppIcon className="h-8 w-8 text-white drop-shadow-lg transition-transform duration-300 group-hover:scale-110" />
            )}
          </div>

          {/* Online indicator */}
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-green-400 border-2 border-white shadow-sm" />
          </span>
        </button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <Card
          className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] shadow-2xl border-green-500/30 overflow-hidden"
          dir={isArabic ? "rtl" : "ltr"}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 text-white">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                <MessageCircle className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg" style={{ fontFamily: "var(--font-rubik)" }}>
                  Innovologia
                </h3>
                <p className="text-sm text-white/90">{isArabic ? "نحن متاحون الآن" : "We're available now"}</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                aria-label={isArabic ? "إغلاق" : "Close"}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Chat Body */}
          <div className="p-4 bg-muted/30 min-h-[200px] max-h-[400px] overflow-y-auto space-y-3">
            {/* Welcome Message */}
            <div className="flex gap-2">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
                <MessageCircle className="h-4 w-4 text-white" />
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl rounded-tl-none shadow-sm max-w-[80%]">
                <p className="text-sm text-foreground" style={{ fontFamily: "var(--font-rubik)" }}>
                  {isArabic
                    ? "مرحباً بك في Innovologia! 👋 كيف يمكننا مساعدتك اليوم؟"
                    : "Welcome to Innovologia! 👋 How can we help you today?"}
                </p>
              </div>
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border bg-background">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder={isArabic ? "اكتب رسالتك هنا..." : "Type your message here..."}
                className="flex-1 px-4 py-2 rounded-full border border-border bg-muted/50 focus:outline-none focus:ring-2 focus:ring-green-500 text-foreground"
                style={{ fontFamily: "var(--font-rubik)" }}
              />
              <Button
                onClick={handleSendMessage}
                className="rounded-full h-10 w-10 p-0 bg-gradient-to-br from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 cursor-pointer"
                aria-label={isArabic ? "إرسال" : "Send"}
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  )
}
