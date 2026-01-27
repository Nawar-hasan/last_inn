"use client"

import type React from "react"

import { SiteHeader } from "@/components/site-header"
import { AppverseFooter } from "@/components/appverse-footer"
import { useLanguage } from "@/lib/language-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Mail, Phone, MapPin, Send } from "lucide-react"
import { useState } from "react"

export default function ContactPage() {
  const { language } = useLanguage()
  const isArabic = language === "ar"
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Connect to LearnWorld or email API
    console.log("Contact form submitted:", formData)
  }

  const contactInfo = [
    {
      icon: Mail,
      label: isArabic ? "البريد الإلكتروني" : "Email",
      value: "info@innovologia.com",
      link: "mailto:info@innovologia.com",
    },
    {
      icon: Phone,
      label: isArabic ? "الهاتف" : "Phone",
      value: "+966 XX XXX XXXX",
      link: "tel:+966XXXXXXXXX",
    },
    {
      icon: MapPin,
      label: isArabic ? "الموقع" : "Location",
      value: isArabic ? "المملكة العربية السعودية" : "Saudi Arabia",
      link: null,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <div className="relative overflow-hidden">
        {/* Plasma Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#1a1a2e] to-[#0a0a0a]" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#551FBD] rounded-full blur-[128px] opacity-20 animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#7B3FDD] rounded-full blur-[128px] opacity-20 animate-pulse delay-1000" />
        </div>

        <div className="container mx-auto px-4 py-20" dir={isArabic ? "rtl" : "ltr"}>
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#551FBD] to-[#7B3FDD] bg-clip-text text-transparent">
                {isArabic ? "تواصل معنا" : "Contact Us"}
              </h1>
              <p className="text-foreground/70 text-lg">
                {isArabic
                  ? "نحن هنا للإجابة على استفساراتك ومساعدتك"
                  : "We're here to answer your questions and help you"}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Contact Form */}
              <Card className="glass-border-enhanced p-8">
                <h2 className="text-2xl font-bold mb-6">{isArabic ? "أرسل لنا رسالة" : "Send us a message"}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">{isArabic ? "الاسم" : "Name"}</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={isArabic ? "أدخل اسمك" : "Enter your name"}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">{isArabic ? "البريد الإلكتروني" : "Email"}</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder={isArabic ? "أدخل بريدك الإلكتروني" : "Enter your email"}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">{isArabic ? "رقم الهاتف" : "Phone"}</label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder={isArabic ? "أدخل رقم هاتفك" : "Enter your phone"}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">{isArabic ? "الرسالة" : "Message"}</label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder={isArabic ? "اكتب رسالتك هنا" : "Write your message here"}
                      className="w-full min-h-32 p-3 border border-border rounded-lg bg-background"
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full gap-2">
                    <Send size={20} />
                    {isArabic ? "إرسال الرسالة" : "Send Message"}
                  </Button>
                </form>
              </Card>

              {/* Contact Info */}
              <div className="space-y-6">
                <Card className="glass-border-enhanced p-8">
                  <h2 className="text-2xl font-bold mb-6">{isArabic ? "معلومات الاتصال" : "Contact Information"}</h2>
                  <div className="space-y-6">
                    {contactInfo.map((item, index) => {
                      const Icon = item.icon
                      return (
                        <div key={index} className="flex items-start gap-4">
                          <div className="p-3 bg-gradient-to-br from-[#551FBD] to-[#7B3FDD] rounded-lg flex-shrink-0">
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="text-sm text-foreground/70 mb-1">{item.label}</p>
                            {item.link ? (
                              <a href={item.link} className="font-bold text-lg hover:text-[#551FBD] transition-colors">
                                {item.value}
                              </a>
                            ) : (
                              <p className="font-bold text-lg">{item.value}</p>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </Card>

                <Card className="glass-border-enhanced p-8">
                  <h2 className="text-2xl font-bold mb-4">{isArabic ? "ساعات العمل" : "Working Hours"}</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-foreground/70">{isArabic ? "الأحد - الخميس" : "Sunday - Thursday"}</span>
                      <span className="font-bold">9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">{isArabic ? "الجمعة - السبت" : "Friday - Saturday"}</span>
                      <span className="font-bold">{isArabic ? "مغلق" : "Closed"}</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AppverseFooter />
    </div>
  )
}
