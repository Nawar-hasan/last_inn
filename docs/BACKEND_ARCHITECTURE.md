# Backend Architecture - Innovologia Platform

## System Overview

The Innovologia platform is designed as a comprehensive learning management system with full LearnWorld API integration support.

### Architecture Layers

\`\`\`
┌─────────────────────────────────────────┐
│         Frontend (React/Next.js)        │
│  - Public Pages (Landing, Courses)      │
│  - Student Dashboard                    │
│  - Auth Pages (Login, Register)         │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│        API Layer (API Routes)           │
│  /api/auth/* - Authentication           │
│  /api/courses/* - Course Management     │
│  /api/payments/* - Payment Processing   │
│  /api/certificates/* - Certificates    │
│  /api/progress/* - Progress Tracking    │
│  /api/quizzes/* - Quiz Submission       │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│      Context Layer (Business Logic)     │
│  - AuthContext (Authentication State)   │
│  - LanguageContext (i18n)               │
│  - Custom Hooks (useStudentCourses)     │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│  LearnWorld API Integration             │
│  - Course Management                    │
│  - Student Enrollment                   │
│  - Progress Tracking                    │
│  - Certificate Generation               │
│  - Quiz Management                      │
└─────────────────────────────────────────┘
\`\`\`

## Authentication Flow

### Registration
1. User fills registration form (email, password, name)
2. Form validates input locally
3. POST to `/api/auth/register`
4. Backend validates data again
5. Token generated and stored in localStorage
6. User redirected to `/student` dashboard
7. **TODO**: Register user in LearnWorld via API

### Login
1. User enters credentials
2. POST to `/api/auth/login`
3. Backend validates credentials
4. Token generated and stored in localStorage
5. User redirected to `/student` dashboard
6. **TODO**: Authenticate against LearnWorld API

### Session Management
- Token stored in localStorage
- `AuthContext` checks token on app load via `/api/auth/me`
- Automatic redirect if not authenticated
- Logout clears token from storage

## API Routes Structure

### Authentication (`/api/auth/`)
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Initiate password reset
- `POST /api/auth/validate-token` - Validate reset token

### Courses (`/api/courses/`)
- `GET /api/courses` - Get all courses
- `GET /api/courses/[id]` - Get specific course
- **TODO**: Enroll in course
- **TODO**: Get enrolled courses

### Student Progress (`/api/progress/`)
- `GET /api/progress?courseId=xxx` - Get course progress
- `POST /api/progress` - Update progress
- **TODO**: Update lesson completion status

### Quizzes (`/api/quizzes/`)
- `POST /api/quizzes/submit` - Submit quiz answers
- **TODO**: Get quiz questions
- **TODO**: Get quiz attempts

### Certificates (`/api/certificates/`)
- `POST /api/certificates/request` - Request certificate
- **TODO**: Download certificate
- **TODO**: Get all certificates

### Payments (`/api/payments/`)
- `POST /api/payments/process` - Process payment
- **TODO**: Webhook for payment confirmation
- **TODO**: Get payment history

## Type System

All types are defined in `/lib/learnworld-types.ts` and include:
- `Student` - User account information
- `Course` - Course details and metadata
- `Lesson` - Individual lesson content
- `Quiz` - Assessment questions
- `StudentProgress` - Enrollment and completion status
- `Certificate` - Achievement certificates
- `QuizAttempt` - Assessment submissions

## Context Providers

### AuthContext
Manages user authentication state and provides:
- `student` - Current user data
- `isAuthenticated` - Auth status
- `login(email, password)` - Login action
- `register(email, password, firstName, lastName)` - Registration action
- `logout()` - Logout action

### LanguageContext
Manages language and translation:
- `language` - Current language (ar/en)
- `toggleLanguage()` - Switch language
- `t(key)` - Translation function

## Data Hooks

### useStudentCourses()
- Returns enrolled courses
- Auto-refetches on auth change
- Handles loading/error states

### useStudentProgress(courseId)
- Returns progress for specific course
- Tracks lessons completed
- Handles quizzes pending

### useStudentCertificates()
- Returns earned certificates
- Includes download URLs
- Tracks expiration dates

## Security Considerations

1. **Token Storage**: Uses localStorage (consider upgrading to httpOnly cookies)
2. **Input Validation**: Validates on frontend and backend
3. **Error Messages**: Generic messages to prevent user enumeration
4. **CORS**: Verify CORS headers are properly configured
5. **Rate Limiting**: Should be added to API routes

## LearnWorld Integration Checklist

- [ ] Get API credentials from LearnWorld
- [ ] Update `LEARNWORLD_API_KEY` in environment
- [ ] Replace mock data in `/api/courses/route.ts`
- [ ] Implement actual login in `/api/auth/login/route.ts`
- [ ] Implement actual registration in `/api/auth/register/route.ts`
- [ ] Connect course enrollment
- [ ] Connect progress tracking
- [ ] Connect certificate generation
- [ ] Connect quiz submission
- [ ] Add email notifications for certificates

## Error Handling

All API routes follow this pattern:
\`\`\`typescript
try {
  // Validate input
  // Process request
  return NextResponse.json({ data })
} catch (error) {
  console.error("[v0] Error:", error)
  return NextResponse.json(
    { error: "User-friendly message" },
    { status: 500 }
  )
}
\`\`\`

## Future Improvements

1. Add refresh token rotation
2. Implement role-based access control
3. Add audit logging for admin actions
4. Implement caching strategies with Redis
5. Add request rate limiting
6. Add comprehensive API documentation
7. Add API versioning
