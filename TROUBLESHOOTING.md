# دليل حل المشاكل | Troubleshooting Guide

## مشاكل شائعة وحلولها

### 1. مشاكل LearnWorlds API

#### المشكلة: 401 Unauthorized
```
Error: Request failed with status code 401
```

الحل:
```bash
# 1. تحقق من API Key
echo $LEARNWORLD_API_KEY

# 2. تأكد من صلاحية المفتاح في LearnWorlds Dashboard
# 3. جرب إنشاء مفتاح جديد

# 4. اختبر المفتاح مباشرة:
curl -H "Authorization: Bearer YOUR_API_KEY" \
     https://api.learnworlds.com/v2/courses
```

#### المشكلة: CORS Error
```
Access to fetch at 'https://api.learnworlds.com' has been blocked by CORS policy
```

الحل:
- أضف domain في LearnWorlds CORS settings
- استخدم API routes بدلاً من client-side calls
- جميع LearnWorlds API calls يجب أن تكون من server-side

### 2. مشاكل المصادقة

#### المشكلة: Session يختفي بعد التحديث
الحل: تحقق من SESSION_SECRET في `.env.local`

#### المشكلة: Login لا يعمل
```bash
# 1. افتح Developer Console
# 2. تحقق من Network tab
# 3. ابحث عن الخطأ في Response

# شائع: "User not found" = المستخدم غير موجود في LearnWorlds
# الحل: أنشئ المستخدم أولاً عبر LearnWorlds
```

### 3. مشاكل البناء

#### المشكلة: Build fails
```bash
# نظف الـ cache:
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

#### المشكلة: TypeScript errors
```bash
# تحديث types:
npm install --save-dev @types/node @types/react @types/react-dom
```

### 4. مشاكل Deployment على Vercel

#### المشكلة: Environment Variables لا تعمل
- تأكد من إضافتها في Vercel Dashboard
- تحديد Environment (Production, Preview, Development)
- إعادة Deploy بعد إضافة variables

#### المشكلة: Functions Timeout
```
Error: Function execution timed out
```

الحل:
- زيادة timeout في vercel.json
- تحسين API calls (caching, parallel requests)

### 5. مشاكل Performance

#### المشكلة: موقع بطيء
```bash
# 1. تحقق من Lighthouse Score
npm run build
npm run start
# افتح Chrome DevTools > Lighthouse

# 2. حلول شائعة:
- استخدم next/image لجميع الصور
- أضف caching headers
- استخدم ISR (Incremental Static Regeneration)
```

### 6. مشاكل Email Notifications

#### المشكلة: Emails لا ترسل
```bash
# اختبر SMTP:
node scripts/test-email.js

# Gmail App Password:
1. Google Account > Security
2. 2-Step Verification
3. App Passwords > Create new
```

---

## أدوات Debug

### 1. تفعيل Debug Mode
```env
NEXT_PUBLIC_DEBUG_MODE=true
LOG_LEVEL=debug
```

### 2. اختبار API Routes
```bash
# استخدم curl:
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'

# أو Postman / Insomnia
```

### 3. مراقبة Logs
```bash
# على Vercel:
vercel logs

# على VPS:
pm2 logs innovologia
```

---

## جهات الاتصال

للمساعدة الفورية:
- LearnWorlds Support: support@learnworlds.com
- Vercel Support: vercel.com/help
- Community: GitHub Issues
