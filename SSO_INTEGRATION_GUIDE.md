# دليل تكامل SSO مع LearnWorlds

## نظرة عامة

تم تنفيذ نظام SSO (Single Sign-On) الكامل للربط مع LearnWorlds. جميع استدعاءات API تتم من السيرفر فقط لضمان الأمان.

## البنية

### 1. SSO Endpoint

**الموقع:** `/app/api/sso/route.ts`

**الاستخدام:**
```typescript
// من Frontend
const response = await fetch('/api/sso', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    redirectUrl: 'https://yourschool.learnworlds.com/dashboard' // اختياري
  })
})

const data = await response.json()

if (data.url) {
  // تحويل المستخدم إلى LearnWorlds
  window.location.href = data.url
}
```

**ما يحدث:**
1. الـ Frontend يرسل البريد الإلكتروني فقط
2. السيرفر يستدعي LearnWorlds SSO API
3. LearnWorlds يرجع رابط magic login
4. السيرفر يرجع الرابط للـ Frontend
5. الـ Frontend يحول المستخدم إلى الرابط

### 2. Test Endpoints

#### إنشاء مستخدم
```bash
POST /api/test/create-user
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "SecurePass123!",
  "firstName": "أحمد",
  "lastName": "محمد"
}
```

#### تسجيل في دورة
```bash
POST /api/test/enroll
Content-Type: application/json

{
  "user_id": "user_abc123",
  "course_id": "course_xyz789"
}
```

#### البحث عن مستخدمين
```bash
GET /api/test/users?email=user@example.com
```

### 3. Webhook Handler

**الموقع:** `/app/api/webhooks/learnworlds/route.ts`

**إعداد Webhook في LearnWorlds:**
1. اذهب إلى Settings → API & Webhooks
2. أضف Webhook URL: `https://yourdomain.com/api/webhooks/learnworlds`
3. اختر الأحداث:
   - user.created
   - user.enrolled
   - course.completed
   - certificate.issued
   - payment.succeeded
   - subscription.updated
4. احصل على Webhook Secret وأضفه إلى `.env.local`

**الأحداث المدعومة:**
- `user.created` - مستخدم جديد
- `user.enrolled` - تسجيل في دورة
- `course.completed` - إنهاء دورة
- `certificate.issued` - إصدار شهادة
- `payment.succeeded` - دفع ناجح
- `subscription.updated` - تحديث اشتراك

## الأمان

### 1. لا توجد API Keys في Frontend

جميع المتغيرات تستخدم بدون `NEXT_PUBLIC_`:
- ✅ `LEARNWORLD_API_KEY` - server only
- ✅ `LEARNWORLD_SCHOOL_ID` - server only
- ✅ `LEARNWORLD_WEBHOOK_SECRET` - server only
- ❌ `NEXT_PUBLIC_LEARNWORLD_API_KEY` - NEVER use this

### 2. التحقق من Webhook Signatures

جميع webhooks تتحقق من الـ signature باستخدام HMAC-SHA256:

```typescript
const expectedSignature = crypto
  .createHmac('sha256', webhookSecret)
  .update(rawBody)
  .digest('hex')
```

### 3. معالجة الأخطاء

جميع endpoints تعالج الأخطاء بشكل آمن:
- تحويل HTML إلى نص عادي
- تسجيل الأخطاء في console
- إرجاع رسائل واضحة للـ Frontend
- عدم كشف معلومات حساسة

## اختبار التكامل

### خطوة 1: إعداد Environment Variables

انسخ `.env.example` إلى `.env.local`:
```bash
cp .env.example .env.local
```

أضف قيمك الحقيقية من LearnWorlds Dashboard.

### خطوة 2: اختبار SSO

```bash
# شغّل المشروع
npm run dev

# في متصفح آخر أو Postman
curl -X POST http://localhost:3000/api/sso \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

### خطوة 3: اختبار Webhooks محلياً

استخدم ngrok لاختبار webhooks:

```bash
# تثبيت ngrok
npm install -g ngrok

# تشغيل ngrok
ngrok http 3000

# استخدم URL الذي يظهر في LearnWorlds Webhooks
https://abc123.ngrok.io/api/webhooks/learnworlds
```

### خطوة 4: اختبار إنشاء مستخدم وتسجيل

```bash
# إنشاء مستخدم
curl -X POST http://localhost:3000/api/test/create-user \
  -H "Content-Type: application/json" \
  -d '{
    "email":"newuser@example.com",
    "password":"Test123!",
    "firstName":"أحمد",
    "lastName":"محمد"
  }'

# سيرجع user_id، استخدمه للتسجيل
curl -X POST http://localhost:3000/api/test/enroll \
  -H "Content-Type: application/json" \
  -d '{
    "user_id":"USER_ID_HERE",
    "course_id":"COURSE_ID_HERE"
  }'
```

## التبديل بين Mock و Production

المشروع يتبدل تلقائياً:
- **Mock Mode:** عندما `LEARNWORLD_API_KEY` غير موجود أو فارغ
- **Production Mode:** عندما `LEARNWORLD_API_KEY` موجود

لا حاجة لـ `USE_MOCK_DATA` - كل شيء تلقائي!

## الأخطاء الشائعة وحلولها

### خطأ: "Unexpected token '<'"

**السبب:** LearnWorlds يرجع HTML بدلاً من JSON

**الحل:** تم إصلاحه! جميع endpoints تتعامل مع هذا:
```typescript
const text = await res.text()
if (!res.ok) {
  // تنظيف HTML
  errorMessage = text.replace(/<[^>]*>/g, '')
}
```

### خطأ: "API Key not found"

**السبب:** المتغيرات غير محددة

**الحل:**
1. تأكد من وجود `.env.local`
2. تأكد من عدم وجود مسافات في القيم
3. أعد تشغيل السيرفر بعد تغيير env

### خطأ: "Invalid signature" في Webhook

**السبب:** Webhook Secret غير صحيح

**الحل:**
1. احصل على Secret الصحيح من LearnWorlds
2. تأكد من نسخه بدون مسافات إضافية
3. أعد تشغيل السيرفر

## الخلاصة

تم تطبيق نظام SSO كامل وآمن مع:
- ✅ جميع API calls من السيرفر
- ✅ لا توجد secrets في Frontend
- ✅ معالجة أخطاء شاملة
- ✅ تحويل HTML إلى JSON
- ✅ Webhook handler آمن
- ✅ Test endpoints للتطوير
- ✅ تبديل تلقائي بين Mock و Production

**جاهز للإنتاج!** 🚀
```

```typescript file="" isHidden
