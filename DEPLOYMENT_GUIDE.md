# 🚀 دليل نشر المنصة على Production

## المتطلبات الأساسية

قبل البدء، تأكد من أن لديك:
- ✅ حساب Vercel (مجاني)
- ✅ حساب GitHub
- ✅ حساب LearnWorlds (innovologia.learnworlds.com)
- ✅ معلومات API من LearnWorlds (موجودة بالفعل)

---

## 📋 خطوات النشر الكاملة

### الخطوة 1: رفع الكود على GitHub

**1.1 إنشاء Repository جديد:**
```bash
# في terminal المشروع
git init
git add .
git commit -m "Initial commit - LearnWorlds Integration"
```

**1.2 رفع على GitHub:**
- اذهب إلى https://github.com/new
- أنشئ repository جديد (مثلاً: `innovologia-platform`)
- لا تضف README أو .gitignore (موجودين بالفعل)
- انسخ الأوامر وشغلها:

```bash
git remote add origin https://github.com/YOUR_USERNAME/innovologia-platform.git
git branch -M main
git push -u origin main
```

---

### الخطوة 2: النشر على Vercel

**2.1 الدخول إلى Vercel:**
- اذهب إلى https://vercel.com
- سجل دخول أو أنشئ حساب جديد
- اربط حساب GitHub

**2.2 استيراد المشروع:**
- اضغط "Add New" → "Project"
- اختر Repository الذي أنشأته
- اضغط "Import"

**2.3 إعداد المشروع:**
- **Framework Preset**: Next.js (سيختار تلقائياً)
- **Root Directory**: ./
- **Build Command**: `npm run build` (افتراضي)
- **Output Directory**: .next (افتراضي)

**2.4 إضافة Environment Variables:**

اضغط على "Environment Variables" وأضف التالي:

```plaintext
# LearnWorlds API Configuration
LEARNWORLDS_API_URL=https://api.learnworlds.com
LEARNWORLDS_SCHOOL_DOMAIN=innovologia.learnworlds.com
LEARNWORLDS_CLIENT_ID=69463d4a0f54e8bf3e0747a5
LEARNWORLDS_CLIENT_SECRET=Wy1rhLAAjfodbbEzPcLuKHhHb3GZX8BS44TYRH0Kh6WfWdn7sS
LEARNWORLDS_ACCESS_TOKEN=I9KZFaZKmtnMf3rYf4VsaaS0a29VOsySY3NtFQyI
LEARNWORLDS_WEBHOOK_SECRET=2047aa629a9e605817f9f9a7b491c286bf6ce885f30bad

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NEXT_PUBLIC_LEARNWORLDS_SCHOOL_URL=https://innovologia.learnworlds.com

# Session Secret (اختر رمز عشوائي قوي)
SESSION_SECRET=your-super-secret-session-key-change-this-in-production
