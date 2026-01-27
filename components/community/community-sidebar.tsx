"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, TrendingUp, Calendar, Award } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import Link from "next/link"

interface Space {
  id: string
  name: string
  memberCount: number
  postCount: number
  courseName?: string
}

interface CommunitySidebarProps {
  spaces: Space[]
  currentSpaceId?: string
}

export function CommunitySidebar({ spaces, currentSpaceId }: CommunitySidebarProps) {
  const { language } = useLanguage()
  const isArabic = language === "ar"

  return (
    <div className="space-y-6">
      {/* Current Space Stats */}
      {currentSpaceId && (
        <Card className="glass-border p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[#551FBD]" />
            {isArabic ? "إحصائيات المجتمع" : "Community Stats"}
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4" />
                {isArabic ? "الأعضاء" : "Members"}
              </span>
              <Badge variant="secondary">{spaces.find((s) => s.id === currentSpaceId)?.memberCount || 0}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {isArabic ? "المنشورات" : "Posts"}
              </span>
              <Badge variant="secondary">{spaces.find((s) => s.id === currentSpaceId)?.postCount || 0}</Badge>
            </div>
          </div>
        </Card>
      )}

      {/* All Spaces */}
      <Card className="glass-border p-6">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Award className="h-5 w-5 text-[#551FBD]" />
          {isArabic ? "المجتمعات" : "Communities"}
        </h3>
        <div className="space-y-2">
          {spaces.map((space) => (
            <Link key={space.id} href={`/student/community/${space.id}`}>
              <Button
                variant={currentSpaceId === space.id ? "secondary" : "ghost"}
                className="w-full justify-start text-left"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{space.name}</p>
                  {space.courseName && <p className="text-xs text-muted-foreground truncate">{space.courseName}</p>}
                </div>
                <Badge variant="outline" className="ml-2">
                  {space.memberCount}
                </Badge>
              </Button>
            </Link>
          ))}
        </div>
      </Card>

      {/* Community Guidelines */}
      <Card className="glass-border p-6 bg-gradient-to-br from-[#551FBD]/5 to-[#7B3FDD]/5">
        <h3 className="font-bold text-sm mb-3">{isArabic ? "قواعد المجتمع" : "Community Guidelines"}</h3>
        <ul className="text-xs text-muted-foreground space-y-2">
          <li>{isArabic ? "• احترم الآخرين وآرائهم" : "• Respect others and their opinions"}</li>
          <li>{isArabic ? "• شارك محتوى مفيد وبناء" : "• Share helpful and constructive content"}</li>
          <li>{isArabic ? "• لا تنشر محتوى مسيء أو غير لائق" : "• No offensive or inappropriate content"}</li>
          <li>
            {isArabic ? "• ساعد الآخرين واطلب المساعدة عند الحاجة" : "• Help others and ask for help when needed"}
          </li>
        </ul>
      </Card>
    </div>
  )
}
