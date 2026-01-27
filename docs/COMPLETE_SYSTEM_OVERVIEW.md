# منصة إنوفولوجيا التعليمية - دليل النظام الشامل

## محتويات الدليل
1. البنية الهندسية الكاملة
2. تفاصيل التسجيل والدخول
3. رحلة حضور الدورات
4. هيكل البيانات والـ API
5. خريطة الملفات الكاملة
6. تسلسل العمليات

---

## 1. البنية الهندسية الكاملة

### المعمارية العامة للنظام

\`\`\`
Innovologia Platform
│
├─ Public Pages (لا تحتاج تسجيل دخول)
│  ├─ / (الصفحة الرئيسية)
│  ├─ /about-us (من نحن)
│  ├─ /blog (المدونة)
│  ├─ /blog/[slug] (مقال واحد)
│  ├─ /courses (عرض جميع الدورات)
│  ├─ /courses/[courseId] (تفاصيل دورة واحدة)
│  ├─ /community (المجتمع والباقات)
│  ├─ /checkout (الدفع)
│  ├─ /checkout/success (نجاح الدفع)
│  ├─ /faq (الأسئلة الشائعة)
│  ├─ /auth/login (تسجيل الدخول)
│  ├─ /auth/register (إنشاء حساب)
│  └─ /auth/forgot-password (استرجاع كلمة المرور)
│
├─ Protected Pages (تحتاج تسجيل دخول)
│  └─ /student/* (لوحة تحكم الطالب)
│     ├─ /student (الرئيسية)
│     ├─ /student/courses (دورات الطالب)
│     ├─ /student/courses/[id] (محتوى الدورة)
│     ├─ /student/courses/[id]/quiz/[quizId] (الاختبارات)
│     ├─ /student/courses/[id]/certificate (طلب الشهادة)
│     ├─ /student/certificates (عرض الشهادات)
│     ├─ /student/profile (الملف الشخصي)
│     ├─ /student/settings (الإعدادات)
│     └─ /student/messages (الرسائل)
│
├─ Admin Pages (تحتاج صلاحيات إدارية)
│  ├─ /admin/login (دخول المسؤول)
│  └─ /admin (لوحة التحكم الإدارية)
│
└─ API Routes
   ├─ /api/auth/* (المصادقة)
   ├─ /api/courses/* (الدورات)
   ├─ /api/progress/* (تتبع التقدم)
   ├─ /api/quizzes/* (الاختبارات)
   ├─ /api/certificates/* (الشهادات)
   └─ /api/payments/* (الدفع)
\`\`\`

---

## 2. تفاصيل عملية التسجيل والدخول

### المرحلة 1: إنشاء حساب جديد

**المسار:** `/auth/register`

**الملف:** `app/auth/register/page.tsx`

**البيانات المطلوبة:**
- الاسم الأول (firstName)
- الاسم الأخير (lastName)
- البريد الإلكتروني (email)
- كلمة المرور (password)
- تأكيد كلمة المرور (confirmPassword)
- قبول الشروط والأحكام

**التحقق من الصحة:**
- البريد الإلكتروني: يجب أن يكون صيغة بريد صحيحة وغير مستخدم من قبل
- كلمة المرور: 6 أحرف على الأقل
- تطابق كلمات المرور

**العملية:**
1. المستخدم يملء النموذج
2. عند الضغط على "إنشاء حساب":
   - يتم التحقق من البيانات محلياً
   - يتم استدعاء `/api/auth/register`
   - API يتحقق من البيانات مرة أخرى (Server-side validation)
   - إنشاء حساب جديد في LearnWorld
   - تخزين البيانات محلياً (localStorage)
   - إعادة توجيه إلى `/student` (لوحة الطالب)

**API Endpoint:**
\`\`\`typescript
POST /api/auth/register
Body: {
  email: string
  password: string
  firstName: string
  lastName: string
}
Response: {
  success: boolean
  studentId: string
  email: string
  token?: string
  message?: string
}
\`\`\`

---

### المرحلة 2: تسجيل الدخول

**المسار:** `/auth/login`

**الملف:** `app/auth/login/page.tsx`

**البيانات المطلوبة:**
- البريد الإلكتروني
- كلمة المرور
- خيار "تذكرني" (اختياري)

**العملية:**
1. المستخدم يدخل البريد وكلمة المرور
2. عند الضغط على "دخول":
   - استدعاء `/api/auth/login`
   - التحقق من البيانات
   - التحقق من الحساب في LearnWorld
   - تخزين بيانات المستخدم محلياً
   - إعادة توجيه إلى `/student`

**API Endpoint:**
\`\`\`typescript
POST /api/auth/login
Body: {
  email: string
  password: string
}
Response: {
  success: boolean
  studentId: string
  firstName: string
  lastName: string
  email: string
  token?: string
}
\`\`\`

---

### المرحلة 3: استرجاع كلمة المرور

**المسار:** `/auth/forgot-password`

**الملف:** `app/auth/forgot-password/page.tsx`

**العملية:**
1. المستخدم يدخل بريده الإلكتروني
2. يتم إرسال رابط إعادة تعيين إلى البريد
3. يتم توجيه المستخدم إلى صفحة إعادة تعيين كلمة المرور
4. إدخال كلمة المرور الجديدة
5. تحديث في النظام

---

## 3. رحلة حضور الدورات (Student Learning Journey)

### خطوة 1: اختيار الدورة

**المسار:** `/courses` أو `/courses/[courseId]`

**المحتوى:**
- عرض تفاصيل الدورة
- معلومات المدرب
- متطلبات الدورة
- السعر
- زر "احصل على الدورة"

**العملية:**
1. الطالب يختار دورة
2. يضغط على "احصل على الدورة"
3. يتم التوجيه إلى `/checkout`

---

### خطوة 2: الدفع والشراء

**المسار:** `/checkout` و `/checkout/success`

**الملف:** `app/checkout/page.tsx`

**البيانات المطلوبة:**
- البيانات الشخصية (يتم ملؤها تلقائياً من الملف الشخصي)
- طريقة الدفع (بطاقة信用/WhatsApp)
- كود الخصم (اختياري)

**العملية:**
1. عرض ملخص الدورة والسعر
2. تطبيق رموز الخصم إن وجدت
3. اختيار طريقة الدفع
4. استدعاء `/api/payments/process`
5. معالجة الدفع
6. إعادة توجيه إلى `/checkout/success`
7. إضافة الدورة إلى قائمة دورات الطالب في LearnWorld

**API Endpoint:**
\`\`\`typescript
POST /api/payments/process
Body: {
  studentId: string
  courseId: string
  amount: number
  paymentMethod: 'card' | 'whatsapp'
  couponCode?: string
}
Response: {
  success: boolean
  transactionId: string
  enrollmentId?: string
}
\`\`\`

---

### خطوة 3: الوصول إلى الدورة المشتراة

**المسار:** `/student/courses`

**الملف:** `app/student/courses/page.tsx`

**المحتوى:**
- قائمة بجميع دورات الطالب المشترك بها
- شريط تقدم لكل دورة
- معلومات البداية والنهاية
- عدد الدروس
- زر "متابعة الدورة"

**العملية:**
1. الطالب يدخل إلى لوحة التحكم
2. يختار "دوراتي" من القائمة الجانبية
3. يرى قائمة دوراته
4. يضغط على "متابعة الدورة"
5. يتم التوجيه إلى `/student/courses/[id]`

---

### خطوة 4: مشاهدة محتوى الدورة

**المسار:** `/student/courses/[id]`

**الملف:** `app/student/courses/[id]/page.tsx`

**المحتوى الرئيسي:**
- عارض الفيديو (Video Player)
- قائمة الدروس على اليسار
- اسم الدرس الحالي
- مدة الدرس
- المواد التدريبية (PDF, Documents)
- الملاحظات الشخصية

**الدروس المتاحة:**
1. مقدمة إلى الابتكار (45 دقيقة)
2. أساليب التفكير الإبداعي (60 دقيقة)
3. تطبيق الابتكار عملياً (90 دقيقة)

**العملية:**
1. مشاهدة الفيديو
2. تحميل المواد التدريبية
3. أخذ ملاحظات شخصية
4. تحديد الدرس كمكتمل
4. الانتقال إلى الدرس التالي
5. عند إكمال جميع الدروس: يظهر زر "أكمل الاختبار"

---

### خطوة 5: أخذ الاختبار

**المسار:** `/student/courses/[id]/quiz/[quizId]`

**الملف:** `app/student/courses/[id]/quiz/[quizId]/page.tsx`

**خصائص الاختبار:**
- عدد الأسئلة: 3 أسئلة
- نوع الأسئلة: متعدد الخيارات وصح/خطأ
- المدة الزمنية: 30 دقيقة
- الحد الأدنى للنجاح: 70%

**الأسئلة:**
1. السؤال الأول: متعدد الخيارات (ما هو الابتكار)
2. السؤال الثاني: صح/خطأ (التفكير الإبداعي ضروري)
3. السؤال الثالث: متعدد الخيارات (أدوات التفكير)

**العملية:**
1. عرض الأسئلة واحداً تلو الآخر
2. عداد زمني يعد تنازلياً
3. إمكانية الرجوع والتقدم بين الأسئلة
4. عند الانتهاء: ضغط "أنهي الاختبار"
5. عرض النتائج الفورية
6. إذا كان النجاح (70%+): ظهور زر "طلب الشهادة"
7. إذا كان الفشل: خيار "أعيد الاختبار"

**API Endpoint:**
\`\`\`typescript
POST /api/quizzes/submit
Body: {
  studentId: string
  quizId: string
  courseId: string
  answers: Record<string, string>
}
Response: {
  success: boolean
  score: number
  passed: boolean
  results: object
}
\`\`\`

---

### خطوة 6: طلب الشهادة

**المسار:** `/student/courses/[id]/certificate`

**الملف:** `app/student/courses/[id]/certificate/page.tsx`

**مراحل الطلب:**

#### المرحلة 1: ملء النموذج
- الاسم الكامل (مملوء تلقائياً)
- البريد الإلكتروني (مملوء تلقائياً)
- رقم الهاتف
- جهة العمل

#### المرحلة 2: معاينة الشهادة
- عرض مظهر الشهادة
- رقم الشهادة الفريد
- تاريخ الإصدار
- سنة الصلاحية

#### المرحلة 3: تأكيد الطلب
- تأكيد البيانات
- إرسال الطلب إلى LearnWorld

**بيانات الشهادة:**
- اسم الطالب الكامل
- اسم الدورة
- رقم الشهادة (مثال: CINP-ABC123XYZ)
- تاريخ الإصدار
- سنة الصلاحية (365 يوم)
- اسم المدرب: "أسامة بدندي"

**API Endpoint:**
\`\`\`typescript
POST /api/certificates/request
Body: {
  studentId: string
  courseId: string
  fullName: string
  email: string
  phone?: string
  organization?: string
}
Response: {
  success: boolean
  certificateId: string
  certificateNumber: string
  issueDate: string
  message: string
}
\`\`\`

---

### خطوة 7: عرض الشهادات

**المسار:** `/student/certificates`

**الملف:** `app/student/certificates/page.tsx`

**المحتوى:**
- قائمة بجميع شهادات الطالب
- معلومات كل شهادة (الاسم، التاريخ، الرقم)
- أزرار: تحميل، مشاركة، حذف

---

## 4. هيكل البيانات والـ API

### نموذج بيانات الطالب (Student Model)

\`\`\`typescript
interface Student {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  profileImage?: string
  bio?: string
  organization?: string
  country?: string
  enrolledCourses: string[] // قائمة معرّفات الدورات
  completedCourses: string[]
  certificates: Certificate[]
  createdAt: Date
  updatedAt: Date
}
\`\`\`

### نموذج بيانات الدورة (Course Model)

\`\`\`typescript
interface Course {
  id: string
  title: string
  titleEn: string
  description: string
  instructor: string
  price: number
  duration: number // بالساعات
  level: 'beginner' | 'intermediate' | 'advanced'
  lessons: Lesson[]
  quiz: Quiz
  certificateTemplate?: string
  createdAt: Date
  updatedAt: Date
}
\`\`\`

### نموذج بيانات الدرس (Lesson Model)

\`\`\`typescript
interface Lesson {
  id: string
  title: string
  titleEn: string
  description?: string
  videoUrl: string
  duration: number // بالدقائق
  materials: Material[]
  order: number
}
\`\`\`

### نموذج بيانات الاختبار (Quiz Model)

\`\`\`typescript
interface Quiz {
  id: string
  title: string
  courseId: string
  questions: Question[]
  duration: number // بالدقائق
  passingScore: number // نسبة النجاح (مثل 70)
}

interface Question {
  id: string
  type: 'multiple-choice' | 'true-false'
  question: string
  questionAr: string
  options: Option[]
  correctAnswer: string
}
\`\`\`

### نموذج بيانات الشهادة (Certificate Model)

\`\`\`typescript
interface Certificate {
  id: string
  studentId: string
  courseId: string
  certificateNumber: string
  issuedDate: Date
  validUntil: Date
  studentName: string
  instructor: string
  downloadUrl?: string
}
\`\`\`

---

## 5. خريطة الملفات الكاملة

### ملفات الصفحات (Pages)

\`\`\`
app/
├─ page.tsx (الصفحة الرئيسية)
├─ about-us/page.tsx
├─ blog/
│  ├─ page.tsx
│  └─ [slug]/page.tsx
├─ courses/
│  ├─ page.tsx
│  ├─ [courseId]/page.tsx
│  ├─ aina/page.tsx
│  ├─ ccino/page.tsx
│  ├─ cdtp/page.tsx
│  ├─ cinp/page.tsx
│  └─ cins/page.tsx
├─ community/page.tsx
├─ checkout/
│  ├─ page.tsx
│  └─ success/page.tsx
├─ faq/page.tsx
├─ auth/
│  ├─ login/page.tsx
│  ├─ register/page.tsx
│  └─ forgot-password/page.tsx
└─ student/
   ├─ page.tsx
   ├─ layout.tsx
   ├─ courses/
   │  ├─ page.tsx
   │  ├─ [id]/
   │  │  ├─ page.tsx
   │  │  ├─ quiz/[quizId]/page.tsx
   │  │  └─ certificate/page.tsx
   │  └─ loading.tsx
   ├─ certificates/page.tsx
   ├─ profile/page.tsx
   ├─ settings/page.tsx
   ├─ messages/page.tsx
   └─ _components/
      ├─ sidebar.tsx
      ├─ topbar.tsx
      ├─ header.tsx
      ├─ video-player.tsx
      └─ notification-toast.tsx
\`\`\`

### ملفات المكتبات (Libraries)

\`\`\`
lib/
├─ auth-context.tsx (إدارة المصادقة)
├─ language-context.tsx (إدارة اللغات)
├─ learnworld-client.ts (عميل LearnWorld API)
├─ learnworld-types.ts (أنواع بيانات LearnWorld)
├─ theme-service.ts (خدمة المظهر)
├─ advanced-notification-service.ts (خدمة الإشعارات)
├─ utils.ts (دوال مساعدة)
└─ hooks/
   └─ use-student-data.ts (خطاف البيانات)
\`\`\`

### ملفات API

\`\`\`
app/api/
├─ auth/
│  ├─ login/route.ts
│  ├─ register/route.ts
│  ├─ me/route.ts
│  ├─ forgot-password/route.ts
│  └─ validate-token/route.ts
├─ courses/
│  ├─ route.ts
│  └─ [id]/route.ts
├─ progress/route.ts
├─ quizzes/submit/route.ts
├─ certificates/request/route.ts
└─ payments/process/route.ts
\`\`\`

---

## 6. تسلسل العمليات الرئيسية

### تسلسل التسجيل الكامل

\`\`\`
المستخدم يضغط على "إنشاء حساب"
        ↓
التحقق من البيانات (الواجهة)
        ↓
استدعاء POST /api/auth/register
        ↓
التحقق من البيانات (الخادم)
        ↓
التحقق من عدم وجود البريد الإلكتروني
        ↓
إنشاء حساب في LearnWorld
        ↓
تخزين البيانات محلياً (localStorage)
        ↓
تعيين في Auth Context
        ↓
إعادة توجيه إلى /student
        ↓
عرض لوحة تحكم الطالب
\`\`\`

### تسلسل شراء الدورة الكامل

\`\`\`
عرض الدورة (/courses/[id])
        ↓
المستخدم يضغط "احصل على الدورة"
        ↓
التوجيه إلى /checkout
        ↓
عرض ملخص الدورة والسعر
        ↓
المستخدم يملء بيانات الدفع
        ↓
استدعاء POST /api/payments/process
        ↓
معالجة الدفع (Stripe/WhatsApp)
        ↓
تسجيل الدورة في LearnWorld
        ↓
إضافة إلى قائمة دورات الطالب
        ↓
إعادة توجيه إلى /checkout/success
        ↓
عرض رسالة النجاح
        ↓
المستخدم يضغط "ابدأ الدورة"
        ↓
إعادة توجيه إلى /student/courses
\`\`\`

### تسلسل حضور الدورة الكامل

\`\`\`
دخول إلى /student/courses/[id]
        ↓
تحميل بيانات الدرس من LearnWorld API
        ↓
عرض الفيديو والمحتوى
        ↓
المستخدم يشاهد الفيديو
        ↓
أخذ ملاحظات شخصية
        ↓
تحميل المواد التدريبية
        ↓
ضغط "وضع كمكتمل"
        ↓
إرسال POST /api/progress
        ↓
تحديث في LearnWorld
        ↓
الانتقال إلى الدرس التالي
        ↓
(تكرار العملية)
        ↓
عند إكمال جميع الدروس
        ↓
ظهور زر "أكمل الاختبار"
\`\`\`

### تسلسل الاختبار الكامل

\`\`\`
دخول إلى /student/courses/[id]/quiz/[quizId]
        ↓
عرض السؤال الأول
        ↓
عداد زمني يبدأ (30 دقيقة)
        ↓
المستخدم يجيب على الأسئلة
        ↓
التنقل بين الأسئلة (السابق/التالي)
        ↓
ضغط "أنهي الاختبار"
        ↓
استدعاء POST /api/quizzes/submit
        ↓
تصحيح الإجابات في LearnWorld
        ↓
حساب النتيجة
        ↓
عرض النتائج الفورية
        ↓
إذا كان النجاح (≥70%)
        ↓
ظهور زر "طلب الشهادة"
        ↓
المستخدم يضغط على الزر
        ↓
التوجيه إلى /student/courses/[id]/certificate
\`\`\`

### تسلسل طلب الشهادة الكامل

\`\`\`
دخول إلى صفحة طلب الشهادة
        ↓
المرحلة 1: ملء النموذج
- الاسم (مملوء تلقائياً)
- البريد (مملوء تلقائياً)
- الهاتف (اختياري)
- جهة العمل (اختياري)
        ↓
ضغط "عرض معاينة"
        ↓
المرحلة 2: عرض معاينة الشهادة
- صورة الشهادة
- بيانات الطالب
- اسم الدورة
- رقم الشهادة
- تاريخ الإصدار
        ↓
ضغط "تأكيد الطلب"
        ↓
استدعاء POST /api/certificates/request
        ↓
إنشاء الشهادة في LearnWorld
        ↓
إرسال البريد الإلكتروني
        ↓
المرحلة 3: صفحة النجاح
- رقم الشهادة
- تاريخ الإصدار
- خيارات التحميل والمشاركة
\`\`\`

---

## 7. نقاط الاتصال مع LearnWorld API

### الدعوات الأساسية للـ API

\`\`\`typescript
// التسجيل
learnworldClient.createStudent({
  firstName: string
  lastName: string
  email: string
  password: string
})

// تسجيل الدخول
learnworldClient.login(email: string, password: string)

// الحصول على بيانات الطالب
learnworldClient.getStudentProfile(studentId: string)

// الحصول على دورات الطالب
learnworldClient.getStudentCourses(studentId: string)

// تحديث تقدم الدرس
learnworldClient.markLessonComplete(studentId: string, courseId: string, lessonId: string)

// إرسال إجابات الاختبار
learnworldClient.submitQuiz(studentId: string, quizId: string, answers: object)

// طلب الشهادة
learnworldClient.requestCertificate(studentId: string, courseId: string)

// الحصول على الشهادات
learnworldClient.getStudentCertificates(studentId: string)
\`\`\`

---

## 8. الحالات الخاصة والأخطاء

### معالجة الأخطاء

#### خطأ المصادقة
- البريد غير موجود
- كلمة المرور خاطئة
- الحساب غير مفعل
- انتهاء صلاحية الجلسة

#### خطأ الدفع
- رفض بطاقة الائتمان
- عملة غير مدعومة
- انتهاء صلاحية البطاقة

#### خطأ الاختبار
- انتهاء الوقت
- فقدان الاتصال بالإنترنت
- إعادة تحميل الصفحة

---

## 9. الخطوات التالية للتكامل الكامل

1. الحصول على بيانات LearnWorld API
2. تحديث ملف `learnworld-client.ts`
3. اختبار جميع الـ API endpoints
4. تفعيل المصادقة الكاملة
5. ربط البيانات الحقيقية
6. الاختبار الشامل (QA)
7. النشر على الإنتاج (Production)

---

**آخر تحديث:** 12/5/2025
**الحالة:** جاهز للتكامل مع LearnWorld
