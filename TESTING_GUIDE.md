# دليل الاختبار - Innovologia Platform

## نظرة عامة

هذا الدليل يوضح كيفية اختبار جميع API endpoints والوظائف الأساسية للمنصة قبل وبعد الربط مع LearnWorlds API.

## متطلبات الاختبار

### 1. متغيرات البيئة المطلوبة

قبل البدء بالاختبار، تأكد من إضافة المتغيرات التالية في ملف `.env.local`:

```env
# LearnWorlds Configuration
NEXT_PUBLIC_LEARNWORLD_API_URL=https://api.learnworlds.com/v2
LEARNWORLD_API_KEY=your_api_key_here
LEARNWORLD_SCHOOL_ID=your_school_id_here
LEARNWORLD_WEBHOOK_SECRET=your_webhook_secret_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### 2. أدوات الاختبار الموصى بها

- **Postman** أو **Insomnia** - لاختبار API endpoints
- **Browser DevTools** - لمراقبة network requests
- **React DevTools** - لفحص components state

## اختبار API Routes

### Authentication Routes

#### 1. تسجيل الدخول - Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}

# Expected Response (200)
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "student": {
    "id": "user_id",
    "email": "test@example.com",
    "firstName": "Test",
    "lastName": "User"
  }
}

# Expected Errors
- 400: Missing email or password
- 401: Invalid credentials
- 429: Too many requests
```

#### 2. التسجيل - Register
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "SecurePass123",
  "firstName": "New",
  "lastName": "User"
}

# Expected Response (201)
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "student": {
    "id": "new_user_id",
    "email": "newuser@example.com",
    "firstName": "New",
    "lastName": "User"
  }
}

# Expected Errors
- 400: Missing required fields
- 400: Invalid email format
- 400: Weak password
- 409: Email already exists
- 429: Too many requests
```

#### 3. الحصول على بيانات المستخدم - Get User Data
```bash
GET /api/auth/me
Authorization: Bearer {token}

# Expected Response (200)
{
  "success": true,
  "student": {
    "id": "user_id",
    "email": "test@example.com",
    "firstName": "Test",
    "lastName": "User",
    "enrolledCourses": [],
    "completedCourses": []
  }
}

# Expected Errors
- 401: Missing or invalid token
- 429: Too many requests
```

#### 4. إعادة تعيين كلمة المرور - Forgot Password
```bash
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "test@example.com"
}

# Expected Response (200)
{
  "success": true,
  "message": "Password reset link sent to your email"
}

# Expected Errors
- 400: Missing email
- 404: Email not found
- 429: Too many requests (strict limit: 5 per 15 minutes)
```

### Courses Routes

#### 1. الحصول على جميع الدورات - Get All Courses
```bash
GET /api/courses

# Expected Response (200)
{
  "success": true,
  "courses": [
    {
      "id": "course_1",
      "title": "مدخل إلى الابتكار",
      "description": "...",
      "price": 99.99,
      "image": "...",
      "instructor": "أسامة بدندي"
    }
  ]
}

# Expected Errors
- 500: Server error
```

#### 2. الحصول على تفاصيل دورة - Get Course Details
```bash
GET /api/courses/{courseId}

# Expected Response (200)
{
  "success": true,
  "course": {
    "id": "course_1",
    "title": "مدخل إلى الابتكار",
    "description": "...",
    "price": 99.99,
    "curriculum": [...]
  }
}

# Expected Errors
- 404: Course not found
- 500: Server error
```

#### 3. التسجيل في دورة - Enroll in Course
```bash
POST /api/courses/{courseId}/enrollment
Authorization: Bearer {token}
Content-Type: application/json

{
  "paymentMethod": "stripe"
}

# Expected Response (200)
{
  "success": true,
  "message": "Successfully enrolled in course",
  "enrollment": {
    "courseId": "course_1",
    "enrolledAt": "2024-01-01T00:00:00Z"
  }
}

# Expected Errors
- 401: Not authenticated
- 400: Already enrolled
- 404: Course not found
- 429: Too many requests
```

### Progress & Learning Routes

#### 1. الحصول على التقدم - Get Progress
```bash
GET /api/progress?courseId={courseId}
Authorization: Bearer {token}

# Expected Response (200)
{
  "success": true,
  "progress": {
    "courseId": "course_1",
    "completedLessons": 5,
    "totalLessons": 10,
    "percentage": 50
  }
}

# Expected Errors
- 401: Not authenticated
- 404: Course not found
```

#### 2. طلب شهادة - Request Certificate
```bash
POST /api/certificates/request
Authorization: Bearer {token}
Content-Type: application/json

{
  "courseId": "course_1"
}

# Expected Response (200)
{
  "success": true,
  "certificate": {
    "id": "cert_1",
    "courseId": "course_1",
    "issuedAt": "2024-01-01T00:00:00Z",
    "downloadUrl": "https://..."
  }
}

# Expected Errors
- 401: Not authenticated
- 400: Course not completed
- 404: Course not found
```

#### 3. إرسال نتائج اختبار - Submit Quiz
```bash
POST /api/quizzes/submit
Authorization: Bearer {token}
Content-Type: application/json

{
  "quizId": "quiz_1",
  "answers": [
    { "questionId": "q1", "answer": "A" },
    { "questionId": "q2", "answer": "B" }
  ]
}

# Expected Response (200)
{
  "success": true,
  "result": {
    "score": 80,
    "passed": true,
    "correctAnswers": 8,
    "totalQuestions": 10
  }
}

