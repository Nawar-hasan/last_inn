# LearnWorld API Integration Guide

## Overview
This document outlines how to integrate the Innovologia platform with the LearnWorld LMS API. All mock data locations are documented for easy replacement.

## Authentication Setup

### Environment Variables Required
\`\`\`
LEARNWORLD_API_KEY=your_api_key_here
LEARNWORLD_API_URL=https://api.learnworld.com
NEXT_PUBLIC_LEARNWORLD_DOMAIN=your_domain
\`\`\`

### Session Management
- Use existing auth context in `/lib/auth-context.tsx`
- Extend with LearnWorld token storage
- Implement token refresh on expired sessions

## API Integration Points

### 1. Student Registration & Login
**File**: `app/api/auth/register/route.ts` and `app/api/auth/login/route.ts`

Replace current implementation with LearnWorld API:

\`\`\`javascript
// POST /api/auth/register
const response = await fetch("${LEARNWORLD_API_URL}/v1/students/register", {
  method: "POST",
  headers: {
    "Authorization": "Bearer ${LEARNWORLD_API_KEY}",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: email,
    firstName: firstName,
    lastName: lastName,
    password: password,
  }),
})

// POST /api/auth/login
const response = await fetch("${LEARNWORLD_API_URL}/v1/students/login", {
  method: "POST",
  headers: {
    "Authorization": "Bearer ${LEARNWORLD_API_KEY}",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: email,
    password: password,
  }),
})
\`\`\`

### 2. Notifications System
**File**: `components/site-header.tsx` (line ~52, marked with "Mock notifications")

**Current Location**:
\`\`\`javascript
const notifications = [
  { id: 1, text: isArabic ? "تم قبول شهادتك" : "Your certificate has been approved", read: false },
  { id: 2, text: isArabic ? "دورة جديدة متاحة" : "New course available", read: false },
  { id: 3, text: isArabic ? "تم تحديث درجاتك" : "Your grades have been updated", read: true },
]
\`\`\`

**Replace with**:
\`\`\`javascript
// Add to component with useEffect
const [notifications, setNotifications] = useState([])

useEffect(() => {
  const fetchNotifications = async () => {
    const response = await fetch(
      \`/api/student/notifications?studentId=\${student?.id}\`
    )
    const data = await response.json()
    setNotifications(data)
  }
  if (isAuthenticated) fetchNotifications()
}, [isAuthenticated, student?.id])
\`\`\`

**API Route to create**:
\`\`\`
GET /api/student/notifications - Fetch student notifications
POST /api/student/notifications/:id/read - Mark as read
\`\`\`

### 3. Certificates
**File**: `app/student/certificates/page.tsx` (line ~18, marked with "Mock certificates data")

**Current Location**:
\`\`\`javascript
const [certificates] = useState([
  {
    id: 1,
    courseName: "Basic Innovation Course",
    issueDate: "2024-01-15",
    certificateNumber: "CERT-2024-001",
    status: "completed",
    verified: true,
  },
  // ... more certificates
])
\`\`\`

**Replace with**:
\`\`\`javascript
const [certificates, setcertificates] = useState([])
const [loading, setLoading] = useState(true)

useEffect(() => {
  const fetchCertificates = async () => {
    try {
      const response = await fetch(
        \`/api/student/certificates?studentId=\${student?.id}\`
      )
      const data = await response.json()
      setCertificates(data)
    } finally {
      setLoading(false)
    }
  }
  if (student?.id) fetchCertificates()
}, [student?.id])
\`\`\`

**API Endpoint**: `GET /api/student/certificates`

### 4. Messages System
**File**: `app/student/messages/page.tsx` (line ~16, marked with "Mock messages")

**Current Location**:
\`\`\`javascript
const [messages] = useState([
  {
    id: 1,
    from: "Ahmed Expert",
    message: "Hello, how can I help you?",
    timestamp: "2024-01-20 10:30",
    read: false,
  },
  // ... more messages
])
\`\`\`

**Replace with**:
\`\`\`javascript
const [messages, setMessages] = useState([])
const [loading, setLoading] = useState(true)

useEffect(() => {
  const fetchMessages = async () => {
    try {
      const response = await fetch(
        \`/api/student/messages?studentId=\${student?.id}\`
      )
      const data = await response.json()
      setMessages(data)
    } finally {
      setLoading(false)
    }
  }
  if (student?.id) fetchMessages()
}, [student?.id])

const handleSend = async () => {
  const response = await fetch("/api/student/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      studentId: student?.id,
      message: messageText,
    }),
  })
  if (response.ok) {
    setMessageText("")
    // Refresh messages
  }
}
\`\`\`

**API Endpoints**:
- `GET /api/student/messages` - Fetch messages
- `POST /api/student/messages` - Send message

### 5. Payment Processing
**File**: `app/api/payments/process/route.ts` (entire file placeholder)

**Replace with Stripe + LearnWorld Integration**:
\`\`\`javascript
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { planName, planPrice, studentId, email } = body

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: parseInt(planPrice) * 100, // Convert to cents
      currency: "usd",
      metadata: {
        studentId,
        planName,
      },
    })

    // Update LearnWorld subscription
    await fetch(\`\${process.env.LEARNWORLD_API_URL}/v1/students/\${studentId}/subscription\`, {
      method: "POST",
      headers: {
        "Authorization": \`Bearer \${process.env.LEARNWORLD_API_KEY}\`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        plan: planName,
        paymentIntentId: paymentIntent.id,
      }),
    })

    return NextResponse.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
    })
  } catch (error) {
    console.error("Payment error:", error)
    return NextResponse.json(
      { error: "Payment processing failed" },
      { status: 500 }
    )
  }
}
\`\`\`

### 6. Courses Listing
**File**: `app/student/courses/page.tsx`

Add this hook to fetch courses:
\`\`\`javascript
useEffect(() => {
  const fetchCourses = async () => {
    const response = await fetch(
      \`/api/courses?studentId=\${student?.id}\`
    )
    const data = await response.json()
    setCourses(data)
  }
  if (student?.id) fetchCourses()
}, [student?.id])
\`\`\`

**API Endpoint**: `GET /api/courses`

### 7. Student Progress Tracking
**File**: Create `app/api/progress/route.ts`

\`\`\`javascript
export async function POST(request: NextRequest) {
  const body = await request.json()
  const { studentId, courseId, progress, completed } = body

  // Update progress in LearnWorld
  const response = await fetch(
    \`\${process.env.LEARNWORLD_API_URL}/v1/students/\${studentId}/courses/\${courseId}/progress\`,
    {
      method: "POST",
      headers: {
        "Authorization": \`Bearer \${process.env.LEARNWORLD_API_KEY}\`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ progress, completed }),
    }
  )

  return NextResponse.json({ success: response.ok })
}
\`\`\`

## Bilingual Support

All endpoints should support language preference. Add to headers:
\`\`\`
Accept-Language: ar-SA or en-US
\`\`\`

## Error Handling

Implement consistent error handling:
\`\`\`javascript
try {
  // API call
} catch (error) {
  console.error("[v0] Error:", error)
  // Show user-friendly message based on language
  const errorMessage = isArabic 
    ? "حدث خطأ ما. يرجى المحاولة مرة أخرى"
    : "Something went wrong. Please try again"
  // Show toast/alert
}
\`\`\`

## Testing Checklist

- [ ] User registration and login flow
- [ ] Notification fetching and reading
- [ ] Certificate display and downloads
- [ ] Message sending and receiving
- [ ] Payment processing
- [ ] Course enrollment and progress tracking
- [ ] Language switching works everywhere
- [ ] Dark/Light theme persists
- [ ] Mobile responsiveness

## Performance Considerations

1. Cache certificates and courses for 1 hour
2. Use SWR for real-time notifications
3. Paginate long message lists
4. Lazy load course videos
5. Compress images and certificates

## Security Notes

1. Always validate student ID from JWT token
2. Never expose LearnWorld API key in frontend
3. Use HTTPS for all API calls
4. Implement rate limiting on payment endpoints
5. Store Stripe keys in environment variables only
