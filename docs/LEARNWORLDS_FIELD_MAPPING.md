# LearnWorlds API Field Mapping

## خريطة الحقول بين LearnWorlds API ومنصة Innovologia

### Course Fields (حقول الدورة)

| LearnWorlds Field | Our Platform Field | Type | Notes |
|---|---|---|---|
| `id` | `id` | string | Course identifier |
| `title` / `name` | `title` | string | Course title |
| `description` | `description` | string | Short description |
| `long_description` | `fullDescription` | string | Full HTML description |
| `image` / `thumbnail` / `courseImage` | `image` | string | Course cover image URL |
| `price` | `price.amount` | number | Course price |
| `original_price` | `price.originalAmount` | number | Original price before discount |
| `currency` | `price.currency` | string | Currency code (USD, SAR) |
| `access` | `accessType` | enum | free/paid/subscription/draft |
| `identifiers.slug` / `slug` | `slug` | string | URL-friendly identifier |
| `duration` | `duration` | number | Duration in minutes |
| `categories` | `categories` | string[] | Category names |
| `instructor_id` | `instructor.id` | string | Instructor user ID |
| `author` | `instructor` | object | Instructor details (fallback) |
| `created` | `createdAt` | Date | Creation timestamp |
| `modified` | `updatedAt` | Date | Last modified timestamp |
| `sections` | `curriculum` | array | Course sections/chapters |
| `published` | `published` | boolean | Publication status |
| `certificates_enabled` | `certificateEnabled` | boolean | Certificate availability |
| `meta` | `metadata` | object | Custom metadata |
| `settings.level` | `level` | enum | beginner/intermediate/advanced/all |
| `settings.language` | `language` | string | Course language |
| `afterPurchase.goals` | `goals` | string[] | Learning goals |
| `afterPurchase.targetAudience` | `targetAudience` | string[] | Target audience |
| `afterPurchase.requirements` | `requirements` | string[] | Prerequisites |

### Section Fields (حقول القسم)

| LearnWorlds Field | Our Platform Field | Type | Notes |
|---|---|---|---|
| `id` | `id` | string | Section identifier |
| `title` / `name` | `title` | string | Section title |
| `description` | `description` | string | Section description |
| `position` / `order` | `position` | number | Display order |
| `learning_units` / `items` | `lessons` | array | Section lessons |

### Learning Unit Fields (حقول الدرس)

| LearnWorlds Field | Our Platform Field | Type | Notes |
|---|---|---|---|
| `id` | `id` | string | Lesson identifier |
| `title` / `name` | `title` | string | Lesson title |
| `type` | `type` | enum | video/text/pdf/quiz/etc |
| `description` | `description` | string | Lesson description |
| `duration` | `duration` | number | Duration in minutes |
| `position` / `order` | `position` | number | Display order |
| `free_preview` | `freePreview` | boolean | Free preview allowed |
| `video_url` | `videoUrl` | string | Video URL |
| `content_url` | `contentUrl` | string | Content URL |
| `resources` | `resources` | array | Attached resources |

### Instructor Fields (حقول المدرب)

| LearnWorlds Field | Our Platform Field | Type | Notes |
|---|---|---|---|
| `id` | `id` | string | User identifier |
| `email` | `email` | string | Email address |
| `first_name` / `fields.first_name` | (combined) | string | First name |
| `last_name` / `fields.last_name` | (combined) | string | Last name |
| - | `name` | string | Full name (combined) |
| `avatar` / `fields.avatar` | `avatar` | string | Profile image URL |
| `bio` / `fields.bio` | `bio` | string | Biography |

## Caching Strategy

### Cache TTL Settings

| Data Type | TTL | Notes |
|---|---|---|
| Courses List | 5 minutes | قائمة جميع الدورات |
| Course Details | 10 minutes | تفاصيل دورة واحدة |
| Course Contents | 15 minutes | منهاج الدورة |

### ISR (Incremental Static Regeneration)

- صفحات الدورات تستخدم ISR مع `revalidate = 3600` (ساعة واحدة)
- Webhooks تقوم بـ invalidate الكاش عند التحديث

### Webhook Events

الأحداث التي تؤدي إلى تحديث الكاش:

```
course.created    → Invalidate courses list
course.updated    → Invalidate course + list
course.published  → Invalidate course + list
course.deleted    → Invalidate course + list
course.unpublished → Invalidate course + list
section.* events  → Invalidate course contents
lesson.* events   → Invalidate course contents
```

## API Endpoints

### Public Endpoints

```
GET /api/courses              → All courses (cached)
GET /api/courses/[id]         → Course details (cached)
GET /api/courses/[id]/contents → Course curriculum (cached)
```

### Dynamic Pages

```
/courses                      → Courses listing (SSG + ISR)
/courses/[slug]               → Course details (SSG + ISR)
/student/courses/[id]         → Student course player (CSR)
```

## Error Handling

- Stale cache returned on API errors
- Graceful fallback for missing fields
- Console logging for debugging

## Files Structure

```
lib/
├── learnworld-types.ts       → TypeScript types
├── learnworlds-client.ts     → API client
├── course-mapper.ts          → Field mapping functions
├── course-service.ts         → Service layer with caching
└── course-event-handlers.ts  → Webhook handlers

app/api/
├── courses/
│   ├── route.ts              → Courses list API
│   └── [id]/
│       ├── route.ts          → Course details API
│       └── contents/route.ts → Course contents API
├── revalidate/route.ts       → ISR revalidation
└── webhooks/learnworlds/     → Webhook handler
```
