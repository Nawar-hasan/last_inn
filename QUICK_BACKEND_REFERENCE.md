# Backend Quick Reference

## File Locations

| Component | Path |
|-----------|------|
| Auth Context | `/lib/auth-context.tsx` |
| LearnWorld Client | `/lib/learnworld-client.ts` |
| Types | `/lib/learnworld-types.ts` |
| Student Hooks | `/lib/hooks/use-student-data.ts` |
| Language i18n | `/lib/language-context.tsx` |

## API Routes

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/login` | POST | User login |
| `/api/auth/register` | POST | User registration |
| `/api/auth/me` | GET | Get current user |
| `/api/auth/forgot-password` | POST | Reset password |
| `/api/courses` | GET | List all courses |
| `/api/courses/[id]` | GET | Get course details |
| `/api/progress` | GET/POST | Track student progress |
| `/api/quizzes/submit` | POST | Submit quiz answers |
| `/api/certificates/request` | POST | Request certificate |
| `/api/payments/process` | POST | Process payment |

## Authentication Flow

\`\`\`
1. User → Registration Form
2. POST /api/auth/register
3. ← Token returned
4. Store in localStorage
5. Redirect to /student
6. AuthContext verifies on mount
7. ← Fetch /api/auth/me
8. Load student dashboard
\`\`\`

## Key Interfaces

\`\`\`typescript
interface Student {
  id: string
  email: string
  firstName: string
  lastName: string
  enrolledCourses: string[]
}

interface Course {
  id: string
  title: string
  description: string
  instructor: string
  duration: number
  level: "beginner" | "intermediate" | "advanced"
  lessons: Lesson[]
}

interface StudentProgress {
  studentId: string
  courseId: string
  lessonsCompleted: number
  lessonsTotal: number
  quizzesCompleted: number
  quizzesTotal: number
  certificateIssued: boolean
}
\`\`\`

## Common Tasks

### Add new API route
1. Create file in `/app/api/[resource]/[action]/route.ts`
2. Export `POST/GET/PUT/DELETE` function
3. Accept `NextRequest`, return `NextResponse`
4. Add validation and error handling
5. Add console.log("[v0]") for debugging

### Use student data
\`\`\`typescript
import { useStudentCourses } from "@/lib/hooks/use-student-data"

const { courses, isLoading, error } = useStudentCourses()
\`\`\`

### Authentication in component
\`\`\`typescript
import { useAuth } from "@/lib/auth-context"

const { student, isAuthenticated, login, logout } = useAuth()
\`\`\`

## Debugging

All API errors are logged with `console.error("[v0]", ...)`
Check browser console and Next.js terminal for logs.

## LearnWorld Integration

Each TODO comment in `/app/api/` routes marks where LearnWorld API calls should be placed. Replace mock data with actual API calls when credentials are available.
