import { type NextRequest, NextResponse } from "next/server"
import { learnworldsClient } from "@/lib/learnworlds-client"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { studentId, courseId, quizId, answers } = body

    if (!studentId || !quizId || !answers) {
      return NextResponse.json({ error: "Missing required fields: studentId, quizId, and answers" }, { status: 400 })
    }

    if (!learnworldsClient.isConfigured()) {
      return NextResponse.json({ error: "Quiz service not configured. Please contact support." }, { status: 503 })
    }

    try {
      const result = await learnworldsClient.submitQuiz(studentId, courseId, quizId, answers)

      const formattedResult = {
        id: result.id || `attempt-${Date.now()}`,
        studentId,
        courseId,
        quizId,
        score: result.score || result.points,
        percentage: result.percentage || result.score_percentage,
        totalQuestions: result.total_questions || result.questions_count,
        correctAnswers: result.correct_answers || result.correct_count,
        passed: result.passed || result.is_passed,
        passingScore: result.passing_score || result.pass_threshold || 70,
        answers: answers,
        feedback: result.feedback || [],
        completedAt: result.completed_at || new Date().toISOString(),
        timeSpent: result.time_spent_seconds || result.duration,
      }

      return NextResponse.json(formattedResult)
    } catch (apiError: any) {
      console.error("[Quiz Submit] API error:", apiError.message)
      return NextResponse.json({ error: apiError.message || "Failed to submit quiz" }, { status: 500 })
    }
  } catch (error) {
    console.error("[Quiz Submit] Unexpected error:", error)
    return NextResponse.json({ error: "Failed to submit quiz" }, { status: 500 })
  }
}
