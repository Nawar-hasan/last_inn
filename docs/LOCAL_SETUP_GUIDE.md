# دليل إعداد التطوير المحلي - Innovologia

## المتطلبات الأساسية

قبل البدء، تأكد من أن لديك:
- Node.js 18+ ([تحميل](https://nodejs.org))
- npm أو yarn
- حساب GitHub (للكود)
- متصفح حديث

## الخطوات السريعة

### 1. استنساخ المشروع

\`\`\`bash
git clone <repository_url>
cd innovologia
\`\`\`

### 2. تثبيت الـ Dependencies

\`\`\`bash
npm install
# أو
yarn install
\`\`\`

### 3. إعداد المتغيرات البيئية

#### الخطوة أ: استنسخ الملف

\`\`\`bash
cp .env.example .env.local
\`\`\`

#### الخطوة ب: أضف بيانات الخدمات

### 4. تشغيل الخادم المحلي

\`\`\`bash
npm run dev
# أو
yarn dev
\`\`\`

سيكون الموقع متاح على: `http://localhost:3000`

---

## إعداد الخدمات الخارجية

### LearnWorld API

1. اذهب إلى [لوحة تحكم LearnWorld](https://learnworld.com)
2. انتقل إلى Settings → API
3. انسخ API Key والـ School ID
4. أضفها في `.env.local`:

\`\`\`bash
LEARNWORLD_API_KEY=your_api_key_here
NEXT_PUBLIC_LEARNWORLD_API_URL=https://api.learnworld.com
\`\`\`

### البريد الإلكتروني (Gmail)

#### استخدام Gmail:

1. اذهب إلى [حسابك على Google](https://accounts.google.com)
2. فعّل المصادقة الثنائية
3. اذهب إلى [App Passwords](https://myaccount.google.com/apppasswords)
4. اختر "Mail" و "Windows Computer"
5. انسخ كلمة المرور المُنشأة
6. أضفها في `.env.local`:

\`\`\`bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password_here
SMTP_FROM=noreply@innovologia.com
\`\`\`

### WhatsApp API (Meta)

1. اذهب إلى [Meta Business Platform](https://business.facebook.com)
2. أنشئ تطبيق جديد أو اختر موجود
3. اختر "WhatsApp Business"
4. احصل على Access Token من الإعدادات
5. أضفها في `.env.local`:

\`\`\`bash
WHATSAPP_API_TOKEN=your_token_here
WHATSAPP_API_URL=https://graph.instagram.com/v18.0
\`\`\`

### SMS (Twilio)

1. اذهب إلى [Twilio Console](https://console.twilio.com)
2. انسخ Account SID و Auth Token
3. احصل على رقم هاتف Twilio
4. أضفها في `.env.local`:

\`\`\`bash
TWILIO_ACCOUNT_SID=your_sid_here
TWILIO_AUTH_TOKEN=your_token_here
TWILIO_PHONE_NUMBER=+1234567890
\`\`\`

### Stripe (الدفع)

1. اذهب إلى [Stripe Dashboard](https://dashboard.stripe.com)
2. انتقل إلى Developers → API Keys
3. انسخ Publishable Key و Secret Key (Test Mode)
4. أضفها في `.env.local`:

\`\`\`bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
\`\`\`

### Google Analytics

1. اذهب إلى [Google Analytics](https://analytics.google.com)
2. أنشئ Property جديدة
3. انسخ Measurement ID (GA-ID)
4. أضفها في `.env.local`:

\`\`\`bash
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
\`\`\`

---

## التحقق من الإعداد

تشغيل اختبارات التحقق:

\`\`\`bash
npm run check-env
\`\`\`

هذا سيتحقق من:
- جميع المتغيرات المطلوبة موجودة
- جودة الاتصالات بالخدمات الخارجية
- سلامة المفاتيح والـ Tokens

---

## تشغيل الخادم

### Development Mode

\`\`\`bash
npm run dev
\`\`\`

الموقع متاح على `http://localhost:3000`

### Production Build

\`\`\`bash
npm run build
npm start
\`\`\`

### Debugging

تفعيل Debug Mode في `.env.local`:

\`\`\`bash
NEXT_PUBLIC_DEBUG_MODE=true
LOG_LEVEL=debug
\`\`\`

ثم افتح Developer Tools في المتصفح (F12)

---

## الملفات المهمة

| الملف | الوصف |
|------|--------|
| `.env.local` | متغيراتك الشخصية (لا تشاركها) |
| `.env.example` | قالب المتغيرات المتوفرة |
| `next.config.mjs` | إعدادات Next.js |
| `tsconfig.json` | إعدادات TypeScript |

---

## مشاكل شائعة وحلولها

### "Port 3000 already in use"

\`\`\`bash
# استخدم port آخر
npm run dev -- -p 3001
\`\`\`

### "Cannot find module"

\`\`\`bash
# أعد تثبيت الـ Dependencies
rm -rf node_modules package-lock.json
npm install
\`\`\`

### "Environment variables not loading"

- تأكد من أن الملف اسمه `.env.local` (ليس `.env`)
- أعد تشغيل الخادم بعد تعديل الملف

### "API Connection Error"

- تحقق من المفاتيح والـ Tokens
- اختبر الاتصال باستخدام Postman
- تأكد من أن الـ URLs صحيحة

---

## للمزيد من المساعدة

إذا واجهت مشاكل:

1. تحقق من الـ Console (F12)
2. اقرأ رسائل الأخطاء بعناية
3. ابحث عن الخطأ في الـ Documentation
4. تواصل مع الفريق التقني

---

## الخطوات التالية

بعد الإعداد الناجح:

1. اختبر صفحة العميل: `http://localhost:3000`
2. اختبر لوحة الإدارة: `http://localhost:3000/admin`
3. اختبر بوابة الطالب: `http://localhost:3000/student`
4. اختبر عملية الدفع: `http://localhost:3000/checkout`

استمتع بالتطوير! 🚀
