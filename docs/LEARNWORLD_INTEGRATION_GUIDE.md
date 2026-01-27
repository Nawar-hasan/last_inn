# LearnWorld API Integration Guide

## Overview
هذا المشروع جاهز للتكامل الكامل مع LearnWorld API. تم بناء جميع الواجهات والخدمات الأساسية بما يسمح بربطها بسهولة مع LearnWorld.

## Architecture

### Core Services
- **LearnWorld Client**: في `lib/learnworld-client.ts` - عميل API قابل للاستخدام الفوري
- **Authentication Context**: في `lib/auth-context.tsx` - إدارة الجلسات والمصادقة
- **Data Hooks**: في `lib/hooks/use-student-data.ts` - hooks للوصول إلى البيانات

### API Routes (Ready for Integration)
- `app/api/auth/login/route.ts` - تسجيل الدخول
- `app/api/auth/register/route.ts` - التسجيل الجديد
- `app/api/auth/me/route.ts` - الحصول على بيانات المستخدم الحالي

## Required LearnWorld API Endpoints

### Authentication
- `POST /auth/login` - تسجيل الدخول
- `POST /auth/register` - تسجيل جديد
- `GET /auth/me` - البيانات الحالية

### Courses
- `GET /courses` - الحصول على جميع الدورات
- `GET /courses/{id}` - تفاصيل دورة محددة
- `GET /courses/{id}/lessons` - دروس الدورة
- `GET /lessons/{id}/materials` - مواد الدرس

### Student Progress
- `GET /students/{id}/progress/{courseId}` - تقدم الطالب
- `POST /students/{id}/lessons/{id}/complete` - وضع علامة على الدرس كمكتمل

### Quizzes
- `POST /students/{id}/quizzes/{id}/submit` - إرسال إجابات الاختبار
- `GET /students/{id}/quizzes/{id}/attempts` - محاولات الاختبار

### Certificates
- `POST /students/{id}/certificates/request` - طلب شهادة
- `GET /students/{id}/certificates` - الشهادات المحصول عليها
- `GET /certificates/{id}/download` - تحميل الشهادة

## Setup Steps

### 1. Environment Variables
أضف المتغيرات التالية إلى `.env.local` أو إعدادات Vercel:

\`\`\`env
NEXT_PUBLIC_LEARNWORLD_API_URL=https://api.learnworld.com
LEARNWORLD_API_KEY=your-api-key-here
LEARNWORLD_SCHOOL_ID=your-school-id
\`\`\`

### 2. Implement LearnWorld Client Methods

في `lib/learnworld-client.ts`:

\`\`\`typescript
// المثال:
async getCourses(): Promise<Course[]> {
  return this.request("/courses")
}
\`\`\`

استبدل `this.request()` بالـ endpoints الحقيقية من LearnWorld.

### 3. Connect API Routes

في `app/api/auth/login/route.ts`:

\`\`\`typescript
const response = await learnworldClient.login(email, password)
\`\`\`

### 4. Connect React Components

تحديث الـ hooks في `lib/hooks/use-student-data.ts` للاتصال بـ LearnWorld API.

## UI Components Ready for Integration

### Student Dashboard
- `app/student/page.tsx` - لوحة التحكم الرئيسية
- مربع الإحصائيات الديناميكي
- بطاقات الدورات مع تتبع التقدم

### Course Player
- `app/student/courses/[id]/page.tsx` - عرض الفيديو والمحتوى
- قائمة الدروس التفاعلية
- نظام المواد التدريبية

### Quiz Interface
- `app/student/courses/[id]/quiz/[quizId]/page.tsx` - واجهة الاختبارات
- عداد الوقت
- تقييم فوري وتفاصيل الإجابات

### Certificate System
- `app/student/courses/[id]/certificate/page.tsx` - طلب الشهادة
- نموذج البيانات
- معاينة الشهادة
- `app/student/certificates/page.tsx` - صفحة الشهادات

### Student Profile
- `app/student/profile/page.tsx` - الملف الشخصي
- تعديل البيانات
- إدارة الأمان
- تفضيلات الإشعارات

### Settings
- `app/student/settings/page.tsx` - الإعدادات العامة
- المظهر واللغة

## TypeScript Types

جميع الـ types معرفة في `lib/learnworld-types.ts`:

\`\`\`typescript
- Student
- Course
- Lesson
- Quiz
- Certificate
- StudentProgress
- QuizAttempt
\`\`\`

## Placeholder vs Real Data

المشروع حالياً يستخدم بيانات وهمية (Mock Data) في:
- الدورات
- الدروس
- الاختبارات
- بيانات الطالب

استبدل هذه بـ API calls عند ربط LearnWorld.

## Next Steps

1. احصل على LearnWorld API credentials
2. أضف المتغيرات البيئية
3. حدّث `lib/learnworld-client.ts` بـ endpoints الحقيقية
4. اختبر المصادقة أولاً
5. اختبر سحب الدورات والدروس
6. اختبر تتبع التقدم والاختبارات
7. اختبر نظام الشهادات

## Important Notes

- جميع الواجهات مصممة لكي تكون responsive
- النص ثنائي اللغة (عربي/إنجليزي) متكامل
- الرسائل والإشعارات جاهزة للربط مع email/WhatsApp
- الأمان والـ authentication جاهز للتكامل