# Expected Errors
- 401: Not authenticated
- 404: Quiz not found
```

### Payments Routes

#### 1. معالجة الدفع - Process Payment
```bash
POST /api/payments/process
Authorization: Bearer {token}
Content-Type: application/json

{
  "courseId": "course_1",
  "paymentMethod": "stripe",
  "amount": 99.99
}

# Expected Response (200)
{
  "success": true,
  "payment": {
    "id": "payment_1",
    "status": "completed",
    "amount": 99.99
  }
}

# Expected Errors
- 401: Not authenticated
- 400: Invalid payment details
- 402: Payment failed
```

### Webhook Routes

#### 1. LearnWorlds Webhook
```bash
POST /api/webhooks/learnworlds
Content-Type: application/json
X-Webhook-Signature: {signature}

{
  "event": "user.enrolled",
  "data": {
    "userId": "user_1",
    "courseId": "course_1"
  }
}

# Expected Response (200)
{
  "success": true,
  "message": "Webhook processed successfully"
}

# Expected Errors
- 401: Invalid signature
- 400: Invalid payload
- 500: Processing error
```

## اختبار Rate Limiting

### حدود المعدلات

- **Auth endpoints**: 5 طلبات كل 15 دقيقة
- **API endpoints**: 60 طلب في الدقيقة
- **Public endpoints**: 100 طلب في الدقيقة
- **Webhook endpoints**: 1000 طلب في الدقيقة

### اختبار تجاوز الحد
```bash
# أرسل أكثر من 5 طلبات login خلال 15 دقيقة

POST /api/auth/login (Request #6)

# Expected Response (429)
{
  "error": "Too many requests",
  "message": "Rate limit exceeded. Please try again later.",
  "resetTime": "2024-01-01T00:15:00Z"
}

# Headers
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 2024-01-01T00:15:00Z
Retry-After: 900
```

## اختبار UI/UX

### 1. Loading States
- تأكد من ظهور loading indicators عند:
  - تسجيل الدخول/التسجيل
  - تحميل الدورات
  - إرسال النماذج
  - تحميل البيانات

### 2. Error Messages
- تأكد من ظهور رسائل خطأ واضحة باللغتين عند:
  - فشل تسجيل الدخول
  - فشل التسجيل
  - فقدان الاتصال بالإنترنت
  - أخطاء الخادم

### 3. Success Feedback
- تأكد من ظهور رسائل نجاح عند:
  - نجاح تسجيل الدخول
  - نجاح التسجيل في دورة
  - إتمام درس
  - الحصول على شهادة

## اختبار الأمان

### 1. Authentication
```bash
# محاولة الوصول بدون token
GET /api/auth/me

# Expected: 401 Unauthorized

# محاولة استخدام token غير صالح
GET /api/auth/me
Authorization: Bearer invalid_token

# Expected: 401 Unauthorized
```

### 2. Input Validation
```bash
# محاولة التسجيل ببريد إلكتروني غير صالح
POST /api/auth/register
{
  "email": "not-an-email",
  "password": "weak"
}

# Expected: 400 Bad Request with validation errors
```

### 3. XSS Prevention
```bash
# محاولة إدخال script tags
POST /api/auth/register
{
  "email": "test@test.com",
  "firstName": "<script>alert('xss')</script>"
}

# Expected: Input should be sanitized
```

## اختبار Mock Mode vs Production Mode

### Mock Mode (بدون API keys)
```bash
# يجب أن تعمل جميع endpoints مع بيانات تجريبية
# تحقق من console logs لرؤية "[MOCK MODE]"
```

### Production Mode (مع API keys)
```bash
# تأكد من:
# 1. الاتصال بـ LearnWorlds API
# 2. جلب البيانات الحقيقية
# 3. عمل Webhooks بشكل صحيح
```

## Checklist النهائي

### قبل الإطلاق
- [ ] جميع API endpoints تعمل بشكل صحيح
- [ ] Rate limiting مفعل ويعمل
- [ ] Security headers مضافة
- [ ] Error handling شامل
- [ ] Logging يعمل بشكل صحيح
- [ ] Webhooks تستقبل وتعالج الأحداث
- [ ] UI loading states تظهر بشكل صحيح
- [ ] Error messages واضحة ومفيدة
- [ ] Success feedback مناسب
- [ ] Mock mode يعمل للتطوير
- [ ] Production mode جاهز مع API keys
- [ ] CORS مضبوط بشكل صحيح
- [ ] Input validation شاملة
- [ ] XSS protection مفعلة

### اختبار الأداء
- [ ] زمن استجابة API < 500ms
- [ ] صفحات تحمل بسرعة
- [ ] لا توجد memory leaks
- [ ] Lazy loading للصور
- [ ] Code splitting مطبق

### اختبار التوافق
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile browsers

## الخطوات التالية

بعد اجتياز جميع الاختبارات:

1. **Deploy to Staging**
   - انشر على بيئة staging
   - اختبر مع LearnWorlds sandbox

2. **User Testing**
   - اختبار مع مستخدمين حقيقيين
   - جمع feedback

3. **Production Deployment**
   - انشر على production
   - راقب logs والأداء
   - كن جاهزاً للرد على المشاكل

## الدعم والمساعدة

للمساعدة أو الإبلاغ عن مشاكل:
- راجع `LEARNWORLDS_INTEGRATION.md`
- تحقق من logs في console
- راجع LearnWorlds documentation
