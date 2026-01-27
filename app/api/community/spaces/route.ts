import { NextResponse } from "next/server"

// Mock data - سيتم استبداله بـ LearnWorlds API لاحقاً
const mockSpaces = [
  {
    id: "1",
    name: "CInS Community",
    description: "مجتمع دورة اختصاصي الابتكار الأول - نقاشات وتبادل الخبرات",
    courseId: "1",
    courseName: "CInS - First Innovation Specialist",
    memberCount: 847,
    postCount: 1234,
    image: "/course-cins.jpg",
    isPrivate: false,
    lastActivity: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    name: "AInA Community",
    description: "مجتمع دورة مدير الابتكار المعتمد - استراتيجيات وتطبيقات عملية",
    courseId: "2",
    courseName: "AInA - Accredited Innovation Administrator",
    memberCount: 623,
    postCount: 892,
    image: "/course-aina.jpg",
    isPrivate: false,
    lastActivity: "2024-01-14T15:45:00Z",
  },
  {
    id: "3",
    name: "CCInO Community",
    description: "مجتمع دورة قائد التطوير الإبداعي المعتمد - قيادة وإدارة الفرق",
    courseId: "3",
    courseName: "CCInO - Certified Creative and Innovation Officer",
    memberCount: 512,
    postCount: 743,
    image: "/course-ccino.jpg",
    isPrivate: false,
    lastActivity: "2024-01-13T09:20:00Z",
  },
  {
    id: "general",
    name: "General Innovation Hub",
    description: "مجتمع الابتكار العام - للجميع لمشاركة الأفكار والإلهام",
    memberCount: 2450,
    postCount: 5678,
    image: "/community-general.jpg",
    isPrivate: false,
    lastActivity: "2024-01-15T14:10:00Z",
  },
]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get("courseId")

    // Filter by course if provided
    const filteredSpaces = courseId ? mockSpaces.filter((space) => space.courseId === courseId) : mockSpaces

    return NextResponse.json({
      success: true,
      data: filteredSpaces,
    })
  } catch (error) {
    console.error("[v0] Error fetching spaces:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch community spaces",
      },
      { status: 500 },
    )
  }
}
