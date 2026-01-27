"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MessageCircle, ThumbsUp, Flag } from "lucide-react"

interface Comment {
  id: number
  author: string
  avatar: string
  content: string
  timestamp: string
  likes: number
}

interface CommentsProps {
  comments?: Comment[]
  onAddComment?: (text: string) => void
}

export function CommentsSection({ comments = [], onAddComment }: CommentsProps) {
  const [newComment, setNewComment] = useState("")
  const [liked, setLiked] = useState<number[]>([])

  const handlePost = () => {
    if (newComment.trim()) {
      console.log("[v0] Posting comment:", newComment)
      onAddComment?.(newComment)
      setNewComment("")
    }
  }

  const toggleLike = (commentId: number) => {
    setLiked((prev) => (prev.includes(commentId) ? prev.filter((id) => id !== commentId) : [...prev, commentId]))
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Lesson Comments
        </h3>

        {/* New Comment Form */}
        <Card className="p-4 glass-border mb-6">
          <div className="space-y-3">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts about this lesson..."
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground resize-none"
              rows={3}
            />
            <div className="flex justify-end">
              <Button onClick={handlePost} disabled={!newComment.trim()} className="bg-primary hover:bg-primary/90">
                Post Comment
              </Button>
            </div>
          </div>
        </Card>

        {/* Comments List */}
        <div className="space-y-4">
          {comments.map((comment) => (
            <Card key={comment.id} className="p-4 glass-border">
              <div className="flex gap-3">
                <img
                  src={comment.avatar || "/placeholder.svg?key=default"}
                  alt={comment.author}
                  className="h-10 w-10 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{comment.author}</p>
                      <p className="text-xs text-muted-foreground">{comment.timestamp}</p>
                    </div>
                  </div>
                  <p className="mt-2 text-sm">{comment.content}</p>
                  <div className="flex gap-4 mt-3">
                    <button
                      onClick={() => toggleLike(comment.id)}
                      className={`flex items-center gap-1 text-sm ${
                        liked.includes(comment.id) ? "text-primary" : "text-muted-foreground hover:text-primary"
                      }`}
                    >
                      <ThumbsUp className="h-4 w-4" />
                      {comment.likes}
                    </button>
                    <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-destructive">
                      <Flag className="h-4 w-4" />
                      Report
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
