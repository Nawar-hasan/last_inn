# خطة الربط مع LearnWorlds

## نظرة عامة
هذا الدليل يشرح كيفية ربط الموقع بالكامل مع LearnWorlds API

## المتطلبات الأساسية

### 1. الحصول على بيانات الاعتماد من LearnWorlds
- قم بتسجيل الدخول إلى لوحة تحكم LearnWorlds
- اذهب إلى Settings → API
- احصل على:
  - `LEARNWORLD_API_KEY` - مفتاح API
  - `LEARNWORLD_SCHOOL_ID` - معرف المدرسة
  - `LEARNWORLD_WEBHOOK_SECRET` - سر Webhooks

### 2. إعداد متغيرات البيئة
انسخ الملف `.env.local.example` إلى `.env.local` وأضف القيم الصحيحة:

\`\`\`bash
# LearnWorlds API
NEXT_PUBLIC_LEARNWORLD_API_URL=https://api.learnworlds.com/v2
LEARNWORLD_API_KEY=your_api_key_here
LEARNWORLD_SCHOOL_ID=your_school_id_here
LEARNWORLD_WEBHOOK_SECRET=your_webhook_secret_here
\`\`\`

## الوظائف المُجهزة للربط

### 1. نظام المصادقة (Authentication)
- ✅ صفحة تسجيل الدخول: `/auth/login`
- ✅ صفحة إنشاء الحساب: `/auth/register`
- ✅ صفحة استعادة كلمة المرور: `/auth/forgot-password`
- 🔄 يحتاج: استبدال `loginStudent()` و `registerStudent()` في API routes

### 2. الدورات (Courses)
- ✅ صفحة عرض جميع الدورات: `/courses`
- ✅ صفحات تفاصيل الدورات: `/courses/[slug]`
- 🔄 يحتاج: استبدال بيانات الدورات بـ `getAllCourses()` من LearnWorlds

### 3. لوحة الطالب (Student Dashboard)
- ✅ الصفحة الرئيسية: `/student`
- ✅ الدورات المسجلة: `/student/courses`
- ✅ الشهادات: `/student/certificates`
- ✅ الملف الشخصي: `/student/profile`
- 🔄 يحتاج: ربط مع `getStudentCourses()` و `getStudentCertificates()`

### 4. الدفع (Payments)
- ✅ صفحة المجتمع والباقات: `/community`
- ✅ Stripe Integration جاهزة
- 🔄 يحتاج: ربط `createPaymentSession()` مع LearnWorlds

## خطوات الربط التفصيلية

### الخطوة 1: تحديث Auth Context
في `lib/auth-context.tsx`:
\`\`\`typescript
import { loginStudent, registerStudent, getCurrentStudent } from '@/lib/learnworlds-api'

// استبدل fetch calls بـ LearnWorlds functions
const login = async (email: string, password: string) => {
  const data = await loginStudent(email, password)
  // ...
}
\`\`\`

### الخطوة 2: تحديث صفحة الدورات
في `app/courses/page.tsx`:
\`\`\`typescript
import { getAllCourses } from '@/lib/learnworlds-api'

// جلب الدورات من LearnWorlds
const courses = await getAllCourses()
\`\`\`

### الخطوة 3: إعداد Webhooks
أنشئ endpoint في `app/api/webhooks/learnworlds/route.ts`:
\`\`\`typescript
export async function POST(request: Request) {
  const signature = request.headers.get('X-LearnWorlds-Signature')
  const payload = await request.text()
  
  if (!verifyWebhookSignature(payload, signature)) {
    return new Response('Invalid signature', { status: 401 })
  }
  
  // معالجة الأحداث من LearnWorlds
}
\`\`\`

### الخطوة 4: ربط التقدم في الدورات
في `app/student/courses/[id]/page.tsx`:
\`\`\`typescript
import { getCourseProgress } from '@/lib/learnworlds-api'

const progress = await getCourseProgress(studentId, courseId)
\`\`\`

## نقاط مهمة

### الأمان (Security)
- ✅ جميع API Keys في server-side فقط
- ✅ استخدام HTTPS للاتصالات
- ✅ التحقق من Webhook signatures
- ✅ JWT tokens للمصادقة

### الأداء (Performance)
- استخدم caching للدورات (ISR في Next.js)
- استخدم SWR للبيانات الديناميكية
- Lazy load للفيديوهات والمحتوى الثقيل

### التجربة (UX)
- ✅ Loading states جاهزة
- ✅ Error handling موجود
- ✅ Responsive design
- ✅ RTL support للعربية

## الاختبار

### 1. اختبار المصادقة
\`\`\`bash
# تسجيل دخول
curl -X POST https://your-site.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
\`\`\`

### 2. اختبار الدورات
\`\`\`bash
# الحصول على جميع الدورات
curl https://your-site.com/api/courses
\`\`\`

## ملاحظات للتطوير

### Mock Data
- حالياً الموقع يستخدم mock data للتطوير
- بعد الحصول على API Keys، استبدل جميع الـ mock data
- ابحث عن `TODO: استبدال هذا بـ LearnWorlds API` في الكود

### Testing
- اختبر جميع الوظائف في بيئة staging أولاً
- تأكد من عمل Webhooks بشكل صحيح
- اختبر عمليات الدفع في sandbox mode

## المساعدة والدعم

### توثيق LearnWorlds
- [LearnWorlds API Docs](https://developers.learnworlds.com/)
- [Authentication Guide](https://developers.learnworlds.com/authentication)
- [Webhooks Guide](https://developers.learnworlds.com/webhooks)

### الخطوات التالية
1. احصل على API credentials من LearnWorlds
2. أضف المتغيرات في `.env.local`
3. اختبر المصادقة أولاً
4. ثم اختبر الدورات
5. أخيراً اختبر الدفع والشهادات
