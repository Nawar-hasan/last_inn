# جميع روابط صفحات الموقع - Innovologia

## الصفحات العامة (Public Pages)

### الصفحة الرئيسية
- **الرابط**: `/`
- **الوصف**: الصفحة الرئيسية للموقع مع البانر الرئيسي والخدمات والشهادات

### صفحات المعلومات
- **من نحن**: `/about-us`
- **تواصل معنا**: `/contact`
- **سياسة الخصوصية**: `/privacy`
- **الأسئلة الشائعة**: `/faq`
- **المدونة**: `/blog`
- **الشروط والأحكام**: `/t&c`

---

## صفحات الدورات (Courses)

### صفحة الدورات الرئيسية
- **الرابط**: `/courses`
- **الوصف**: عرض جميع الدورات المتاحة

### صفحات تفاصيل الدورات
1. **دورة استراتيجي الابتكار المعتمد (CInS)**
   - **الرابط**: `/courses/cins`
   - **السعر**: $1635
   - **الحالة**: ✅ متاح

2. **دورة مقيم الابتكار المعتمد (AInA)**
   - **الرابط**: `/courses/aina`
   - **السعر**: $2156
   - **الحالة**: ✅ متاح

3. **دورة الرئيس التنفيذي للابتكار المعتمد (CCInO)**
   - **الرابط**: `/courses/ccino`
   - **السعر**: $1980
   - **الحالة**: ✅ متاح

4. **دورة محترف التفكير التصميمي المعتمد (CDTP)**
   - **الرابط**: `/courses/cdtp`
   - **السعر**: $1380
   - **الحالة**: ✅ متاح

5. **دورة محترف الابتكار المعتمد (CInP)**
   - **الرابط**: `/courses/cinp`
   - **السعر**: $1990
   - **الحالة**: ✅ متاح

---

## صفحات المصادقة (Authentication)

### تسجيل الدخول والتسجيل
- **تسجيل الدخول**: `/auth/login`
- **إنشاء حساب**: `/auth/register`
- **نسيت كلمة المرور**: `/auth/forgot-password`
- **إعادة تعيين كلمة المرور**: `/auth/reset-password`

---

## صفحات الدفع (Payment)

### صفحة الدفع
- **الرابط**: `/checkout`
- **المعاملات المطلوبة**: 
  - `course`: معرف الدورة (cins, aina, ccino, cdtp, cinp)
  - `name`: اسم الدورة
  - `price`: سعر الدورة
- **مثال**: `/checkout?course=cins&name=دورة استراتيجي الابتكار المعتمد CInS&price=1635`

---

## صفحات المجتمع (Community)

### صفحة المجتمع الرئيسية
- **الرابط**: `/community`
- **الباقات المتاحة**:
  - **مجاني**: الانضمام للمجتمع - تسجيل دخول مطلوب
  - **بلاتينيوم**: $99 شهرياً - دفع مطلوب
  - **ذهبي**: $199 شهرياً - دفع مطلوب

---

## منطقة الطالب (Student Area)

### لوحة التحكم والإعدادات
- **لوحة التحكم**: `/student`
- **الإعدادات**: `/student/settings`
- **الملف الشخصي**: `/student/profile`

### الدورات والتقدم
- **دوراتي**: `/student/courses`
- **صفحة حضور الدورة**: `/student/courses/[courseId]`
  - **مثال**: `/student/courses/cins`
- **الدروس**: `/student/courses/[courseId]/lesson/[lessonId]`
  - **مثال**: `/student/courses/cins/lesson/1`

### الاختبارات والشهادات
- **الاختبارات**: `/student/courses/[courseId]/quiz/[quizId]`
  - **مثال**: `/student/courses/cins/quiz/1`
- **الشهادات**: `/student/certificates`
- **شهادة محددة**: `/student/courses/[courseId]/certificate`
  - **مثال**: `/student/courses/cins/certificate`

### المجتمع والدعم
- **المجتمع**: `/student/community`
- **المساعدة**: `/student/help`

---

## الإشعارات (Notifications)
- **الإشعارات**: يتم عرضها في Topbar في منطقة الطالب
- **API Endpoint**: `/api/notifications`

---

## مسارات الدفع (Payment Flows)

### 1. الاشتراك في دورة
\`\`\`
الصفحة الرئيسية أو صفحة الدورات
    ↓
صفحة تفاصيل الدورة (مثل /courses/cins)
    ↓
النقر على "اشترك في الدورة"
    ↓
التحقق من تسجيل الدخول
    ├─ غير مسجل → /auth/login?redirect=/checkout?course=cins
    └─ مسجل → /checkout?course=cins&name=...&price=...
    ↓
إكمال عملية الدفع
    ↓
تفعيل الدورة في حساب الطالب
    ↓
/student/courses/[courseId]
\`\`\`

### 2. الاشتراك في المجتمع
\`\`\`
صفحة المجتمع (/community)
    ↓
اختيار الباقة
    ├─ مجاني → التحقق من الدخول → /auth/login أو /student/community
    └─ مدفوع → /checkout?community=platinum أو gold
    ↓
إكمال الدفع (للباقات المدفوعة)
    ↓
تفعيل العضوية
    ↓
/student/community
\`\`\`

---

## API Endpoints (للتطوير)

### المصادقة
- `POST /api/auth/login` - تسجيل الدخول
- `POST /api/auth/register` - إنشاء حساب
- `POST /api/auth/logout` - تسجيل الخروج
- `POST /api/auth/forgot-password` - طلب إعادة تعيين كلمة المرور
- `POST /api/auth/reset-password` - إعادة تعيين كلمة المرور

### الدورات
- `GET /api/courses` - جميع الدورات
- `GET /api/courses/[id]` - تفاصيل دورة محددة
- `POST /api/courses/enroll` - الاشتراك في دورة

### التقدم والإكمال
- `GET /api/progress` - التقدم في جميع الدورات
- `POST /api/progress` - تحديث التقدم
- `GET /api/progress/[courseId]` - التقدم في دورة محددة

### الشهادات
- `GET /api/certificates` - جميع الشهادات
- `POST /api/certificates/request` - طلب شهادة

### الدفع
- `POST /api/payment/create` - إنشاء جلسة دفع
- `POST /api/payment/webhook` - webhook من LearnWorlds

### الإشعارات
- `GET /api/notifications` - جميع الإشعارات
- `POST /api/notifications/read` - تعليم الإشعارات كمقروءة

---

## ملاحظات مهمة للاختبار

1. **صفحات تتطلب تسجيل دخول**:
   - جميع صفحات `/student/*`
   - صفحة `/checkout`
   - صفحة `/community` (للباقة المجانية)

2. **معلمات URL المطلوبة**:
   - صفحة الدفع تتطلب معلمات: `course`, `name`, `price`
   - صفحات الدروس تتطلب: `courseId`, `lessonId`
   - صفحات الاختبارات تتطلب: `courseId`, `quizId`

3. **التكامل مع LearnWorlds**:
   - جميع البيانات حالياً mock data
   - يجب إضافة API credentials في `.env.local`
   - راجع ملف `LEARNWORLDS_INTEGRATION_PLAN.md`

4. **الأمان**:
   - جميع API routes محمية
   - التحقق من الـ tokens في كل طلب
   - حماية CSRF مفعلة

---

## حالة الصفحات

| الصفحة | الحالة | الملاحظات |
|--------|--------|-----------|
| الصفحة الرئيسية | ✅ جاهز | تصميم كامل |
| صفحات الدورات | ✅ جاهز | أزرار الاشتراك مفعلة |
| صفحة الدفع | ✅ جاهز | جاهزة للربط مع LearnWorlds |
| تسجيل الدخول | ✅ جاهز | نظام كامل |
| منطقة الطالب | ✅ جاهز | جميع الصفحات موجودة |
| المجتمع | ✅ جاهز | مع نظام الباقات |
| الإشعارات | ✅ جاهز | في الـ Topbar |

---

**آخر تحديث**: 30 نوفمبر 2024
**الحالة**: جاهز للربط مع LearnWorlds API
