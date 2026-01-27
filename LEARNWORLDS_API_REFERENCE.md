# LearnWorlds API - مرجع سريع للمطورين
## Innovologia Platform Integration

**تم التحديث:** 4 يناير 2026  
**API Version:** v2

---

## الأساسيات

### Base URLs
```
Admin API: https://innovologia.learnworlds.com/admin/api/v2
Public API: https://api.learnworlds.com/v2
```

### المصادقة
```http
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

---

## Users API

### إنشاء مستخدم جديد
```http
POST /users
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "username",
  "fields": {
    "first_name": "أحمد",
    "last_name": "محمد"
  }
}
```

### البحث عن مستخدم
```http
GET /users?email=user@example.com
```

### جلب مستخدم محدد
```http
GET /users/{userId}
```

### تحديث مستخدم
```http
PUT /users/{userId}
Content-Type: application/json

{
  "fields": {
    "first_name": "Updated Name"
  }
}
```

---

## Courses API

### جلب جميع الدورات
```http
GET /courses
```

**Response:**
```json
{
  "data": [
    {
      "id": "course_id",
      "title": "اسم الدورة",
      "description": "وصف الدورة",
      "price": 99.99,
      "image": "https://...",
      "identifiers": {
        "slug": "course-slug"
      }
    }
  ]
}
```

### جلب دورة محددة
```http
GET /courses/{courseId}
```

### جلب محتوى الدورة
```http
GET /courses/{courseId}/contents
```

**Response:**
```json
{
  "sections": [
    {
      "id": "section_id",
      "title": "القسم الأول",
      "units": [
        {
          "id": "unit_id",
          "title": "الدرس الأول",
          "type": "video"
        }
      ]
    }
  ]
}
```

---

## Enrollments API

### تسجيل مستخدم في دورة
```http
POST /users/{userId}/enrollments
Content-Type: application/json

{
  "product_id": "course_id",
  "product_type": "course",
  "price": 0
}
```

### جلب تسجيلات المستخدم
```http
GET /users/{userId}/enrollments
```

**Response:**
```json
{
  "data": {
    "items": [
      {
        "id": "enrollment_id",
        "product_id": "course_id",
        "status": "active",
        "enrolled_at": "2026-01-04T10:00:00Z"
      }
    ]
  }
}
```

---

## Progress API

### جلب تقدم المستخدم
```http
GET /users/{userId}/courses/{courseId}/progress
```

**Response:**
```json
{
  "progress_percent": 75,
  "completed_units": 10,
  "total_units": 15,
  "last_activity": "2026-01-04T10:00:00Z"
}
```

### تحديث التقدم
```http
POST /users/{userId}/courses/{courseId}/progress
Content-Type: application/json

{
  "status": "completed",
  "completed_at": "2026-01-04T12:00:00Z"
}
```

---

## Certificates API

### جلب شهادات المستخدم
```http
GET /users/{userId}/certificates
```

**Response:**
```json
{
  "data": [
    {
      "id": "cert_id",
      "course_id": "course_id",
      "issued_at": "2026-01-04T10:00:00Z",
      "certificate_url": "https://..."
    }
  ]
}
```

### طلب إصدار شهادة
```http
POST /users/{userId}/certificates
Content-Type: application/json

{
  "course_id": "course_id"
}
```

---

## SSO API

### إنشاء SSO Link
```http
POST /sso
Content-Type: application/json

{
  "email": "user@example.com",
  "redirect_url": "https://yoursite.com/dashboard",
  "lifetime": 3600
}
```

**Response:**
```json
{
  "url": "https://innovologia.learnworlds.com/sso?token=..."
}
```

---

## Webhooks

### التحقق من التوقيع
```javascript
const crypto = require('crypto');

