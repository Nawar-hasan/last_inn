# دليل اختبار API - LearnWorlds Integration

## نظرة عامة

هذا الدليل يشرح كيفية اختبار جميع endpoints في المشروع مع LearnWorlds API.

---

## المتطلبات

### 1. أدوات الاختبار

اختر أحد هذه الأدوات:
- **Postman** (موصى به)
- **curl** (Command line)
- **Thunder Client** (VS Code extension)
- **Insomnia**

### 2. Environment Variables

تأكد من وجود `.env.local` مع القيم الصحيحة:
```env
LEARNWORLD_API_URL=https://api.learnworlds.com/v2
LEARNWORLD_API_KEY=your_actual_key
LEARNWORLD_SCHOOL_ID=your_school_id
LEARNWORLD_WEBHOOK_SECRET=your_secret
```

---

## اختبار SSO

### Test 1: SSO Login

**Request:**
```bash
curl -X POST http://localhost:3000/api/sso \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "redirectUrl": "https://yourschool.learnworlds.com/dashboard"
  }'
```

**Expected Response (Success):**
```json
{
  "url": "https://yourschool.learnworlds.com/sso?token=..."
}
```

**Expected Response (Error - No API Key):**
```json
{
  "error": "Server configuration error. Please contact administrator."
}
```

**Expected Response (Error - User Not Found):**
```json
{
  "error": "User not found"
}
```

---

## اختبار إنشاء المستخدمين

### Test 2: Create User

**Request:**
```bash
curl -X POST http://localhost:3000/api/test/create-user \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "SecurePass123!",
    "firstName": "أحمد",
    "lastName": "محمد",
    "username": "ahmed_mohammed"
  }'
```

**Expected Response (Success):**
```json
{
  "id": "user_abc123xyz",
  "email": "newuser@example.com",
  "username": "ahmed_mohammed",
  "first_name": "أحمد",
  "last_name": "محمد",
  "created_at": "2024-01-15T10:30:00Z"
}
```

**Expected Response (Error - Email Exists):**
```json
{
  "error": "Email already registered"
}
```

---

## اختبار التسجيل في الدورات

### Test 3: Enroll User in Course

**الخطوة 1: احصل على User ID**
```bash
curl http://localhost:3000/api/test/users?email=newuser@example.com
```

**الخطوة 2: احصل على Course ID**
```bash
curl http://localhost:3000/api/courses
```

**الخطوة 3: سجل المستخدم**
```bash
curl -X POST http://localhost:3000/api/test/enroll \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user_abc123xyz",
    "course_id": "course_xyz789abc"
  }'
```

**Expected Response (Success):**
```json
{
  "id": "enrollment_123",
  "user_id": "user_abc123xyz",
  "course_id": "course_xyz789abc",
  "enrolled_at": "2024-01-15T10:35:00Z",
  "status": "active"
}
```

---

## اختبار الدورات

### Test 4: Get All Courses

**Request:**
```bash
curl http://localhost:3000/api/courses
```

**Expected Response:**
```json
[
  {
    "id": "course_xyz789",
    "title": "Certified Innovation Professional",
    "titleAr": "محترف الابتكار المعتمد",
    "description": "Comprehensive innovation course",
    "instructor": "أسامة بدندي",
    "image": "/innovation-course.jpg",
    "duration": 40,
    "level": "intermediate",
    "price": 2000,
    "currency": "SAR",
    "lessons": 25,
    "studentsCount": 450,
    "rating": 4.8
  }
]
```

### Test 5: Get Course by ID

**Request:**
```bash
curl http://localhost:3000/api/courses/course_xyz789
```

**Expected Response:**
```json
{
  "id": "course_xyz789",
  "title": "Certified Innovation Professional",
  "description": "Comprehensive innovation course...",
  "sections": [
    {
      "id": "section_1",
      "title": "Introduction to Innovation",
      "lessons": [...]
    }
  ]
}
```

---

## اختبار Authentication

### Test 6: Register New Account

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "SecurePass123!",
    "firstName": "محمد",
    "lastName": "أحمد"
  }'
```

**Expected Response (Success):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "student": {
    "id": "student_123",
    "email": "student@example.com",
    "firstName": "محمد",
    "lastName": "أحمد",
    "enrolledCourses": []
  }
}
```

### Test 7: Login

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "SecurePass123!"
  }'
```

**Expected Response (Success):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "student": {
    "id": "student_123",
    "email": "student@example.com",
    "firstName": "محمد",
    "lastName": "أحمد",
    "enrolledCourses": ["course_1", "course_2"]
  }
}
```

---

## اختبار Webhooks

### Test 8: Simulate Webhook

**يجب استخدام Webhook Secret لحساب Signature:**

```javascript
// في Node.js
const crypto = require('crypto')

const payload = JSON.stringify({
  event: 'user.enrolled',
  data: {
    user_id: 'user_123',
    course_id: 'course_456',
    enrolled_at: '2024-01-15T10:00:00Z'
  }
})

const signature = crypto
  .createHmac('sha256', process.env.LEARNWORLD_WEBHOOK_SECRET)
  .update(payload)
  .digest('hex')

console.log('Signature:', signature)
```

