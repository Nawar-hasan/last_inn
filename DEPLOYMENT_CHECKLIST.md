# دليل نشر منصة Innovologia على الويب
# Innovologia Platform Deployment Guide

## المهام الحرجة المتبقية | Critical Remaining Tasks

### 1. إعداد متغيرات البيئة (CRITICAL - يجب إنجازها أولاً)

#### الخطوة الأولى: نسخ ملف البيئة
```bash
cp .env.local.example .env.local
```

#### الخطوة الثانية: تعبئة المتغيرات الأساسية (Required)

##### A. LearnWorlds API Configuration
```env
NEXT_PUBLIC_LEARNWORLD_API_URL=https://api.learnworlds.com/v2
LEARNWORLD_API_KEY=your_actual_api_key_here          # من لوحة التحكم LearnWorlds
LEARNWORLD_SCHOOL_ID=your_school_id_here              # معرف المدرسة
LEARNWORLD_ADMIN_TOKEN=your_admin_token_here          # Admin API Token
LEARNWORLD_PUBLIC_API_KEY=your_public_api_key_here    # Public API Key
LEARNWORLD_CLIENT_ID=your_client_id_here              # OAuth Client ID
LEARNWORLD_CLIENT_SECRET=your_client_secret_here      # OAuth Client Secret
LEARNWORLD_SCHOOL_DOMAIN=innovologia.learnworlds.com  # رابط مدرستك
LEARNWORLD_WEBHOOK_SECRET=your_webhook_secret_here    # للتحقق من Webhooks
```

كيف تحصل على هذه المفاتيح:
1. سجل دخول إلى لوحة تحكم LearnWorlds
2. اذهب إلى Settings > API & Integrations
3. أنشئ API Key جديد وانسخه
4. احفظ School ID و Domain من Settings

##### B. Session & Security Configuration
```env
SESSION_SECRET=your_super_secret_32_character_minimum_key_here
JWT_SECRET=your_jwt_secret_min_32_characters_here
```

توليد مفاتيح آمنة:
```bash
# في Terminal:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

##### C. Site Configuration
```env
NEXT_PUBLIC_SITE_URL=https://innovologia.com  # رابط موقعك (للتطوير: http://localhost:3000)
NEXT_PUBLIC_ENVIRONMENT=production
```

---

### 2. اختبار التكامل مع LearnWorlds API (CRITICAL)

قبل النشر، يجب اختبار جميع نقاط النهاية:

#### A. اختبار الاتصال الأساسي
```bash
# 1. شغل السيرفر المحلي
npm run dev

# 2. في متصفح آخر أو Postman، اختبر:
GET http://localhost:3000/api/courses
```

يجب أن تحصل على قائمة الدورات من LearnWorlds

#### B. اختبار المصادقة
```bash
# اختبر تسجيل الدخول
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "testpassword"
}
```

#### C. اختبار الأخطاء الشائعة
- 401 Unauthorized: مفتاح API خاطئ
- 404 Not Found: School ID أو Domain خاطئ
- 403 Forbidden: صلاحيات API محدودة
- CORS Errors: تحقق من إعدادات LearnWorlds CORS

---

### 3. إصلاح مشاكل الأمان المتبقية (IMPORTANT)

#### A. إضافة CSRF Protection
الكود الحالي لا يحتوي على CSRF protection. سأضيفه الآن.

#### B. تحديث Rate Limiting
تحقق من أن Rate Limiter يعمل بشكل صحيح في `middleware.ts`

#### C. تأمين Cookies
تحقق من أن جميع cookies تستخدم:
- `httpOnly: true`
- `secure: true` (في الإنتاج)
- `sameSite: 'lax'`

---

### 4. اختبارات Performance (RECOMMENDED)

#### A. تحسين الصور
```bash
# تأكد من استخدام next/image في جميع الصور
# افحص باستخدام:
npm run build
npm run start
```

#### B. Code Splitting
المنصة تستخدم Next.js App Router الذي يقوم بـ code splitting تلقائياً.

#### C. Caching Strategy
أضف caching headers في API routes:
```typescript
// في كل API route:
export const revalidate = 60 // 60 seconds
```

---

## كيفية رفع المنصة على الويب | Deployment Steps

### الطريقة 1: النشر على Vercel (الأسهل والأسرع - موصى به)

#### الخطوة 1: تجهيز المشروع
```bash
# 1. تأكد من أن كل شيء يعمل محلياً
npm run build
npm run start

