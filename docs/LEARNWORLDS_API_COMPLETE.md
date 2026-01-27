# LearnWorlds API Complete Documentation

## Overview
This document provides a complete reference for all LearnWorlds API endpoints integrated into the Innovologia platform.

## Authentication
All API requests require an API key passed in the Authorization header:
```
Authorization: Bearer {YOUR_API_KEY}
```

## Endpoints

### Courses Management

#### GET /courses
Retrieve all courses
```typescript
const courses = await learnworldClient.getCourses()
```

#### GET /courses/:id
Get specific course details
```typescript
const course = await learnworldClient.getCourse(courseId)
```

#### POST /courses
Create a new course
```typescript
const newCourse = await learnworldClient.createCourse({
  title: "New Course",
  description: "Course description",
  price: 99.99
})
```

#### PUT /courses/:id
Update existing course
```typescript
const updated = await learnworldClient.updateCourse(courseId, {
  price: 79.99
})
```

#### DELETE /courses/:id
Delete a course
```typescript
await learnworldClient.deleteCourse(courseId)
```

---

### Users Management

#### GET /users
Retrieve users with optional filters
```typescript
const users = await learnworldClient.getUsers({
  tag: "premium",
  enrolled: true
})
```

#### GET /users/:id
Get specific user details
```typescript
const user = await learnworldClient.getUser(userId)
```

#### PUT /users/:id
Update user information
```typescript
const updated = await learnworldClient.updateUser(userId, {
  firstName: "John",
  lastName: "Doe"
})
```

#### POST /users/:id/tags
Add tags to user
```typescript
await learnworldClient.addUserTags(userId, ["premium", "active"])
```

#### DELETE /users/:id/tags
Remove tags from user
```typescript
await learnworldClient.removeUserTags(userId, ["trial"])
```

---

### Enrollments

#### POST /users/:id/enrollments
Enroll user in course
```typescript
await learnworldClient.enrollUser(userId, courseId)
```

#### DELETE /users/:id/enrollments/:courseId
Unenroll user from course
```typescript
await learnworldClient.unenrollUser(userId, courseId)
```

---

### Progress Tracking

#### GET /students/:id/progress/:courseId
Get student progress in specific course
```typescript
const progress = await learnworldClient.getStudentProgress(studentId, courseId)
// Returns: { lessonsTotal, lessonsCompleted, quizzesTotal, quizzesCompleted }
```

#### POST /students/:id/lessons/:lessonId/complete
Mark lesson as complete
```typescript
await learnworldClient.updateLessonCompletion(studentId, lessonId)
```

---

### Community & Discussions

#### GET /community/spaces
Get all community spaces
```typescript
const spaces = await learnworldClient.getCommunitySpaces()
```

#### GET /community/spaces/:id/posts
Get posts in specific space
```typescript
const posts = await learnworldClient.getSpacePosts(spaceId)
```

#### POST /community/spaces/:id/posts
Create new post in space
```typescript
const post = await learnworldClient.createPost(spaceId, "Post content here")
```

#### GET /courses/:id/discussions
Get course-specific discussions
```typescript
const discussions = await learnworldClient.getCourseDiscussions(courseId)
```

---

### Quizzes & Assessments

#### POST /students/:id/quizzes/:quizId/submit
Submit quiz attempt
```typescript
const result = await learnworldClient.submitQuizAttempt(
  studentId,
  quizId,
  ["answer1", "answer2", "answer3"]
)
```

#### GET /students/:id/quizzes/:quizId/attempts
Get all quiz attempts
```typescript
const attempts = await learnworldClient.getQuizAttempts(studentId, quizId)
```

---

### Certificates

#### POST /students/:id/certificates/request
Request certificate for completed course
```typescript
const certificate = await learnworldClient.requestCertificate(studentId, courseId)
```

#### GET /students/:id/certificates
Get all certificates for student
```typescript
const certificates = await learnworldClient.getCertificates(studentId)
```

#### GET /certificates/:id/download
Download certificate as PDF
```typescript
const blob = await learnworldClient.downloadCertificate(certificateId)
```

---

### Payments & Subscriptions

#### GET /payments
Get all payments
```typescript
const payments = await learnworldClient.getPayments()
// Or filter by user:
const userPayments = await learnworldClient.getPayments(userId)
```

#### GET /subscriptions
Get all subscriptions
```typescript
const subscriptions = await learnworldClient.getSubscriptions()
```

---

### Promotions & Coupons

#### GET /promotions
Get all active promotions
```typescript
const promotions = await learnworldClient.getPromotions()
```

#### POST /coupons
Create new coupon
```typescript
const coupon = await learnworldClient.createCoupon({
  code: "SAVE20",
  discount: 20,
  type: "percentage"
})
```

---

### Reports & Analytics

#### GET /reports/courses/:id
Get course performance report
```typescript
const report = await learnworldClient.getCourseReport(courseId)
```

#### GET /reports/users/:id
Get user activity report
```typescript
const report = await learnworldClient.getUserReport(userId)
```

#### GET /reports/enrollments
Get enrollment statistics
```typescript
const stats = await learnworldClient.getEnrollmentStats()
// Returns: { totalStudents, activeStudents, completionRate, etc. }
```

---

### Webhooks

#### POST /webhooks
Register new webhook
```typescript
const webhook = await learnworldClient.registerWebhook(
  "https://innovologia.com/api/webhooks/learnworlds",
  ["user.enrolled", "course.completed", "certificate.issued"]
)
```

#### GET /webhooks
List all webhooks
```typescript
const webhooks = await learnworldClient.listWebhooks()
```

#### DELETE /webhooks/:id
Delete webhook
```typescript
await learnworldClient.deleteWebhook(webhookId)
```

---

## Webhook Events

LearnWorlds supports the following webhook events:

- \`user.registered\` - New user registered
- \`user.updated\` - User information updated
- \`user.enrolled\` - User enrolled in course
- \`user.unenrolled\` - User unenrolled from course
- \`course.completed\` - User completed course
- \`certificate.issued\` - Certificate issued to user
- \`payment.succeeded\` - Payment successful
- \`payment.failed\` - Payment failed
- \`subscription.created\` - New subscription
- \`subscription.cancelled\` - Subscription cancelled
- \`subscription.trial_started\` - Trial started
- \`subscription.trial_ending\` - Trial ending soon
- \`tags.added\` - Tags added to user
- \`tags.removed\` - Tags removed from user

---

## Error Handling

All API methods throw errors with descriptive messages:

```typescript
try {
  const course = await learnworldClient.getCourse(courseId)
} catch (error) {
  console.error("LearnWorld API error:", error.message)
}
```

---

## Development Mode

When \`LEARNWORLD_API_KEY\` is not set or in development mode, the client returns mock data for testing:

```typescript
// Automatically uses mock data if no API key
const courses = await learnworldClient.getCourses()
// Returns sample course data
```

---

## Rate Limiting

LearnWorlds API has rate limits:
- 100 requests per minute per API key
- Burst limit: 20 requests per second

---

## Best Practices

1. **Cache responses** where possible to reduce API calls
2. **Use webhooks** for real-time updates instead of polling
3. **Batch operations** when updating multiple users/courses
4. **Handle errors gracefully** with proper user feedback
5. **Test with mock data** before production deployment

---

## Support

For API issues or questions:
- Email: support@learnworlds.com
- Documentation: https://www.learnworlds.dev/docs/api/
- Status Page: https://status.learnworlds.com
