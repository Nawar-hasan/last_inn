"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ThumbsUp, MessageCircle, Share2, Pin, MoreVertical, Flag } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import Image from "next/image"

interface PostAuthor {
  id: string
  name: string
  avatar: string
  role: string
}

interface Post {
  id: string
  spaceId: string
  author: PostAuthor
  content: string
  images?: string[]
  likes: number
  comments: number
  shares: number
  isPinned: boolean
  createdAt: string
}

interface CommunityPostCardProps {
  post: Post
  onLike?: (postId: string) => void
  onComment?: (postId: string) => void
  onShare?: (postId: string) => void
}

export function CommunityPostCard({ post, onLike, onComment, onShare }: CommunityPostCardProps) {
  const { language } = useLanguage()
  const isArabic = language === "ar"
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(post.likes)

  const handleLike = async () => {
    setIsLiked(!isLiked)
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1)

    if (onLike) {
      onLike(post.id)
    }

    // Call API
    try {
      await fetch(`/api/community/posts/${post.id}/like`, {
        method: "POST",
      })
    } catch (error) {
      console.error("[v0] Error liking post:", error)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return isArabic ? "منذ دقائق" : "Minutes ago"
    if (diffInHours < 24) return isArabic ? `منذ ${diffInHours} ساعة` : `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return isArabic ? `منذ ${diffInDays} يوم` : `${diffInDays}d ago`
    return date.toLocaleDateString(isArabic ? "ar-EG" : "en-US")
  }

  return (
    <Card className="glass-border overflow-hidden hover:shadow-lg transition-all">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3 flex-1">
            <Avatar className="h-12 w-12">
              <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
              <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-semibold text-base">{post.author.name}</h4>
                <Badge
                  variant="secondary"
                  className={
                    post.author.role === "Instructor" ? "bg-gradient-to-r from-[#551FBD] to-[#7B3FDD] text-white" : ""
                  }
                >
                  {post.author.role === "Instructor"
                    ? isArabic
                      ? "مدرب"
                      : "Instructor"
                    : isArabic
                      ? "طالب"
                      : "Student"}
                </Badge>
                {post.isPinned && (
                  <Badge variant="outline" className="gap-1">
                    <Pin className="h-3 w-3" />
                    {isArabic ? "مثبت" : "Pinned"}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{formatDate(post.createdAt)}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <p className="text-sm leading-relaxed mb-4 whitespace-pre-wrap">{post.content}</p>

        {/* Images */}
        {post.images && post.images.length > 0 && (
          <div className="mb-4 grid grid-cols-2 gap-2">
            {post.images.map((image, index) => (
              <div key={index} className="relative aspect-video rounded-lg overflow-hidden">
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`Post image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`gap-2 ${isLiked ? "text-[#551FBD]" : ""}`}
            >
              <ThumbsUp className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
              <span className="text-sm font-medium">{likesCount}</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onComment?.(post.id)} className="gap-2">
              <MessageCircle className="h-4 w-4" />
              <span className="text-sm font-medium">{post.comments}</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onShare?.(post.id)} className="gap-2">
              <Share2 className="h-4 w-4" />
              <span className="text-sm font-medium">{post.shares}</span>
            </Button>
          </div>
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
            <Flag className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
