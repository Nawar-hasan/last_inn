# Innovologia - Complete Architecture Map
## Latest: December 5, 2025 | Status: Restructured & Cleaned

---

## 🎯 Project Overview

**Innovologia** is an innovation and creative thinking training platform built with Next.js, featuring:
- Bilingual UI (Arabic/English)
- LearnWorld LMS Integration (primary system)
- Student dashboard with course management
- Quiz and certificate systems
- Blog and community features

---

## 📁 Cleaned Folder Structure

### **Removed (Not Innvologia Related):**
- ❌ `/app/3D-architecture-visualization-studio/` - Old skitbit theme
- ❌ `/app/3d-product-rendering/` - Old skitbit theme
- ❌ `/app/About/` - Duplicate page
- ❌ `/app/admin/` - Old admin dashboard (not LearnWorld-based)
- ❌ `/app/community/` - Old community pages
- ❌ `/app/checkout/` - Legacy checkout system
- ❌ `/app/funnel/` - Old funnel page
- ❌ `/app/packages/` - Old packages page
- ❌ `/app/revisions/` - Old revisions page
- ❌ All skitbit references in components

### **Kept & Active Routes:**
\`\`\`
/                          → Landing page (public)
/about-us                  → About page
/courses                   → Courses listing
/courses/[courseId]        → Course details (before enrollment)
/blog                      → Blog listing
/blog/[slug]              → Blog article
/faq                      → FAQ page
/t&c                      → Terms & Conditions

/student                   → Student Dashboard (LearnWorld)
/student/courses          → Enrolled courses list
/student/courses/[id]     → Course player (video + content)
/student/courses/[id]/quiz/[quizId]    → Quiz interface
/student/courses/[id]/certificate      → Certificate request
/student/certificates     → My certificates
/student/profile          → User profile
/student/messages         → Inbox/Messages
/student/settings         → Account settings
\`\`\`

---

## 🏗️ System Architecture

### **1. Core Control: LearnWorld LMS**
\`\`\`
LearnWorld API (Source of Truth)
↓
lib/learnworld-client.ts (API Client)
↓
lib/auth-context.tsx (Auth State)
↓
lib/hooks/use-student-data.ts (Data Hooks)
↓
React Components (UI Layer)
\`\`\`

### **2. Authentication Flow**
\`\`\`
User Login → /api/auth/login → LearnWorld API → Auth Context → Student Dashboard
     ↓
Session stored → Cookies + Context
     ↓
Protected Routes (/student/*)
\`\`\`

### **3. Data Flow - Student Section**
\`\`\`
LearnWorld DB
    ↓
/api/courses/[id]
/api/progress
/api/quizzes/submit
/api/certificates/request
    ↓
use-student-data.ts (SWR Hooks)
    ↓
Student Components
    ↓
UI Rendered (Bilingual)
\`\`\`

---

## 📊 Page Structure & Navigation

### **Public Pages (No Auth Required)**

#### `app/page.tsx` - Landing Page
- **Components Used:**
  - SiteHeader (Navigation)
  - Hero (Main pitch)
  - ProblemsSection (Pain points)
  - Services (What we offer)
  - Features (Key features)
  - FeaturedArticles (Blog preview)
  - PricingInnovologia (Pricing)
  - FeaturedCourses (Course preview)
  - StatsSection (Social proof)
  - AppverseFooter (Footer)
- **Flow:** Entry point → Showcases Innovologia

#### `app/about-us/page.tsx` - About Page
- Showcases company mission, vision, values
- Team information
- Why choose Innovologia

#### `app/courses/page.tsx` - Courses Catalog
- Lists all available courses (pulled from LearnWorld)
- Course cards with description, pricing, enroll buttons
- **Components:** CourseCard, CoursesClientPage

#### `app/courses/[courseId]/page.tsx` - Course Details
- Full course description
- Curriculum preview
- Instructor info
- Enroll button (redirects to checkout/login)

#### `app/blog/page.tsx` - Blog Home
- Lists all articles
- Search/filter functionality
- Featured articles section

#### `app/blog/[slug]/page.tsx` - Blog Article
- Article content
- Comments section
- Share options
- Related articles

#### `app/faq/page.tsx` - FAQ Page
- Common questions
- Accordion format

#### `app/t&c/page.tsx` - Terms & Conditions
- Legal information

---

### **Protected Pages (Auth Required: /student/*)**

#### `app/student/page.tsx` - Dashboard
- Welcome banner with user name
- **Stats Box:** 
  - Courses enrolled
  - Courses completed
  - Current streak
  - Certificates earned
- **My Courses Section:**
  - In-progress courses
  - Completed courses
  - Quick access buttons
- **Notifications:** 
  - Upcoming deadlines
  - New messages
  - Course announcements

#### `app/student/courses/page.tsx` - My Courses
- **Filter/Search:** By course name, status
- **Course Cards:**
  - Course title + image
  - Progress bar (%)
  - Last accessed date
  - Continue/Start button
- **Sections:**
  - In Progress
  - Completed
  - Enrolled

#### `app/student/courses/[id]/page.tsx` - Course Player
- **Video Player:** Main content area
- **Sidebar:** 
  - Course chapters/lessons
  - Completed checkmarks
  - Currently playing indicator
- **Tabs:**
  - Lessons (video list)
  - Materials (downloadable resources)
  - Resources (links)
  - Notes (student notes)
- **Progress:** 
  - Overall course progress %
  - Current lesson progress
  - "Mark as complete" button
- **Bottom:** 
  - Next lesson button
  - Go to quiz button (if available)

#### `app/student/courses/[id]/quiz/[quizId]/page.tsx` - Quiz Interface
- **Timer:** Countdown (if timed quiz)
- **Progress:** Question X of Y
- **Question Display:**
  - Question text
  - Multiple choice options OR
  - Short answer input OR
  - True/False buttons
- **Navigation:** Previous/Next/Submit buttons
- **Results Screen:**
  - Score: X/Y
  - Correct/incorrect breakdown
  - Option to review answers
  - "Return to course" button

#### `app/student/courses/[id]/certificate/page.tsx` - Certificate Request
- **Prerequisites Check:** 
  - Course completed? ✓/✗
  - Quiz passed? ✓/✗
  - All materials covered? ✓/✗
- **Form:**
  - Full name (prefilled from profile)
  - Email
  - Confirm button
- **Preview:** Certificate template preview
- **Success State:** "Certificate sent to your email"

#### `app/student/certificates/page.tsx` - My Certificates
- **Certificates List:**
  - Certificate image/preview
  - Course name
  - Issue date
  - Expiry date (if applicable)
- **Actions per Certificate:**
  - View (full screen)
  - Download (PDF)
  - Share (social media)
  - Verify (QR code/link)

#### `app/student/profile/page.tsx` - User Profile
- **Personal Info Section:**
  - Profile picture (upload)
  - Full name
  - Email (read-only)
  - Phone
  - Bio/About
  - Save button
- **Account Info:**
  - Student ID
  - Enrollment date
  - Last login
  - Account status
- **Privacy:** 
  - Public profile settings
  - Share preferences

#### `app/student/messages/page.tsx` - Messages/Inbox
- **Conversations List:**
  - Contact name + avatar
  - Last message preview
  - Unread badge
  - Timestamp
- **Message Thread View:**
  - Conversation history
  - Message compose box
  - File attachments

#### `app/student/settings/page.tsx` - Settings
- **Language:** Arabic/English toggle
- **Notifications:**
  - Email notifications (on/off)
  - SMS notifications (on/off)
  - In-app notifications (on/off)
- **Privacy:**
  - Profile visibility
  - Data sharing
- **Appearance:**
  - Theme (light/dark)
- **Account Security:**
  - Change password
  - Two-factor authentication
  - Login history

---

## 🔗 API Routes Structure

### **Authentication**
\`\`\`
POST /api/auth/login       → Login user with LearnWorld
POST /api/auth/register    → Register new user
GET  /api/auth/me          → Get current user info
\`\`\`

### **Courses**
\`\`\`
GET  /api/courses          → All courses (for catalog)
GET  /api/courses/[id]     → Course details
\`\`\`

### **Student Progress**
\`\`\`
GET  /api/progress         → All user progress
POST /api/progress         → Update progress
\`\`\`

### **Quizzes**
\`\`\`
POST /api/quizzes/submit   → Submit quiz answers
GET  /api/quizzes/[id]     → Quiz details & attempts
\`\`\`

### **Certificates**
\`\`\`
POST /api/certificates/request → Request certificate
GET  /api/certificates     → User's certificates
\`\`\`

---

## 🎨 Component Organization

### **Root Components**
- `SiteHeader.tsx` - Main navigation (public)
- `AppverseFooter.tsx` - Footer (all pages)
- `Plasma.tsx` - Background animation

### **Home Page Components**
- `Hero.tsx` - Hero section
- `ProblemsSection.tsx` - Problem statement
- `Services.tsx` - Services offered
- `Features.tsx` - Platform features
- `FeaturedArticles.tsx` - Blog preview
- `PricingInnovologia.tsx` - Pricing table
- `FeaturedCourses.tsx` - Course preview
- `StatsSection.tsx` - Social proof

### **Student Section Components** (`app/student/_components/`)
- `header.tsx` - Student page header
- `sidebar.tsx` - Navigation sidebar
- `video-player.tsx` - Course video player
- `comments-section.tsx` - Lesson comments
- `notification-toast.tsx` - Alerts

### **Utility Components**
- Theme system (dark/light)
- Language switcher (AR/EN)
- UI library (button, card, tabs, etc.)

---

## 🔐 Authentication & State Management

### **Auth Context** (`lib/auth-context.tsx`)
\`\`\`typescript
- currentUser: Student | null
- isLoading: boolean
- login(email, password)
- logout()
- register(email, password, name)
\`\`\`

### **Language Context** (`lib/language-context.tsx`)
\`\`\`typescript
- language: 'ar' | 'en'
- toggleLanguage()
\`\`\`

### **Data Fetching** (`lib/hooks/use-student-data.ts`)
- `useStudentCourses()` - Fetch user's enrolled courses
- `useStudentProgress()` - Fetch progress for course
- `useStudentCertificates()` - Fetch certificates
- All use SWR for caching

---

## 🌐 Bilingual Support

- **Routing:** `/ar/*` and `/en/*` (via middleware)
- **Content:** All text in `language-context`
- **RTL/LTR:** Tailwind handles layout direction
- **Current Setup:** Arabic by default, English available

---

## 📝 Environment Variables Required

\`\`\`env
# LearnWorld Integration
NEXT_PUBLIC_LEARNWORLD_API_URL=https://api.learnworld.com
LEARNWORLD_API_KEY=your-api-key-here
LEARNWORLD_SCHOOL_ID=your-school-id-here

# Optional Services
NEXT_PUBLIC_STRIPE_KEY=your-stripe-public-key-here
WHATSAPP_API_KEY=your-whatsapp-key-here
EMAIL_API_KEY=your-email-key-here
\`\`\`

---

## 📦 Dependencies by Feature

| Feature | Package | Purpose |
|---------|---------|---------|
| UI Components | shadcn/ui | Pre-built components |
| Forms | React Hook Form | Form management |
| Styling | Tailwind CSS | Utility-first CSS |
| Data Fetching | SWR | Client-side data fetching |
| Theme | next-themes | Light/Dark mode |
| Icons | Lucide React | Icon library |
| Animations | Tailwind CSS | Built-in animations |
| Video | HLS.js | Video streaming |

---

## 🚀 Deployment & Hosting

- **Platform:** Vercel (Next.js native)
- **Database:** LearnWorld (external)
- **Static Files:** Vercel Blob or CDN
- **Environment:** Node.js 18+

---

## ✅ Cleanup Checklist

- [x] Removed old 3D theme pages
- [x] Removed skitbit references
- [x] Removed old admin dashboard
- [x] Removed old community pages
- [x] Removed legacy checkout
- [x] Removed old funnel/packages pages
- [x] Kept only Innovologia-related content
- [x] Student section as primary
- [x] LearnWorld as core control
- [x] All pages linked properly
- [x] API connections ready

---

## 📞 Support & Next Steps

1. **Connect LearnWorld API:** Update environment variables with real credentials
2. **Test Authentication:** Login flow with LearnWorld
3. **Verify Routes:** All protected routes require authentication
4. **Load Course Data:** Replace mock data with LearnWorld API calls
5. **Test Student Dashboard:** Check all features work with real data

---

**Built with ❤️ | Innovologia Platform**