# 2. أنشئ Git repository
git init
git add .
git commit -m "Initial commit - Innovologia Platform"

# 3. ارفع على GitHub
# أنشئ repository جديد على github.com
git remote add origin https://github.com/YOUR_USERNAME/innovologia.git
git branch -M main
git push -u origin main
```

#### الخطوة 2: النشر على Vercel
```bash
# طريقة 1: من خلال الموقع (الأسهل)
1. اذهب إلى https://vercel.com
2. سجل دخول بحساب GitHub
3. اضغط "Import Project"
4. اختر repository "innovologia"
5. أضف Environment Variables من .env.local
6. اضغط Deploy

# طريقة 2: من خلال CLI
npm i -g vercel
vercel login
vercel
# اتبع التعليمات
```

#### الخطوة 3: إضافة Environment Variables في Vercel
1. اذهب إلى Project Settings
2. اختر Environment Variables
3. أضف جميع المتغيرات من `.env.local`
4. تأكد من تحديد Production, Preview, Development

#### الخطوة 4: إعداد Domain
```bash
# في Vercel Dashboard:
1. اذهب إلى Domains
2. أضف domain خاص (innovologia.com)
3. اتبع تعليمات DNS
4. انتظر 24-48 ساعة للتفعيل
```

---

### الطريقة 2: النشر على VPS خاص (Ubuntu/Linux)

#### متطلبات السيرفر
- Ubuntu 20.04 أو أحدث
- 2GB RAM minimum (4GB موصى به)
- Node.js 18+
- Nginx
- SSL Certificate (Let's Encrypt)

#### خطوات النشر

##### 1. تجهيز السيرفر
```bash
# اتصل بالسيرفر
ssh root@your-server-ip

# حدّث النظام
apt update && apt upgrade -y

# ثبت Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# ثبت PM2 (لإدارة التطبيق)
npm install -g pm2

# ثبت Nginx
apt install -y nginx

# ثبت Certbot (للـ SSL)
apt install -y certbot python3-certbot-nginx
```

##### 2. رفع الملفات
```bash
# على جهازك المحلي:
npm run build

# ارفع الملفات (استخدم SCP أو Git)
# طريقة 1: Git
ssh root@your-server-ip
cd /var/www
git clone https://github.com/YOUR_USERNAME/innovologia.git
cd innovologia
npm install --production
cp .env.local.example .env.local
nano .env.local  # عدل المتغيرات

