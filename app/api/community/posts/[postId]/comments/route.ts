import { NextResponse } from "next/server"

const mockComments: Record<string, any[]> = {
  "1": [
    {
      id: "c1",
      author: {
        name: "سارة أحمد",
        avatar: "/placeholder.svg?height=32&width=32",
        role: "Student",
      },
      content: "مرحباً أحمد! أهم نصيحة: ابدأ بالممارسة العملية وطبق ما تتعلمه فوراً",
      likes: 12,
      createdAt: "2024-01-15T11:00:00Z",
    },
    {
      id: "c2",
      author: {
        name: "محمد علي",
        avatar: "/placeholder.svg?height=32&width=32",
        role: "Instructor",
      },
      content: "أنصحك بالانضمام إلى ورش العمل الأسبوعية والتواصل مع زملائك في المجتمع",
      likes: 8,
      createdAt: "2024-01-15T11:30:00Z",
    },
  ],
}

export async function GET(request: Request, { params }: { params: { postId: string } }) {
  try {
    const { postId } = params

    const comments = mockComments[postId] || []

    return NextResponse.json({
      success: true,
      data: comments,
    })
  } catch (error) {
    console.error("[v0] Error fetching comments:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch comments",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: Request, { params }: { params: { postId: string } }) {
  try {
    const { postId } = params
    const body = await request.json()
    const { content } = body

    if (!content) {
      return NextResponse.json(
        {
          success: false,
          error: "Content is required",
        },
        { status: 400 },
      )
    }

    const newComment = {
      id: `comment-${Date.now()}`,
      author: {
        name: "أنت",
        avatar: "/placeholder.svg?height=32&width=32",
        role: "Student",
      },
      content,
      likes: 0,
      createdAt: new Date().toISOString(),
    }

    console.log("[v0] Created comment for post", postId, ":", newComment)

    return NextResponse.json({
      success: true,
      data: newComment,
    })
  } catch (error) {
    console.error("[v0] Error creating comment:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create comment",
      },
      { status: 500 },
    )
  }
}
