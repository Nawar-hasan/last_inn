"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ImageIcon, Smile, Send } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { useAuth } from "@/lib/auth-context"

interface CreatePostCardProps {
  spaceId: string
  onPostCreated?: () => void
}

export function CreatePostCard({ spaceId, onPostCreated }: CreatePostCardProps) {
  const { language } = useLanguage()
  const { student } = useAuth()
  const isArabic = language === "ar"
  const [content, setContent] = useState("")
  const [isPosting, setIsPosting] = useState(false)

  const handleSubmit = async () => {
    if (!content.trim()) return

    setIsPosting(true)
    try {
      const response = await fetch("/api/community/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          spaceId,
          content,
          images: [],
        }),
      })

      if (response.ok) {
        setContent("")
        if (onPostCreated) {
          onPostCreated()
        }
      }
    } catch (error) {
      console.error("[v0] Error creating post:", error)
    } finally {
      setIsPosting(false)
    }
  }

  return (
    <Card className="glass-border p-6">
      <div className="flex gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={student?.avatar || "/placeholder.svg"} alt={student?.firstName || "User"} />
          <AvatarFallback>{student?.firstName?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={isArabic ? "شارك أفكارك مع المجتمع..." : "Share your thoughts with the community..."}
            className="w-full min-h-[100px] px-4 py-3 rounded-lg border border-border bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-[#551FBD]"
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="gap-2">
                <ImageIcon className="h-4 w-4" />
                {isArabic ? "صورة" : "Image"}
              </Button>
              <Button variant="ghost" size="sm" className="gap-2">
                <Smile className="h-4 w-4" />
                {isArabic ? "رموز" : "Emoji"}
              </Button>
            </div>
            <Button
              onClick={handleSubmit}
              disabled={!content.trim() || isPosting}
              className="bg-gradient-to-r from-[#551FBD] to-[#7B3FDD] gap-2"
            >
              <Send className="h-4 w-4" />
              {isPosting ? (isArabic ? "جاري النشر..." : "Posting...") : isArabic ? "نشر" : "Post"}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
