"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/language-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Users,
  TrendingUp,
  MessageSquare,
  Calendar,
  Search,
  Plus,
  ThumbsUp,
  MessageCircle,
  Share2,
  Filter,
  Crown,
  Star,
  Rocket,
  Pin,
  ImageIcon,
  Smile,
} from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { AppverseFooter } from "@/components/appverse-footer"

export default function CommunityHomePage() {
  const { language } = useLanguage()
  const isArabic = language === "ar"
  const [activeTab, setActiveTab] = useState("feed")
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // Mock data for demonstration
  const communityStats = {
    members: 2847,
    posts: 1523,
    activeToday: 342,
    events: 5,
  }

  const trendingTopics = [
    { id: 1, name: isArabic ? "تقنيات الابتكار" : "Innovation Techniques", posts: 234 },
    { id: 2, name: isArabic ? "دراسات حالة" : "Case Studies", posts: 189 },
    { id: 3, name: isArabic ? "التحول الرقمي" : "Digital Transformation", posts: 156 },
    { id: 4, name: isArabic ? "ريادة الأعمال" : "Entrepreneurship", posts: 142 },
    { id: 5, name: isArabic ? "القيادة" : "Leadership", posts: 128 },
  ]

  const upcomingEvents = [
    {
      id: 1,
      title: isArabic ? "جلسة نقاش: مستقبل الابتكار" : "Discussion: Future of Innovation",
      date: "2024-01-25",
      time: "18:00",
      attendees: 45,
    },
    {
      id: 2,
      title: isArabic ? "ورشة عمل: التفكير التصميمي" : "Workshop: Design Thinking",
      date: "2024-01-28",
      time: "15:00",
      attendees: 32,
    },
    {
      id: 3,
      title: isArabic ? "لقاء شهري: شبكة المبتكرين" : "Monthly Meetup: Innovators Network",
      date: "2024-02-01",
      time: "19:00",
      attendees: 78,
    },
  ]

  const mockPosts = [
    {
      id: 1,
      author: {
        name: isArabic ? "د. أحمد الشمري" : "Dr. Ahmed Al-Shamri",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Expert",
        badge: "elite",
      },
      content: isArabic
        ? "سعيد بمشاركة هذا المقال المهم حول تطبيق منهجية Design Thinking في المؤسسات العربية. ما رأيكم في التحديات التي نواجهها؟"
        : "Happy to share this important article about applying Design Thinking methodology in Arab organizations. What are your thoughts on the challenges we face?",
      timestamp: "2h ago",
      likes: 45,
      comments: 12,
      shares: 8,
      isPinned: true,
      hasImage: true,
    },
    {
      id: 2,
      author: {
        name: isArabic ? "سارة محمود" : "Sarah Mahmoud",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Member",
        badge: "professional",
      },
      content: isArabic
        ? "انتهيت للتو من دورة CInS وأريد أن أشارككم تجربتي المذهلة! التطبيق العملي للابتكار في مشروعي الخاص كان تحويلياً بكل معنى الكلمة."
        : "Just completed the CInS course and want to share my amazing experience! Applying innovation practically in my own project was truly transformational.",
      timestamp: "5h ago",
      likes: 67,
      comments: 23,
      shares: 15,
      isPinned: false,
      hasImage: false,
    },
    {
      id: 3,
      author: {
        name: isArabic ? "محمد عبدالله" : "Mohammed Abdullah",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Member",
        badge: "free",
      },
      content: isArabic
        ? "هل يمكن لأحد أن يشاركني أمثلة عملية عن تطبيق Lean Startup في الشركات الناشئة؟"
        : "Can someone share practical examples of applying Lean Startup in startups?",
      timestamp: "1d ago",
      likes: 23,
      comments: 18,
      shares: 3,
      isPinned: false,
      hasImage: false,
    },
  ]

  useEffect(() => {
    setPosts(mockPosts)
  }, [])

  const getBadgeIcon = (badge: string) => {
    switch (badge) {
      case "elite":
        return <Crown className="h-3 w-3" />
      case "professional":
        return <Star className="h-3 w-3" />
      case "free":
        return <Rocket className="h-3 w-3" />
      default:
        return null
    }
  }

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case "elite":
        return "bg-gradient-to-r from-amber-500 to-yellow-500 text-white"
      case "professional":
        return "bg-gradient-to-r from-[#551FBD] to-[#7B3FDD] text-white"
      case "free":
        return "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
      default:
        return ""
    }
  }

  return (
    <main className="min-h-[100dvh]">
      <SiteHeader />
      <div className="relative min-h-screen overflow-hidden">
        {/* Plasma Background */}
        <div className="plasma-bg" />

        <div className="relative z-10 pt-24 pb-12">
          <div className="container mx-auto px-4">
            {/* Community Header */}
            <div className="text-center mb-8">
              <h1
                className="text-4xl sm:text-5xl font-bold tracking-tight mb-3"
                style={{ fontFamily: "var(--font-rubik)" }}
              >
                <span className="bg-gradient-to-r from-[#551FBD] to-[#7B3FDD] bg-clip-text text-transparent">
                  {isArabic ? "مجتمع المبتكرين" : "Innovators Community"}
                </span>
              </h1>
              <p className="text-foreground/70 text-lg max-w-2xl mx-auto" style={{ fontFamily: "var(--font-rubik)" }}>
                {isArabic
                  ? "انضم إلى آلاف المبتكرين والقادة وشارك أفكارك وخبراتك"
                  : "Join thousands of innovators and leaders to share ideas and experiences"}
              </p>
            </div>

            {/* Community Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card className="glass-border p-4 text-center">
                <Users className="h-8 w-8 mx-auto mb-2 text-[#551FBD]" />
                <div className="text-2xl font-bold" style={{ fontFamily: "var(--font-rubik)" }}>
                  {communityStats.members.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">{isArabic ? "الأعضاء" : "Members"}</div>
              </Card>

              <Card className="glass-border p-4 text-center">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 text-[#551FBD]" />
                <div className="text-2xl font-bold" style={{ fontFamily: "var(--font-rubik)" }}>
                  {communityStats.posts.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">{isArabic ? "المنشورات" : "Posts"}</div>
              </Card>

              <Card className="glass-border p-4 text-center">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-[#551FBD]" />
                <div className="text-2xl font-bold" style={{ fontFamily: "var(--font-rubik)" }}>
                  {communityStats.activeToday.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">{isArabic ? "نشط اليوم" : "Active Today"}</div>
              </Card>

              <Card className="glass-border p-4 text-center">
                <Calendar className="h-8 w-8 mx-auto mb-2 text-[#551FBD]" />
                <div className="text-2xl font-bold" style={{ fontFamily: "var(--font-rubik)" }}>
                  {communityStats.events}
                </div>
                <div className="text-sm text-muted-foreground">{isArabic ? "الفعاليات" : "Events"}</div>
              </Card>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Sidebar */}
              <div className="lg:col-span-1 space-y-6">
                {/* Search */}
                <Card className="glass-border p-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={isArabic ? "ابحث في المجتمع..." : "Search community..."}
                      className="pl-10"
                      style={{ fontFamily: "var(--font-rubik)" }}
                    />
                  </div>
                </Card>

                {/* Trending Topics */}
                <Card className="glass-border p-4">
                  <h3
                    className="font-semibold mb-4 flex items-center gap-2"
                    style={{ fontFamily: "var(--font-rubik)" }}
                  >
                    <TrendingUp className="h-5 w-5 text-[#551FBD]" />
                    {isArabic ? "المواضيع الرائجة" : "Trending Topics"}
                  </h3>
                  <div className="space-y-3">
                    {trendingTopics.map((topic, index) => (
                      <button
                        key={topic.id}
                        className="w-full text-left flex items-center justify-between p-2 rounded-lg hover:bg-accent transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-[#551FBD] font-bold">#{index + 1}</span>
                          <span className="text-sm" style={{ fontFamily: "var(--font-rubik)" }}>
                            {topic.name}
                          </span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {topic.posts}
                        </Badge>
                      </button>
                    ))}
                  </div>
                </Card>

                {/* Upcoming Events */}
                <Card className="glass-border p-4">
                  <h3
                    className="font-semibold mb-4 flex items-center gap-2"
                    style={{ fontFamily: "var(--font-rubik)" }}
                  >
                    <Calendar className="h-5 w-5 text-[#551FBD]" />
                    {isArabic ? "الفعاليات القادمة" : "Upcoming Events"}
                  </h3>
                  <div className="space-y-3">
                    {upcomingEvents.map((event) => (
                      <div key={event.id} className="p-3 rounded-lg bg-accent/50 border border-border">
                        <h4 className="font-medium text-sm mb-2" style={{ fontFamily: "var(--font-rubik)" }}>
                          {event.title}
                        </h4>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{event.date}</span>
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                          <Users className="h-3 w-3" />
                          <span>
                            {event.attendees} {isArabic ? "حضور" : "attending"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4 bg-transparent" size="sm">
                    {isArabic ? "عرض كل الفعاليات" : "View All Events"}
                  </Button>
                </Card>
              </div>

              {/* Main Feed */}
              <div className="lg:col-span-2 space-y-6">
                {/* Create Post Card */}
                <Card className="glass-border p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="/placeholder.svg?height=40&width=40" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Textarea
                        placeholder={
                          isArabic ? "شارك أفكارك مع المجتمع..." : "Share your thoughts with the community..."
                        }
                        className="min-h-[100px] resize-none"
                        style={{ fontFamily: "var(--font-rubik)" }}
                      />
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" className="gap-2">
                            <ImageIcon className="h-4 w-4" />
                            {isArabic ? "صورة" : "Image"}
                          </Button>
                          <Button variant="ghost" size="sm" className="gap-2">
                            <Smile className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button
                          className="bg-gradient-to-r from-[#551FBD] to-[#7B3FDD] hover:from-[#551FBD]/90 hover:to-[#7B3FDD]/90"
                          size="sm"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          {isArabic ? "نشر" : "Post"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Filter Tabs */}
                <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                  <div className="flex items-center justify-between mb-4">
                    <TabsList>
                      <TabsTrigger value="all">{isArabic ? "الكل" : "All"}</TabsTrigger>
                      <TabsTrigger value="following">{isArabic ? "المتابَعون" : "Following"}</TabsTrigger>
                      <TabsTrigger value="trending">{isArabic ? "الأكثر شهرة" : "Trending"}</TabsTrigger>
                    </TabsList>
                    <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                      <Filter className="h-4 w-4" />
                      {isArabic ? "تصفية" : "Filter"}
                    </Button>
                  </div>

                  <TabsContent value="all" className="space-y-4 mt-0">
                    {posts.map((post) => (
                      <Card key={post.id} className="glass-border p-6">
                        {/* Post Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start gap-3">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={post.author.avatar || "/placeholder.svg"} />
                              <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="font-semibold" style={{ fontFamily: "var(--font-rubik)" }}>
                                  {post.author.name}
                                </h4>
                                <Badge className={`${getBadgeColor(post.author.badge)} gap-1 text-xs`}>
                                  {getBadgeIcon(post.author.badge)}
                                  {post.author.role}
                                </Badge>
                                {post.isPinned && (
                                  <Badge variant="outline" className="gap-1 text-xs">
                                    <Pin className="h-3 w-3" />
                                    {isArabic ? "مثبت" : "Pinned"}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">{post.timestamp}</p>
                            </div>
                          </div>
                        </div>

                        {/* Post Content */}
                        <p className="text-sm leading-relaxed mb-4" style={{ fontFamily: "var(--font-rubik)" }}>
                          {post.content}
                        </p>

                        {/* Post Image */}
                        {post.hasImage && (
                          <div className="relative aspect-video rounded-lg overflow-hidden mb-4 bg-accent/50">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <ImageIcon className="h-12 w-12 text-muted-foreground" />
                            </div>
                          </div>
                        )}

                        {/* Post Actions */}
                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm" className="gap-2">
                              <ThumbsUp className="h-4 w-4" />
                              <span className="text-sm">{post.likes}</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="gap-2">
                              <MessageCircle className="h-4 w-4" />
                              <span className="text-sm">{post.comments}</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="gap-2">
                              <Share2 className="h-4 w-4" />
                              <span className="text-sm">{post.shares}</span>
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </TabsContent>

                  <TabsContent value="following">
                    <Card className="glass-border p-12 text-center">
                      <p className="text-muted-foreground">
                        {isArabic ? "المنشورات من المتابَعين" : "Posts from people you follow"}
                      </p>
                    </Card>
                  </TabsContent>

                  <TabsContent value="trending">
                    <Card className="glass-border p-12 text-center">
                      <p className="text-muted-foreground">
                        {isArabic ? "المنشورات الأكثر تفاعلاً" : "Most engaged posts"}
                      </p>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AppverseFooter />
    </main>
  )
}
