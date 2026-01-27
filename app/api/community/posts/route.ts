import { NextResponse } from "next/server"

// Mock posts data
const mockPosts = [
  {
    id: "1",
    spaceId: "1",
    author: {
      id: "user1",
      name: "أحمد محمد",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Student",
    },
    content: "مرحباً بالجميع! أنا متحمس جداً لبدء رحلتي في عالم الابتكار. هل لديكم أي نصائح للمبتدئين؟",
    images: [],
    likes: 24,
    comments: 8,
    shares: 3,
    isPinned: false,
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    spaceId: "1",
    author: {
      id: "instructor1",
      name: "د. سارة العلي",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Instructor",
    },
    content: "مشروع جديد رائع! أحد طلابنا طور تطبيق مبتكر لإدارة الوقت باستخدام الذكاء الاصطناعي. تهانينا! 🎉",
    images: ["/ai-time-management-app.jpg"],
    likes: 89,
    comments: 23,
    shares: 15,
    isPinned: true,
    createdAt: "2024-01-14T15:20:00Z",
    updatedAt: "2024-01-14T15:20:00Z",
  },
  {
    id: "3",
    spaceId: "1",
    author: {
      id: "user2",
      name: "فاطمة خالد",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Student",
    },
    content: "للتو أنهيت الوحدة الثالثة! الأدوات التي تعلمناها في تحليل المشاكل كانت مفيدة جداً. شكراً للفريق! 💡",
    images: [],
    likes: 45,
    comments: 12,
    shares: 5,
    isPinned: false,
    createdAt: "2024-01-14T09:15:00Z",
    updatedAt: "2024-01-14T09:15:00Z",
  },
  {
    id: "4",
    spaceId: "general",
    author: {
      id: "user3",
      name: "خالد عبدالله",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Student",
    },
    content: "هل يمكن لأحد أن يشارك تجربته في تطبيق منهجية Design Thinking في مشروع حقيقي؟ أبحث عن أمثلة عملية.",
    images: [],
    likes: 67,
    comments: 34,
    shares: 8,
    isPinned: false,
    createdAt: "2024-01-13T14:45:00Z",
    updatedAt: "2024-01-13T14:45:00Z",
  },
]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const spaceId = searchParams.get("spaceId")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    // Filter by space if provided
    let filteredPosts = spaceId ? mockPosts.filter((post) => post.spaceId === spaceId) : mockPosts

    // Sort by pinned first, then by date
    filteredPosts = filteredPosts.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

    // Limit results
    filteredPosts = filteredPosts.slice(0, limit)

    return NextResponse.json({
      success: true,
      data: filteredPosts,
      total: filteredPosts.length,
    })
  } catch (error) {
    console.error("[v0] Error fetching posts:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch posts",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { spaceId, content, images } = body

    // Validate input
    if (!spaceId || !content) {
      return NextResponse.json(
        {
          success: false,
          error: "Space ID and content are required",
        },
        { status: 400 },
      )
    }

    // Create new post (mock)
    const newPost = {
      id: `post-${Date.now()}`,
      spaceId,
      author: {
        id: "current-user",
        name: "أنت",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Student",
      },
      content,
      images: images || [],
      likes: 0,
      comments: 0,
      shares: 0,
      isPinned: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    console.log("[v0] Created new post:", newPost)

    return NextResponse.json({
      success: true,
      data: newPost,
    })
  } catch (error) {
    console.error("[v0] Error creating post:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create post",
      },
      { status: 500 },
    )
  }
}