**Request:**
```bash
curl -X POST http://localhost:3000/api/webhooks/learnworlds \
  -H "Content-Type: application/json" \
  -H "X-LearnWorlds-Signature: YOUR_CALCULATED_SIGNATURE" \
  -d '{
    "event": "user.enrolled",
    "data": {
      "user_id": "user_123",
      "course_id": "course_456",
      "enrolled_at": "2024-01-15T10:00:00Z"
    }
  }'
```

**Expected Response (Success):**
```json
{
  "received": true,
  "event": "user.enrolled"
}
```

**Expected Response (Invalid Signature):**
```json
{
  "error": "Invalid signature"
}
```

---

## اختبار البحث عن المستخدمين

### Test 9: Search Users by Email

**Request:**
```bash
curl http://localhost:3000/api/test/users?email=student@example.com
```

**Expected Response:**
```json
{
  "data": [
    {
      "id": "user_123",
      "email": "student@example.com",
      "username": "student",
      "first_name": "محمد",
      "last_name": "أحمد",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "meta": {
    "total": 1,
    "page": 1
  }
}
```

### Test 10: Get All Users

**Request:**
```bash
curl http://localhost:3000/api/test/users
```

**Expected Response:**
```json
{
  "data": [
    {
      "id": "user_123",
      "email": "student1@example.com",
      "username": "student1"
    },
    {
      "id": "user_456",
      "email": "student2@example.com",
      "username": "student2"
    }
  ],
  "meta": {
    "total": 2,
    "page": 1,
    "per_page": 50
  }
}
```

---

## اختبار Mock Mode

### Test 11: Test Without API Key

**الخطوة 1: احذف API Key مؤقتاً**
```bash
# في .env.local، ضع # قبل السطر:
# LEARNWORLD_API_KEY=...
```

**الخطوة 2: أعد تشغيل السيرفر**
```bash
npm run dev
```

**الخطوة 3: اختبر أي endpoint**
```bash
curl http://localhost:3000/api/courses
```

**Expected:** يجب أن ترجع mock data بدلاً من بيانات حقيقية

**الخطوة 4: أعد API Key**
```bash
# أزل # من السطر
LEARNWORLD_API_KEY=your_actual_key
```

---

## اختبار معالجة الأخطاء

### Test 12: Invalid Email Format

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "notanemail",
    "password": "pass123"
  }'
```

**Expected Response:**
```json
{
  "error": "Invalid email format"
}
```

### Test 13: Missing Required Fields

**Request:**
```bash
curl -X POST http://localhost:3000/api/test/create-user \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com"
  }'
```

**Expected Response:**
```json
{
  "error": "Email is required"
}
```

### Test 14: Invalid Credentials

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "wrongpassword"
  }'
```

**Expected Response:**
```json
{
  "error": "Invalid credentials"
}
```

---

## Postman Collection

### إنشاء Collection في Postman

**1. إنشاء Environment:**
```json
{
  "name": "LearnWorlds Dev",
  "values": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000",
      "enabled": true
    },
    {
      "key": "token",
      "value": "",
      "enabled": true
    }
  ]
}
```

**2. إضافة Requests:**

**SSO:**
- Method: POST
- URL: `{{baseUrl}}/api/sso`
- Body: 
```json
{
  "email": "test@example.com"
}
```

**Create User:**
- Method: POST
- URL: `{{baseUrl}}/api/test/create-user`
- Body:
```json
{
  "email": "newuser@example.com",
  "password": "SecurePass123!",
  "firstName": "أحمد",
  "lastName": "محمد"
}
```

**Get Courses:**
- Method: GET
- URL: `{{baseUrl}}/api/courses`

---

## سيناريوهات اختبار كاملة

### السيناريو 1: رحلة المستخدم الجديد

1. **إنشاء حساب**
   ```bash
   POST /api/test/create-user
   ```

2. **الحصول على SSO URL**
   ```bash
   POST /api/sso
   ```

3. **تسجيل في دورة**
   ```bash
   POST /api/test/enroll
   ```

4. **التحقق من التسجيل عبر webhook**
   ```bash
   # يجب استلام webhook: user.enrolled
   ```

### السيناريو 2: المستخدم الموجود

1. **تسجيل الدخول**
   ```bash
   POST /api/auth/login
   ```

2. **جلب الدورات**
   ```bash
   GET /api/courses
   ```

3. **عرض تقدم الطالب**
   ```bash
   GET /api/progress?studentId=123&courseId=456
   ```

---

## الخلاصة

### قائمة اختبار شاملة

- [ ] SSO يعمل ويرجع URL صحيح
- [ ] إنشاء مستخدم ينجح في LearnWorlds
- [ ] التسجيل في دورة يعمل
- [ ] جلب الدورات يرجع بيانات حقيقية
- [ ] تسجيل الدخول يعمل مع LearnWorlds
- [ ] Webhooks تُستقبل وتُتحقق منها
- [ ] معالجة الأخطاء تعمل بشكل صحيح
- [ ] Mock mode يعمل بدون API key
- [ ] جميع logs تظهر في console

**عند نجاح جميع الاختبارات، المشروع جاهز للإنتاج! 🚀**