function verifySignature(payload, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  const expectedSignature = hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature),
    Buffer.from(signature)
  );
}
```

### الأحداث المتاحة

#### User Events
- `user.registered` - مستخدم جديد
- `user.updated` - تحديث بيانات
- `user.tags.added` - إضافة وسم
- `user.tags.removed` - حذف وسم

#### Enrollment Events
- `course.enrollment.free` - تسجيل مجاني
- `course.enrollment.unenrolled` - إلغاء تسجيل
- `course.completed` - إتمام دورة

#### Payment Events
- `product.purchased` - شراء منتج
- `payment.created` - إنشاء دفعة
- `payment.succeeded` - دفعة ناجحة
- `payment.failed` - فشل دفعة
- `payment.refunded` - استرداد

#### Subscription Events
- `subscription.paid` - دفع اشتراك
- `subscription.canceled` - إلغاء اشتراك
- `subscription.trial.started` - بدء تجريبية
- `subscription.trial.ending` - انتهاء تجريبية

#### Certificate Events
- `certificate.awarded` - منح شهادة

---

## أمثلة الاستخدام

### مثال 1: تسجيل مستخدم جديد
```javascript
const response = await fetch(
  'https://innovologia.learnworlds.com/admin/api/v2/users',
  {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_TOKEN',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: 'user@example.com',
      username: 'newuser',
      fields: {
        first_name: 'أحمد',
        last_name: 'محمد'
      }
    })
  }
);

const user = await response.json();
console.log('User created:', user.data.id);
```

### مثال 2: تسجيل في دورة
```javascript
const userId = 'user_id_here';
const courseId = 'course_id_here';

const response = await fetch(
  `https://innovologia.learnworlds.com/admin/api/v2/users/${userId}/enrollments`,
  {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_TOKEN',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      product_id: courseId,
      product_type: 'course',
      price: 0
    })
  }
);

const enrollment = await response.json();
console.log('Enrolled successfully');
```

### مثال 3: التحقق من SSO
```javascript
const response = await fetch(
  'https://innovologia.learnworlds.com/admin/api/v2/sso',
  {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_TOKEN',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: 'user@example.com',
      redirect_url: 'https://yoursite.com/student',
      lifetime: 3600
    })
  }
);

const { url } = await response.json();
// Redirect user to url
window.location.href = url;
```

---

## معالجة الأخطاء

### Status Codes
- `200` - نجاح
- `400` - خطأ في المدخلات
- `401` - فشل المصادقة
- `403` - ممنوع
- `404` - غير موجود
- `500` - خطأ في السيرفر

### مثال معالجة خطأ
```javascript
try {
  const response = await fetch(apiUrl, options);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API Error');
  }
  
  const data = await response.json();
  return data;
} catch (error) {
  console.error('API Request failed:', error.message);
  // Handle error appropriately
}
```

---

## Rate Limiting

LearnWorlds قد يطبق rate limiting على الطلبات. توصيات:
- استخدم caching للبيانات التي لا تتغير كثيراً
- تجنب الطلبات المتكررة في فترة قصيرة
- استخدم webhooks بدلاً من polling

---

## Best Practices

1. **استخدم Environment Variables للـ Tokens**
   ```javascript
   const token = process.env.LEARNWORLD_ADMIN_TOKEN;
   ```

2. **تحقق من الأخطاء دائماً**
   ```javascript
   if (!response.ok) {
     throw new Error('API Error');
   }
   ```

3. **استخدم Webhooks للتحديثات الفورية**
   - بدلاً من polling كل دقيقة
   - أكثر كفاءة وأقل استهلاكاً

4. **Cache البيانات الثابتة**
   - قائمة الدورات
   - معلومات المستخدمين

5. **Log جميع الطلبات المهمة**
   ```javascript
   console.log('[API] Request:', method, endpoint);
   console.log('[API] Response:', status, data);
   ```

---

## الدعم والموارد

- **الوثائق الرسمية:** https://www.learnworlds.dev/docs/api
- **School Settings:** https://innovologia.learnworlds.com/admin/settings
- **API Console:** تجد في dashboard الخاص بك

---

**تم الإنشاء بواسطة:** v0 by Vercel  
**التاريخ:** 4 يناير 2026  
**الإصدار:** 1.0.0