# طريقة 2: SCP
scp -r ./* root@your-server-ip:/var/www/innovologia/
```

##### 3. إعداد PM2
```bash
# على السيرفر:
cd /var/www/innovologia
pm2 start npm --name "innovologia" -- start
pm2 save
pm2 startup
```

##### 4. إعداد Nginx
```bash
nano /etc/nginx/sites-available/innovologia
```

أضف هذا الكود:
```nginx
server {
    listen 80;
    server_name innovologia.com www.innovologia.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# فعّل الموقع
ln -s /etc/nginx/sites-available/innovologia /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

##### 5. إعداد SSL
```bash
certbot --nginx -d innovologia.com -d www.innovologia.com
```

---

### الطريقة 3: النشر على Netlify

```bash
# 1. ثبت Netlify CLI
npm install -g netlify-cli

# 2. سجل دخول
netlify login

# 3. انشر
netlify deploy --prod

# 4. أضف Environment Variables من Dashboard
```

---

## المهام بعد النشر | Post-Deployment Tasks

### 1. إعداد Webhooks في LearnWorlds
```
1. اذهب إلى LearnWorlds Dashboard
2. Settings > Webhooks
3. أضف webhook URL: https://innovologia.com/api/webhooks/learnworlds
4. اختر الأحداث: 
   - User Created
   - User Enrolled
   - Course Completed
   - Payment Received
5. احفظ الـ Webhook Secret في .env
```

### 2. إعداد Google Analytics
```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

### 3. إعداد البريد الإلكتروني (SMTP)
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_FROM=noreply@innovologia.com
```

لـ Gmail App Password:
1. اذهب إلى Google Account
2. Security > 2-Step Verification
3. App Passwords
4. أنشئ password جديد

### 4. اختبار شامل بعد النشر
```bash
# اختبر جميع الوظائف:
✓ تسجيل الدخول
✓ التسجيل
✓ عرض الدورات
✓ التسجيل في دورة
✓ تتبع التقدم
✓ تحميل الشهادات
✓ الدفع
✓ المجتمع (Posts, Comments, Likes)
✓ Webhooks
```

### 5. المراقبة والصيانة

#### A. إعداد Monitoring
```bash
# Vercel Analytics (مجاني)
- يتفعل تلقائياً على Vercel

# أو Sentry (لتتبع الأخطاء)
SENTRY_DSN=your_sentry_dsn_here
```

#### B. النسخ الاحتياطية
```bash
# على VPS، أضف cron job:
0 2 * * * /usr/bin/backup-innovologia.sh
```

#### C. التحديثات
```bash
# على VPS:
cd /var/www/innovologia
git pull
npm install
npm run build
pm2 restart innovologia

# على Vercel:
# يتحدث تلقائياً مع كل push على GitHub
```

---

## Checklist النهائي قبل الإطلاق | Final Pre-Launch Checklist

### أمان (Security)
- [ ] جميع API Keys في environment variables
- [ ] SESSION_SECRET قوي (32+ حرف)
- [ ] HTTPS مفعّل (SSL)
- [ ] Rate limiting يعمل
- [ ] CORS محدود للـ domains المسموحة
- [ ] Webhooks محمية بـ secret

### Performance
- [ ] Images محسّنة (next/image)
- [ ] Code splitting فعّال
- [ ] Caching headers مضبوطة
- [ ] Build بدون أخطاء
- [ ] Lighthouse Score > 90

### Functionality
- [ ] جميع API endpoints تعمل
- [ ] LearnWorlds integration يعمل
- [ ] Authentication يعمل
- [ ] Payments تعمل
- [ ] Webhooks تستجيب
- [ ] Email notifications تعمل
- [ ] Mobile responsive

### SEO & Analytics
- [ ] Meta tags محدّثة
- [ ] Sitemap موجود
- [ ] robots.txt صحيح
- [ ] Google Analytics مفعّل
- [ ] Open Graph tags للـ social media

### Legal & Compliance
- [ ] Privacy Policy موجودة
- [ ] Terms of Service موجودة
- [ ] Cookie Consent إذا لزم
- [ ] GDPR compliance (إذا في أوروبا)

---

## الدعم والمساعدة | Support

إذا واجهت مشاكل:

### مشاكل شائعة وحلولها

#### 1. "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```

#### 2. "API Key Invalid"
- تحقق من صلاحية المفتاح في LearnWorlds
- تأكد من نسخ المفتاح كاملاً بدون مسافات

#### 3. "CORS Error"
- أضف domain في LearnWorlds CORS settings
- تحقق من NEXT_PUBLIC_SITE_URL

#### 4. "Session Expired"
- تحقق من SESSION_SECRET
- امسح cookies وجرب مرة أخرى

#### 5. "Build Failed"
```bash
# اعرض الأخطاء:
npm run build 2>&1 | tee build-errors.log
```

---

## التكاليف المتوقعة | Expected Costs

### Vercel (موصى به)
- Free Tier: مجاني للمشاريع الصغيرة
- Pro: $20/شهر (لمشاريع إنتاجية)
- Enterprise: حسب الطلب

### VPS
- DigitalOcean: $12-24/شهر (2-4GB RAM)
- AWS EC2: $10-50/شهر
- Linode: $10-20/شهر

### Domain
- .com: $10-15/سنة
- .sa: $50-100/سنة

### خدمات إضافية
- Email (SendGrid): $15/شهر
- Monitoring (Sentry): مجاني/Pro $26/شهر
- CDN (Cloudflare): مجاني/Pro $20/شهر

---

## الخلاصة | Summary

المنصة جاهزة تقريباً للنشر. المهام الحرجة المتبقية:

1. تعبئة Environment Variables ✅ (أهم شيء)
2. اختبار LearnWorlds API ⚠️ (حرج)
3. النشر على Vercel ✅ (سهل وسريع)
4. إعداد Webhooks ⚠️ (مهم)
5. اختبار شامل بعد النشر ✅

الوقت المتوقع: 2-4 ساعات للنشر الكامل

---

للأسئلة: راجع TROUBLESHOOTING.md أو افتح Issue على GitHub
