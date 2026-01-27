# دليل البدء السريع - Innovologia على Localhost

## الخطوة 1: التحضير (2 دقيقة)

تأكد من أن لديك:
- Node.js 18 أو أحدث: https://nodejs.org
- Git
- محرر أكواد (VS Code موصى به)

## الخطوة 2: استنساخ وتثبيت (3 دقائق)

\`\`\`bash
# انسخ المشروع
git clone <رابط_المشروع>
cd innovologia

# ثبّت جميع الـ packages
npm install
\`\`\`

## الخطوة 3: إعداد المتغيرات (2 دقيقة)

\`\`\`bash
# انسخ ملف المتغيرات من النموذج
cp .env.example .env.local
\`\`\`

الآن افتح ملف `.env.local` الموجود في جذر المشروع وأضف بيانات LearnWorld:

\`\`\`bash
# LearnWorld (المطلوب الوحيد للتشغيل الأساسي)
LEARNWORLD_API_KEY=your_api_key_here
LEARNWORLD_SCHOOL_ID=your_school_id_here
NEXT_PUBLIC_LEARNWORLD_API_URL=https://api.learnworld.com
\`\`\`

## الخطوة 4: تشغيل المشروع (1 دقيقة)

\`\`\`bash
npm run dev
\`\`\`

سترى هذا الرسالة:
\`\`\`
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
\`\`\`

## الخطوة 5: فتح في المتصفح

افتح المتصفح واذهب إلى:
- الصفحة الرئيسية: http://localhost:3000
- لوحة الطالب: http://localhost:3000/student
- لوحة الإدارة: http://localhost:3000/admin

## إضافة الخدمات الإضافية (اختياري)

إذا أردت تفعيل الإشعارات:

### البريد الإلكتروني (Gmail):
\`\`\`bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_FROM=noreply@innovologia.com
\`\`\`

### رسائل WhatsApp:
\`\`\`bash
WHATSAPP_API_TOKEN=your_token
WHATSAPP_API_URL=https://graph.instagram.com/v18.0
\`\`\`

### رسائل SMS (Twilio):
\`\`\`bash
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+1234567890
\`\`\`

## الأوامر المتاحة

\`\`\`bash
# تطوير
npm run dev

# بناء للإنتاج
npm run build

# تشغيل البناء
npm start

# التحقق من المتغيرات
npm run validate-env

# الـ Lint
npm run lint
\`\`\`

## أين ملف المتغيرات؟

ملف `.env.local` موجود في جذر المشروع:
\`\`\`
innovologia/
├── .env.example      (النموذج - لا تعدله)
├── .env.local        (ملفك الشخصي - اختياري)
├── app/
├── lib/
├── docs/
└── ...
\`\`\`

اسم الملف **يجب أن يكون `.env.local`** (بالنقطة في البداية)

## استكشاف الأخطاء

### "Port 3000 مستخدم"
\`\`\`bash
npm run dev -- -p 3001
\`\`\`

### "لم يتم العثور على Module"
\`\`\`bash
rm -rf node_modules
npm install
\`\`\`

### "المتغيرات لم تُحمّل"
- أعد تشغيل الخادم (Ctrl+C ثم npm run dev)
- تأكد من اسم الملف: `.env.local` (ليس `.env`)

### "خطأ في الاتصال بـ LearnWorld"
- تحقق من API Key صحيح
- تحقق من School ID صحيح
- اختبر الاتصال من Postman

## ملفات مهمة

| الملف | الموقع | الوصف |
|------|--------|--------|
| متغيرات | `.env.local` | بيانات الخدمات |
| الرئيسية | `app/page.tsx` | الصفحة الرئيسية |
| الطالب | `app/student/page.tsx` | لوحة الطالب |
| الإدارة | `app/admin/page.tsx` | لوحة الإدارة |

## تم! المشروع جاهز

بعد هذه الخطوات الخمس، المشروع يعمل بالكامل على:
**http://localhost:3000**

استمتع بالتطوير!
