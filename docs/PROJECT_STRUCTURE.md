# هيكل المشروع - Innovologia

## البنية الكاملة

\`\`\`
innovologia/
│
├── app/                          # جميع الصفحات والـ Routes
│   ├── page.tsx                  # الصفحة الرئيسية
│   ├── layout.tsx                # التخطيط الرئيسي
│   ├── globals.css               # الأنماط العامة
│   │
│   ├── student/                  # لوحة الطالب
│   │   ├── page.tsx              # الدوريشبورد
│   │   ├── courses/              # الدورات
│   │   ├── certificates/         # الشهادات
│   │   ├── profile/              # الملف الشخصي
│   │   ├── messages/             # الرسائل
│   │   └── settings/             # الإعدادات
│   │
│   ├── admin/                    # لوحة الإدارة
│   │   ├── page.tsx              # الدوريشبورد الإدارية
│   │   ├── login/                # تسجيل الدخول
│   │   └── loading.tsx
│   │
│   ├── courses/                  # صفحات الدورات العامة
│   │   ├── page.tsx              # قائمة الدورات
│   │   ├── aina/                 # دورة AINA
│   │   ├── ccino/                # دورة CCINO
│   │   └── ...
│   │
│   ├── blog/                     # المدونة
│   │   ├── page.tsx              # قائمة المقالات
│   │   └── [slug]/               # صفحة المقالة
│   │
│   ├── checkout/                 # الدفع
│   │   └── page.tsx              # صفحة الدفع
│   │
│   ├── community/                # المجتمع
│   │   ├── page.tsx              # المجتمع العام
│   │   └── internal/             # المجتمع الداخلي
│   │
│   ├── api/                      # API Routes (الخادم)
│   │   ├── auth/                 # المصادقة
│   │   ├── courses/              # الدورات
│   │   ├── notifications/        # الإشعارات
│   │   └── ...
│   │
│   └── robots.txt/
│
├── lib/                          # المنطق والخدمات
│   ├── auth-context.tsx          # سياق المصادقة
│   ├── language-context.tsx      # سياق اللغة
│   ├── learnworld-client.ts      # عميل LearnWorld API
│   ├── learnworld-types.ts       # الأنواع
│   ├── notification-service.ts   # الإشعارات
│   ├── hooks/                    # React Hooks
│   │   ├── use-auth.ts
│   │   ├── use-language.ts
│   │   └── use-student-data.ts
│   └── utils.ts                  # دوال مساعدة
│
├── components/                   # المكونات
│   ├── ui/                       # مكونات Shadcn/UI
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   ├── theme-provider.tsx        # مزود المظهر
│   └── ...
│
├── public/                       # الملفات الثابتة
│   ├── images/
│   ├── videos/
│   └── ...
│
├── docs/                         # التوثيق
│   ├── QUICK_START_AR.md         # البدء السريع
│   ├── PROJECT_STRUCTURE.md      # هذا الملف
│   ├── FINAL_PROJECT_REPORT.md   # التقرير النهائي
│   └── ...
│
├── scripts/                      # السكريبتات
│   └── validate-env.ts           # التحقق من المتغيرات
│
├── .env.example                  # نموذج المتغيرات
├── .env.local                    # متغيرات التطوير المحلي
├── package.json                  # الـ Dependencies
├── tsconfig.json                 # إعدادات TypeScript
├── next.config.mjs               # إعدادات Next.js
├── postcss.config.js             # إعدادات PostCSS
└── tailwind.config.ts            # إعدادات Tailwind CSS
\`\`\`

## الملفات المهمة والوصف

### للعملاء والمستخدمين

| المسار | الوصف |
|--------|--------|
| `/` | الصفحة الرئيسية |
| `/courses` | جميع الدورات المتاحة |
| `/blog` | المدونة والمقالات |
| `/checkout` | نموذج الدفع |
| `/community` | المجتمع العام |

### للطلاب المسجلين

| المسار | الوصف |
|--------|--------|
| `/student` | لوحة التحكم الشخصية |
| `/student/courses` | الدورات المشترك فيها |
| `/student/certificates` | الشهادات المحصول عليها |
| `/student/profile` | الملف الشخصي |
| `/student/messages` | الرسائل الخاصة |
| `/student/settings` | الإعدادات |

### للمسؤولين

| المسار | الوصف |
|--------|--------|
| `/admin` | لوحة التحكم الإدارية |
| `/admin/login` | تسجيل دخول المسؤول |

## الملفات المحلية المهمة

\`\`\`
.env.local                    # ملف المتغيرات (لا تشاركه)
.env.example                  # نموذج المتغيرات (شارك هذا)
package.json                  # قائمة الـ Dependencies
tsconfig.json                 # إعدادات TypeScript
\`\`\`

## كيفية إضافة صفحة جديدة

\`\`\`
1. أنشئ ملف في app/
   مثلاً: app/new-page/page.tsx

2. اكتب الكود:
   export default function NewPage() {
     return <h1>صفحة جديدة</h1>
   }

3. الوصول: http://localhost:3000/new-page
\`\`\`

## كيفية إضافة API endpoint

\`\`\`
1. أنشئ ملف في app/api/
   مثلاً: app/api/example/route.ts

2. اكتب الكود:
   export async function GET() {
     return Response.json({ message: 'Hello' })
   }

3. الوصول: http://localhost:3000/api/example
\`\`\`

## المزيد من المعلومات

- تفاصيل بناء الدورات: انظر `app/student/courses/[id]/`
- نظام الاختبارات: انظر `app/student/courses/[id]/quiz/`
- نظام الإشعارات: انظر `lib/notification-service.ts`
