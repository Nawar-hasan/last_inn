"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/language-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, ThumbsUp, Send, Pin, TrendingUp, Clock, Users, ArrowLeft, Search } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"

export default function CourseDiscussionsPage({ params }: { params: { id: string } }) {
  const { language } = useLanguage()
  const isArabic = language === "ar"
  const [newPost, setNewPost] = useState("")

  // Mock data - سيتم استبداله بـ LearnWorlds API
  const courseTitle = "محترف الابتكار المعتمد"
  const discussions = [
    {
      id: 1,
      author: "أحمد محمد",
      avatar: "/placeholder.svg?height=40&width=40",
      time: "منذ ساعتين",
      content: "هل يمكن لأحد أن يشرح لي مفهوم التفكير التصميمي بطريقة مبسطة؟",
      likes: 12,
      replies: 5,
      isPinned: true,
      tags: ["الوحدة 1", "سؤال"],
    },
    {
      id: 2,
      author: "سارة أحمد",
      avatar: "/placeholder.svg?height=40&width=40",
      time: "منذ 4 ساعات",
      content: "شاركت مشروعي النهائي! أتمنى أن تستفيدوا من الأفكار المطروحة فيه.",
      likes: 24,
      replies: 8,
      isPinned: false,
      tags: ["مشروع", "مشاركة"],
    },
    {
      id: 3,
      author: "خالد علي",
      avatar: "/placeholder.svg?height=40&width=40",
      time: "منذ يوم",
      content: "ما هي أفضل الأدوات للبحث عن الأفكار المبتكرة في مجال التكنولوجيا؟",
      likes: 18,
      replies: 12,
      isPinned: false,
      tags: ["أدوات", "موارد"],
    },
  ]

  const stats = {
    totalPosts: 156,
    activeMembers: 89,
    totalReplies: 432,
  }

  const handleSubmitPost = () => {
    if (newPost.trim()) {
      console.log("New post:", newPost)
      setNewPost("")
    }
  }

  return (
    <div className="space-y-6" dir={isArabic ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="glass-border-enhanced p-6 rounded-xl">
        <Link
          href={`/student/courses/${params.id}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft size={16} className={isArabic ? "rotate-180" : ""} />
          {isArabic ? "العودة للدورة" : "Back to Course"}
        </Link>
        <h1 className="text-3xl font-bold mb-2">{isArabic ? "نقاشات الدورة" : "Course Discussions"}</h1>
        <p className="text-muted-foreground">{courseTitle}</p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <MessageSquare className="h-6 w-6 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{stats.totalPosts}</div>
            <div className="text-sm text-muted-foreground">{isArabic ? "منشور" : "Posts"}</div>
          </div>
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{stats.activeMembers}</div>
            <div className="text-sm text-muted-foreground">{isArabic ? "عضو نشط" : "Active Members"}</div>
          </div>
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <TrendingUp className="h-6 w-6 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{stats.totalReplies}</div>
            <div className="text-sm text-muted-foreground">{isArabic ? "تعليق" : "Replies"}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Create Post */}
          <Card className="glass-border p-6">
            <h2 className="font-bold text-lg mb-4">{isArabic ? "إنشاء منشور جديد" : "Create New Post"}</h2>
            <Textarea
              placeholder={isArabic ? "شارك سؤالك أو فكرتك..." : "Share your question or idea..."}
              className="mb-4 min-h-32"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
            />
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
                  {isArabic ? "سؤال" : "Question"}
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
                  {isArabic ? "مشاركة" : "Share"}
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
                  {isArabic ? "مساعدة" : "Help"}
                </Badge>
              </div>
              <Button onClick={handleSubmitPost} className="gap-2">
                <Send size={16} />
                {isArabic ? "نشر" : "Post"}
              </Button>
            </div>
          </Card>

          {/* Search & Filter */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder={isArabic ? "ابحث في النقاشات..." : "Search discussions..."} className="pl-9" />
            </div>
            <Button variant="outline">{isArabic ? "الأحدث" : "Latest"}</Button>
          </div>

          {/* Discussions List */}
          <div className="space-y-4">
            {discussions.map((discussion) => (
              <Card key={discussion.id} className="glass-border p-6 hover:shadow-lg transition-shadow">
                {discussion.isPinned && (
                  <div className="flex items-center gap-2 text-sm text-primary mb-3">
                    <Pin size={16} />
                    <span>{isArabic ? "مثبت" : "Pinned"}</span>
                  </div>
                )}

                <div className="flex gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={discussion.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{discussion.author[0]}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="font-semibold">{discussion.author}</span>
                        <span className="text-sm text-muted-foreground mx-2">•</span>
                        <span className="text-sm text-muted-foreground flex items-center gap-1 inline-flex">
                          <Clock size={14} />
                          {discussion.time}
                        </span>
                      </div>
                    </div>

                    <p className="text-foreground mb-3 leading-relaxed">{discussion.content}</p>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {discussion.tags.map((tag, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center gap-6 text-sm">
                      <Button variant="ghost" size="sm" className="gap-2 hover:text-primary">
                        <ThumbsUp size={16} />
                        {discussion.likes}
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-2 hover:text-primary">
                        <MessageSquare size={16} />
                        {discussion.replies} {isArabic ? "رد" : "replies"}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Community Guidelines */}
          <Card className="glass-border p-6">
            <h3 className="font-bold mb-4">{isArabic ? "إرشادات المجتمع" : "Community Guidelines"}</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2" />
                <span>{isArabic ? "كن محترماً ولطيفاً مع الآخرين" : "Be respectful and kind to others"}</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2" />
                <span>{isArabic ? "شارك محتوى ذو قيمة" : "Share valuable content"}</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2" />
                <span>{isArabic ? "لا تنشر محتوى مسيء أو غير لائق" : "No offensive or inappropriate content"}</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2" />
                <span>{isArabic ? "ساعد الآخرين وشارك خبراتك" : "Help others and share your expertise"}</span>
              </li>
            </ul>
          </Card>

          {/* Popular Topics */}
          <Card className="glass-border p-6">
            <h3 className="font-bold mb-4">{isArabic ? "المواضيع الشائعة" : "Popular Topics"}</h3>
            <div className="space-y-2">
              <Badge variant="secondary" className="w-full justify-center py-2">
                {isArabic ? "التفكير التصميمي" : "Design Thinking"}
              </Badge>
              <Badge variant="secondary" className="w-full justify-center py-2">
                {isArabic ? "الابتكار المفتوح" : "Open Innovation"}
              </Badge>
              <Badge variant="secondary" className="w-full justify-center py-2">
                {isArabic ? "إدارة المشاريع" : "Project Management"}
              </Badge>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
