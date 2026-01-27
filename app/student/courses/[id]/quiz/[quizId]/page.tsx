"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/language-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Clock, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Question {
  id: string
  question: string
  questionAr: string
  type: "multiple-choice" | "true-false"
  options: Array<{ id: string; text: string; textAr: string }>
  correctAnswer: string
}

export default function QuizPage({ params }: { params: { id: string; quizId: string } }) {
  const { t } = useLanguage()
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [timeLeft, setTimeLeft] = useState(30 * 60) // 30 minutes
  const [showResults, setShowResults] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // Mock quiz data - Replace with LearnWorld API
  const quiz: Question[] = [
    {
      id: "q1",
      question: "What is innovation?",
      questionAr: "ما هو الابتكار؟",
      type: "multiple-choice",
      options: [
        { id: "a1", text: "Creating new ideas", textAr: "إنشاء أفكار جديدة" },
        { id: "a2", text: "Copying existing products", textAr: "نسخ المنتجات الموجودة" },
        { id: "a3", text: "Following old methods", textAr: "اتباع الطرق القديمة" },
        { id: "a4", text: "Avoiding changes", textAr: "تجنب التغييرات" },
      ],
      correctAnswer: "a1",
    },
    {
      id: "q2",
      question: "Creative thinking is essential for innovation.",
      questionAr: "التفكير الإبداعي ضروري للابتكار.",
      type: "true-false",
      options: [
        { id: "t1", text: "True", textAr: "صحيح" },
        { id: "t2", text: "False", textAr: "خطأ" },
      ],
      correctAnswer: "t1",
    },
    {
      id: "q3",
      question: "Which tool helps generate new ideas?",
      questionAr: "أي أداة تساعد في توليد أفكار جديدة؟",
      type: "multiple-choice",
      options: [
        { id: "b1", text: "Brainstorming", textAr: "العصف الذهني" },
        { id: "b2", text: "Documentation", textAr: "التوثيق" },
        { id: "b3", text: "Reporting", textAr: "التقارير" },
        { id: "b4", text: "Scheduling", textAr: "الجدولة" },
      ],
      correctAnswer: "b1",
    },
  ]

  // Timer countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }))
  }

  const handleNext = () => {
    if (currentQuestion < quiz.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = async () => {
    setSubmitted(true)
    setShowResults(true)

    // TODO: Send answers to LearnWorld API
    // await learnworldClient.submitQuizAttempt(studentId, quizId, Object.values(answers))
  }

  const calculateScore = () => {
    let correct = 0
    quiz.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) {
        correct++
      }
    })
    return (correct / quiz.length) * 100
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  const question = quiz[currentQuestion]
  const score = calculateScore()
  const passed = score >= 70

  if (showResults) {
    return (
      <div className="space-y-6">
        {/* Results Card */}
        <Card className="glass-border-enhanced p-12 text-center">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
            passed ? "bg-green-500/20" : "bg-destructive/20"
          }`}>
            {passed ? (
              <CheckCircle2 size={40} className="text-green-500" />
            ) : (
              <AlertCircle size={40} className="text-destructive" />
            )}
          </div>

          <h2 className="text-3xl font-bold mb-2">
            {passed ? "تهانينا!" : "يرجى المحاولة مرة أخرى"}
          </h2>
          <p className="text-muted-foreground mb-8">
            {passed
              ? "لقد اجتزت الاختبار بنجاح"
              : "درجتك أقل من الحد الأدنى المطلوب"}
          </p>

          <div className="bg-primary/10 rounded-lg p-8 mb-8 inline-block">
            <p className="text-muted-foreground mb-2">درجتك النهائية</p>
            <p className="text-5xl font-bold text-primary">{Math.round(score)}%</p>
            <p className="text-muted-foreground mt-2">
              {Object.values(answers).length} / {quiz.length} صحيح
            </p>
          </div>

          <div className="flex gap-4 justify-center flex-wrap">
            <Button onClick={() => window.location.reload()}>
              أعيد الاختبار
            </Button>
            <Button variant="outline" onClick={() => router.back()}>
              العودة إلى الدورة
            </Button>
            {passed && (
              <Button variant="secondary" onClick={() => router.push(`/student/courses/${params.id}/certificate`)}>
                طلب الشهادة
              </Button>
            )}
          </div>
        </Card>

        {/* Detailed Results */}
        <Card className="glass-border p-6">
          <h3 className="font-bold text-lg mb-6">تفاصيل الإجابات</h3>
          <div className="space-y-4">
            {quiz.map((q, idx) => (
              <div key={q.id} className={`p-4 rounded-lg border ${
                answers[q.id] === q.correctAnswer
                  ? "bg-green-500/10 border-green-500/30"
                  : "bg-destructive/10 border-destructive/30"
              }`}>
                <div className="flex items-start justify-between mb-2">
                  <p className="font-semibold">السؤال {idx + 1}</p>
                  {answers[q.id] === q.correctAnswer ? (
                    <span className="text-green-500 font-bold">صحيح</span>
                  ) : (
                    <span className="text-destructive font-bold">خطأ</span>
                  )}
                </div>
                <p className="text-muted-foreground mb-3">{q.questionAr}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1">إجابتك:</p>
                    <p className="font-semibold">
                      {q.options.find((o) => o.id === answers[q.id])?.textAr || "لم تجب"}
                    </p>
                  </div>
                  {answers[q.id] !== q.correctAnswer && (
                    <div>
                      <p className="text-muted-foreground mb-1">الإجابة الصحيحة:</p>
                      <p className="font-semibold text-green-500">
                        {q.options.find((o) => o.id === q.correctAnswer)?.textAr}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-border-enhanced p-6 rounded-xl">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold">اختبار الدرس</h1>
            <p className="text-muted-foreground">{quiz.length} أسئلة</p>
          </div>
          <div className="flex items-center gap-2 bg-destructive/10 px-4 py-2 rounded-lg">
            <Clock size={20} className="text-destructive" />
            <span className="font-bold text-destructive">{formatTime(timeLeft)}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>السؤال {currentQuestion + 1} من {quiz.length}</span>
            <span>{Math.round(((currentQuestion + 1) / quiz.length) * 100)}%</span>
          </div>
          <Progress value={(currentQuestion + 1) / quiz.length * 100} className="h-2" />
        </div>
      </div>

      {/* Question */}
      <Card className="glass-border p-8">
        <h2 className="text-2xl font-bold mb-8 text-right">{question.questionAr}</h2>

        {/* Options */}
        <RadioGroup value={answers[question.id] || ""} onValueChange={(value) => handleAnswerChange(question.id, value)}>
          <div className="space-y-4">
            {question.options.map((option) => (
              <div key={option.id} className="flex items-center space-x-3 p-4 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer border border-border">
                <RadioGroupItem value={option.id} id={option.id} />
                <Label htmlFor={option.id} className="flex-1 cursor-pointer font-medium">
                  {option.textAr}
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </Card>

      {/* Navigation */}
      <div className="flex gap-4 justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
        >
          السؤال السابق
        </Button>

        {currentQuestion === quiz.length - 1 ? (
          <Button
            onClick={handleSubmit}
            disabled={Object.keys(answers).length < quiz.length}
            className="gap-2"
          >
            <CheckCircle2 size={20} />
            أنهي الاختبار
          </Button>
        ) : (
          <Button onClick={handleNext}>السؤال التالي</Button>
        )}
      </div>

      {/* Question Indicators */}
      <Card className="glass-border p-6">
        <h3 className="font-bold mb-4">نظرة عامة على الأسئلة</h3>
        <div className="grid grid-cols-6 md:grid-cols-10 gap-2">
          {quiz.map((q, idx) => (
            <button
              key={q.id}
              onClick={() => setCurrentQuestion(idx)}
              className={`aspect-square rounded-lg font-bold transition-colors ${
                currentQuestion === idx
                  ? "bg-primary text-white"
                  : answers[q.id]
                  ? "bg-secondary text-white"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </Card>
    </div>
  )
}
