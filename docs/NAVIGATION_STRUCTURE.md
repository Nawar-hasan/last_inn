# Innovologia Navigation & Routing Structure

## Public Routes (No Authentication Required)

### Main Pages
- `/` - Home/Landing Page
- `/about-us` - About Innovologia
- `/courses` - Courses Catalog
- `/blog` - Blog & Articles
- `/faq` - FAQ
- `/t&c` - Terms & Conditions

### Course Routes (Before Enrollment)
- `/courses/[courseId]` - Course Details & Preview

### Blog Routes
- `/blog/[slug]` - Individual Blog Article

---

## Protected Routes (LearnWorld Authentication Required)

### Student Dashboard
- `/student` - Main dashboard with stats and quick access
- `/student/page.tsx` - Entry point after login

### Course Management
- `/student/courses` - My Enrolled Courses
- `/student/courses/[id]` - Course Player (Video + Content)
- `/student/courses/[id]/quiz/[quizId]` - Quiz Interface
- `/student/courses/[id]/certificate` - Request Certificate

### User Account
- `/student/profile` - User Profile & Settings
- `/student/settings` - Account Settings
- `/student/messages` - Inbox/Messaging
- `/student/certificates` - My Certificates

---

## Navigation Flow

### Public User Journey
\`\`\`
Home (/) 
  ↓
Browse Courses (/courses)
  ↓
View Course Details (/courses/[id])
  ↓
Click "Enroll" → Login (API: /api/auth/login)
  ↓
Redirected to /student (Dashboard)
\`\`\`

### Authenticated User Journey
\`\`\`
Dashboard (/student)
  ↓
View Courses (/student/courses)
  ↓
Open Course (/student/courses/[id])
  ↓
Watch Lessons → Take Quiz → Request Certificate
  ↓
View Profile (/student/profile)
\`\`\`

---

## API Route Structure

### Authentication
\`\`\`
POST   /api/auth/login      - Login with LearnWorld
POST   /api/auth/register   - Create new account
GET    /api/auth/me         - Get current user
\`\`\`

### Courses & Content
\`\`\`
GET    /api/courses         - All courses (public)
GET    /api/courses/[id]    - Course details
GET    /api/progress        - User progress
POST   /api/progress        - Update progress
\`\`\`

### Quizzes
\`\`\`
POST   /api/quizzes/submit  - Submit quiz answers
GET    /api/quizzes/[id]    - Quiz details
\`\`\`

### Certificates
\`\`\`
POST   /api/certificates/request  - Request certificate
GET    /api/certificates          - User certificates
\`\`\`

### Notifications & Geo
\`\`\`
POST   /api/notifications/send    - Send notification
GET    /api/geo                   - Geolocation (for currency)
\`\`\`

---

## Component Organization

### Layout Components
- `components/site-header.tsx` - Public navigation
- `app/student/_components/header.tsx` - Student header
- `app/student/_components/sidebar.tsx` - Student navigation
- `components/appverse-footer.tsx` - Footer (all pages)

### Page Components
- `app/page.tsx` - Landing (imports hero, features, pricing, etc.)
- `app/student/page.tsx` - Dashboard
- `app/student/courses/page.tsx` - Course list
- `app/student/courses/[id]/page.tsx` - Course player

### Utility Components
- `components/theme-toggle.tsx` - Dark/Light mode
- `components/language-toggle.tsx` - AR/EN switch
- `app/student/_components/notification-toast.tsx` - Alerts

---

## Protected Route Guard

All `/student/*` routes require authentication via:
- `lib/auth-context.tsx` - Auth state
- Middleware check in `middleware.ts`
- Redirect to login if not authenticated

---

## Mobile Navigation

### Public (Mobile)
- Hamburger menu → All main links
- Course grid → Cards with "Enroll" button
- Footer → All links

### Student (Mobile)
- Bottom tab navigation (iOS-style)
- Sidebar drawer (Android-style)
- Course player adapts to mobile

---

## SEO & Metadata

Each page has:
- Dynamic metadata in `layout.tsx`
- Structured data (schema.org)
- Open Graph tags
- Twitter cards

---

## Internationalization (i18n)

All routes support bilingual content:
- Content switches via `language-context.tsx`
- No separate `/ar/` and `/en/` routes
- RTL/LTR handled automatically

---

## Environment & Redirects

### Login Redirect Logic
\`\`\`
1. User at /student/* without auth
2. Redirect to /api/auth/login
3. Verify with LearnWorld
4. Set JWT token
5. Redirect back to /student
\`\`\`

### Logout
\`\`\`
1. User clicks logout
2. Clear auth context
3. Clear cookies
4. Redirect to /
\`\`\`

---

**Last Updated:** December 5, 2025
**Status:** Ready for LearnWorld Integration
\`\`\`

Now let me create proper student layout with navigation:
