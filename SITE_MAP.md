# خريطة الموقع الكاملة - Innovologia Platform
## Complete Site Map with All Pages

### الصفحات العامة (Public Pages)

#### الصفحة الرئيسية
- **URL**: `/`
- **الوصف**: الصفحة الرئيسية مع Hero، الخدمات، والميزات

#### صفحات المحتوى
- **من نحن**: `/about-us`
- **المدونة**: `/blog`
- **مقالة المدونة**: `/blog/[slug]`
- **تواصل معنا**: `/contact`
- **الأسئلة الشائعة**: `/faq`
- **سياسة الخصوصية**: `/privacy`
- **الشروط والأحكام**: `/t&c`

---

### نظام الدورات (Courses System)

#### صفحة الدورات الرئيسية
- **URL**: `/courses`
- **الوصف**: عرض جميع الدورات المتاحة بكاردات جميلة

#### صفحات تفاصيل الدورات
1. **CInS - الرئيس التنفيذي للابتكار الاستراتيجي**
   - **URL**: `/courses/cins`
   - **السعر**: $2,375
   - **الميزات**: Badge، جدول التسعير، تفاصيل المنهج

2. **AInA - مهندس الابتكار بالذكاء الاصطناعي**
   - **URL**: `/courses/aina`
   - **السعر**: $2,375

3. **CDTP - محترف التفكير التصميمي المعتمد**
   - **URL**: `/courses/cdtp`
   - **السعر**: $1,990

4. **CCInO - الرئيس التنفيذي للابتكار المعتمد**
   - **URL**: `/courses/ccino`
   - **السعر**: $3,700

5. **CInP - محترف الابتكار المعتمد**
   - **URL**: `/courses/cinp`
   - **السعر**: $3,990

---

### نظام المصادقة (Authentication System)

#### تسجيل الدخول والتسجيل
- **تسجيل الدخول**: `/auth/login`
- **إنشاء حساب جديد**: `/auth/register`
- **استعادة كلمة المرور**: `/auth/forgot-password`

#### API Routes
- **POST** `/api/auth/login` - تسجيل الدخول
- **POST** `/api/auth/register` - إنشاء حساب جديد
- **POST** `/api/auth/forgot-password` - طلب استعادة كلمة المرور
- **GET** `/api/auth/me` - الحصول على معلومات المستخدم الحالي
- **POST** `/api/auth/validate-token` - التحقق من صلاحية الجلسة

---

### لوحة تحكم الطالب (Student Dashboard)

#### الصفحات الرئيسية
- **لوحة التحكم**: `/student`
- **دوراتي**: `/student/courses`
- **الشهادات**: `/student/certificates`
- **الرسائل**: `/student/messages`
- **الملف الشخصي**: `/student/profile`
- **الإعدادات**: `/student/settings`

#### صفحات الدورة
- **عرض الدورة**: `/student/courses/[id]`
  - مشغل الفيديو
  - قائمة الدروس
  - المواد التعليمية
  - الملاحظات

- **الاختبارات**: `/student/courses/[id]/quiz/[quizId]`
  - أسئلة تفاعلية
  - مؤقت للوقت
  - عرض النتائج

- **طلب الشهادة**: `/student/courses/[id]/certificate`
  - معاينة الشهادة
  - تحميل PDF

---

### نظام الدفع (Payment System)

#### صفحات الدفع
- **صفحة الدفع الرئيسية**: `/checkout`
  - **المعاملات المدعومة**:
    - `?type=course&id=cins` - شراء دورة
    - `?type=community&plan=Professional` - اشتراك مجتمع
  
- **نجاح الدفع**: `/checkout/success`
  - عرض تأكيد الطلب
  - رقم الطلب
  - روابط الوصول للدورة

#### API Routes للدفع
- **POST** `/api/payments/process` - معالجة عملية الدفع
  \`\`\`json
  {
    "items": [...],
    "studentId": "xxx",
    "email": "user@example.com",
    "totalAmount": 2375
  }
  \`\`\`

---

### نظام المجتمع (Community System)

#### صفحة المجتمع
- **URL**: `/community`
- **الوصف**: عرض باقات المجتمع (مجاني، محترف، نخبة)

#### باقات المجتمع
1. **الباقة المجانية** - $0
   - يتطلب تسجيل حساب فقط
   - التوجيه: `/auth/register`

2. **الباقة المحترفة** - $47/شهر
   - يتطلب تسجيل دخول + دفع
   - التوجيه: `/checkout?type=community&plan=Professional`

3. **باقة النخبة** - $197/شهر
   - يتطلب تسجيل دخول + دفع
   - التوجيه: `/checkout?type=community&plan=Elite`

---

### APIs الإضافية (Additional APIs)

#### إدارة الدورات
- **GET** `/api/courses` - الحصول على جميع الدورات
- **GET** `/api/courses/[id]` - الحصول على تفاصيل دورة محددة

#### التقدم والشهادات
- **GET** `/api/progress?studentId=xxx&courseId=xxx` - تقدم الطالب
- **POST** `/api/certificates/request` - طلب شهادة
- **POST** `/api/quizzes/submit` - إرسال إجابات الاختبار

#### الإشعارات
- **POST** `/api/notifications/send` - إرسال إشعار

#### معلومات جغرافية
- **GET** `/api/geo` - الحصول على معلومات الموقع

---

### ملفات النظام (System Files)

- **robots.txt**: `/robots.txt`
- **sitemap.xml**: `/sitemap.xml`

---

## Flow Charts (مخططات سير العمل)

### 1. شراء دورة (Course Purchase Flow)
\`\`\`
المستخدم يختار دورة من /courses
  ↓
ينقر "اشترك في الدورة"
  ↓
يتم التحقق من حالة تسجيل الدخول
  ↓ نعم                    ↓ لا
الانتقال إلى /checkout   إعادة توجيه إلى /auth/login
  ↓
عرض صفحة الدفع
  ↓
المستخدم يكمل الدفع
  ↓
معالجة الدفع عبر LearnWorlds API
  ↓
الانتقال إلى /checkout/success
  ↓
الوصول للدورة في /student/courses
\`\`\`

### 2. اشتراك مجتمع (Community Subscription Flow)
\`\`\`
المستخدم يزور /community
  ↓
يختار باقة (مجاني/محترف/نخبة)
  ↓
مجاني؟
  ↓ نعم                    ↓ لا
/auth/register            تحقق من تسجيل الدخول
                            ↓ نعم              ↓ لا
                          /checkout          /auth/login
                            ↓
                          معالجة الدفع
                            ↓
                          وصول للمجتمع
\`\`\`

### 3. حضور دورة (Course Attendance Flow)
\`\`\`
الطالب يسجل الدخول
  ↓
/student/courses
  ↓
يختار دورة
  ↓
/student/courses/[id]
  ↓
مشاهدة الفيديو + المواد
  ↓
إكمال الدروس
  ↓
/student/courses/[id]/quiz/[quizId]
  ↓
اجتياز الاختبار (70%+)
  ↓
/student/courses/[id]/certificate
  ↓
تحميل الشهادة
\`\`\`

---

## ملاحظات للربط مع LearnWorlds

### المتغيرات المطلوبة في `.env.local`:
\`\`\`bash
# LearnWorlds API
LEARNWORLDS_API_URL=https://api.learnworlds.com/v2
LEARNWORLDS_API_KEY=your_api_key_here
LEARNWORLDS_SCHOOL_ID=your_school_id

# Payment Gateway
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx

# Webhooks
LEARNWORLDS_WEBHOOK_SECRET=whsec_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
\`\`\`

### الـ APIs التي تحتاج ربط LearnWorlds:
1. `/api/auth/login` - SSO مع LearnWorlds
2. `/api/courses` - جلب الدورات من LearnWorlds
3. `/api/payments/process` - الدفع عبر Stripe → تسجيل في LearnWorlds
4. `/api/progress` - مزامنة التقدم مع LearnWorlds
5. `/api/certificates/request` - طلب شهادات من LearnWorlds

---

## صفحات للاختبار (Testing Pages)

يمكنك الآن اختبار جميع هذه الصفحات:

### مباشرة
- https://your-domain.com/
- https://your-domain.com/courses
- https://your-domain.com/community
- https://your-domain.com/auth/login
- https://your-domain.com/checkout?type=course&id=cins

### بعد تسجيل الدخول
- https://your-domain.com/student
- https://your-domain.com/student/courses
- https://your-domain.com/student/courses/cins
- https://your-domain.com/student/courses/cins/quiz/1
- https://your-domain.com/student/certificates

---

**آخر تحديث**: ديسمبر 2024
**الحالة**: ✅ جاهز للربط مع LearnWorlds
