import { NextResponse } from "next/server"

export async function POST(request: Request, { params }: { params: { postId: string } }) {
  try {
    const { postId } = params

    console.log("[v0] Toggling like for post:", postId)

    // Mock response - في LearnWorlds API ستكون عملية حقيقية
    return NextResponse.json({
      success: true,
      data: {
        postId,
        isLiked: true,
        likesCount: Math.floor(Math.random() * 100),
      },
    })
  } catch (error) {
    console.error("[v0] Error toggling like:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to toggle like",
      },
      { status: 500 },
    )
  }
}
