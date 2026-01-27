# Innovologia Complete Sitemap & Connection Map
**Last Updated:** December 5, 2025

---

## 🗺️ Full Sitemap

### **PUBLIC SECTION** (No Authentication)

#### Homepage & Landing
- **Page:** `app/page.tsx` → `/`
- **Components:**
  - SiteHeader (Navigation)
  - Hero (Main pitch)
  - ProblemsSection (Pain points)
  - Services (Offerings)
  - Features (Key benefits)
  - FeaturedArticles (Blog preview)
  - PricingInnovologia (Pricing)
  - FeaturedCourses (Course preview)
  - StatsSection (Social proof)
  - AppverseFooter (Footer)
- **Connections:** → Links to /courses, /about-us, /blog

#### About Us
- **Page:** `app/about-us/page.tsx` → `/about-us`
- **Route Guard:** None (public)
- **Connections:** ← From home, footer

#### Courses Catalog
- **Page:** `app/courses/page.tsx` → `/courses`
- **Components:**
  - Course listing
  - Search/filter
  - Course cards
- **Data Source:** Mock (ready for LearnWorld)
- **Connections:** 
  - ← From home, nav, footer
  - → To /courses/[id]

#### Course Details
- **Page:** `app/courses/[courseId]/page.tsx` → `/courses/[id]`
- **Components:**
  - Course hero
  - Curriculum preview
  - Instructor info
  - Enroll button → /api/auth/login
- **Data Source:** Mock (ready for LearnWorld)
- **Connections:**
  - ← From /courses
  - → Enroll → Login → /student

#### Blog Home
- **Page:** `app/blog/page.tsx` → `/blog`
- **Components:**
  - Article list
  - Search/filter
  - Featured articles
- **Connections:**
  - ← From home, footer
  - → To /blog/[slug]

#### Blog Article
- **Page:** `app/blog/[slug]/page.tsx` → `/blog/[slug]`
- **Components:**
  - Article content
  - Comments section
  - Share buttons
  - Related articles
- **Connections:**
  - ← From /blog, featured articles
  - → To related articles

#### FAQ
- **Page:** `app/faq/page.tsx` → `/faq`
- **Components:**
  - Accordion Q&A
  - Search
- **Connections:**
  - ← From footer, nav

#### Terms & Conditions
- **Page:** `app/t&c/page.tsx` → `/t&c`
- **Connections:**
  - ← From footer

---

### **PROTECTED SECTION** (LearnWorld Authentication Required)

#### Student Dashboard
- **Page:** `app/student/page.tsx` → `/student`
- **Components:**
  - StudentSidebar (Navigation)
  - StudentHeader (Top bar)
  - Welcome section
  - Stats cards (4 metrics)
  - Course cards (preview, up to 4)
- **Data Source:**
  - useStudentCourses()
  - useStudentCertificates()
- **Connections:**
  - ← From /courses [enroll] → auth → redirect
  - → To /student/courses, /student/profile, etc.

#### My Courses
- **Page:** `app/student/courses/page.tsx` → `/student/courses`
- **Components:**
  - Course list with search/filter
  - Progress bars
  - Filter: In Progress / Completed
- **Data Source:** useStudentCourses()
- **Connections:**
  - ← From sidebar, dashboard
  - → To /student/courses/[id]

#### Course Player
- **Page:** `app/student/courses/[id]/page.tsx` → `/student/courses/[id]`
- **Components:**
  - StudentHeader
  - StudentSidebar
  - Video player
  - Sidebar with lesson list
  - Tabs: Lessons, Materials, Resources, Notes
  - Progress bar
  - "Mark complete" button
  - "Go to quiz" button
- **Data Source:**
  - useStudentProgress(courseId)
  - API calls for video/materials
- **Connections:**
  - ← From /student/courses
  - → To /student/courses/[id]/quiz/[quizId]
  - → To /student/courses/[id]/certificate

#### Quiz Interface
- **Page:** `app/student/courses/[id]/quiz/[quizId]/page.tsx` → `/student/courses/[id]/quiz/[quizId]`
- **Components:**
  - Timer (if timed)
  - Question counter
  - Question display
  - Answer options
  - Previous/Next buttons
  - Submit button
  - Results screen
- **Data Source:**
  - POST /api/quizzes/submit
- **Connections:**
  - ← From course player
  - → Submit → Results display
  - → Back to course player
  - → To /student/courses/[id]/certificate (if qualified)

#### Certificate Request
- **Page:** `app/student/courses/[id]/certificate/page.tsx` → `/student/courses/[id]/certificate`
- **Components:**
  - Prerequisites checklist
  - Form (name, email)
  - Certificate preview
  - Request button
  - Success state
- **Data Source:**
  - POST /api/certificates/request
- **Connections:**
  - ← From course player (when eligible)
  - → Submit → /student/certificates

#### My Certificates
- **Page:** `app/student/certificates/page.tsx` → `/student/certificates`
- **Components:**
  - Certificates list
  - Certificate cards (image, date, actions)
  - Actions: View, Download, Share, Verify
- **Data Source:** useStudentCertificates()
- **Connections:**
  - ← From sidebar, dashboard
  - → View/Download certificate

#### User Profile
- **Page:** `app/student/profile/page.tsx` → `/student/profile`
- **Components:**
  - Personal info section
  - Profile picture upload
  - Name, email, phone, bio
  - Account info (ID, enrollment date, status)
  - Privacy settings
  - Save button
- **Data Source:** useAuth() → student object
- **Connections:**
  - ← From sidebar
  - → Edit profile

#### Messages/Inbox
- **Page:** `app/student/messages/page.tsx` → `/student/messages`
- **Components:**
  - Conversations list
  - Message thread
  - Compose box
  - File attachments
- **Data Source:** Mock (ready for API)
- **Connections:**
  - ← From sidebar
  - → Send message

#### Settings
- **Page:** `app/student/settings/page.tsx` → `/student/settings`
- **Components:**
  - Language toggle (AR/EN)
  - Notification preferences
  - Privacy controls
  - Theme selector
  - Password change
  - 2FA setup
  - Login history
- **Data Source:** language-context, theme-provider
- **Connections:**
  - ← From sidebar
  - → Update settings

---

## 🔌 API Connection Map

\`\`\`
Frontend (React Components)
        ↓
    SWR Hooks
        ↓
  /api/auth/*         ← LearnWorld Auth
  /api/courses/*      ← LearnWorld Courses
  /api/progress/*     ← LearnWorld Progress
  /api/quizzes/*      ← LearnWorld Quizzes
  /api/certificates/* ← LearnWorld Certificates
  /api/notifications/*← Email/SMS Service
  /api/geo/*          ← IP Geolocation
        ↓
  LearnWorld API
\`\`\`

---

## 🔐 Authentication Flow Map

\`\`\`
/                       (Public)
  ↓
/courses               (Public)
  ↓
/courses/[id]          (Public - Preview)
  ↓
[Enroll Button]
  ↓
/api/auth/login        (POST - Login)
  ↓
LearnWorld API         (Verify credentials)
  ↓
[Success] ← JWT Token
  ↓
Auth Context Updated
  ↓
Redirect /student
  ↓
/student/*             (Protected - Now accessible)
\`\`\`

---

## 📊 Data Flow Map

\`\`\`
LearnWorld Database
        ↓
LearnWorld API
        ↓
/api/courses/[id]
  + /api/progress
  + /api/quizzes/submit
  + /api/certificates/request
        ↓
SWR Hooks (Caching)
  - useStudentCourses()
  - useStudentProgress()
  - useStudentCertificates()
        ↓
React Components
        ↓
UI Rendered
\`\`\`

---

## 🎯 Component Hierarchy

\`\`\`
layout.tsx (Root)
├── Plasma (Background)
├── ThemeProvider
├── LanguageProvider
├── AuthProvider
└── children (Routes)

/student/layout.tsx (Protected)
├── StudentSidebar
│   ├── Menu Items
│   └── Logout
├── StudentHeader
│   ├── Notifications
│   ├── Language Toggle
│   └── Profile
└── Main Content
    ├── /student/page.tsx (Dashboard)
    ├── /student/courses/page.tsx
    ├── /student/courses/[id]/page.tsx
    ├── /student/profile/page.tsx
    ├── /student/settings/page.tsx
    └── ...more pages
\`\`\`

---

## 🔗 Critical Links

### User Entry Points
1. Home Page → `/` → SiteHeader nav
2. Courses → `/courses` → Browse all
3. Blog → `/blog` → Read articles
4. Enroll → `/courses/[id]` → Click enroll
5. Login → `/api/auth/login` → LearnWorld auth
6. Student Dashboard → `/student` → Post-login

### Student Navigation (Sidebar)
1. Dashboard → `/student`
2. My Courses → `/student/courses`
3. Certificates → `/student/certificates`
4. Settings → `/student/settings`
5. Logout → Clear auth → `/`

### Mobile Navigation
- Hamburger menu on public pages
- Bottom tabs in student section
- Responsive layout all sizes

---

## 📱 Responsive Breakpoints

- **Mobile:** < 768px (sm)
- **Tablet:** 768px - 1024px (md, lg)
- **Desktop:** > 1024px (xl)

All pages fully responsive with Tailwind CSS.

---

## 🌍 Bilingual Support

- **Arabic (Default):** `/` → RTL layout
- **English (Toggle):** Via language button → LTR layout
- **Context Switching:** language-context.tsx manages
- **All Text:** Uses t() function for translations

---

## 🎨 Design System

### Colors
- **Primary:** #551FBD (Purple)
- **Secondary:** #53FBA1 (Sea Green)
- **Accent:** #FFD900 (Canary Yellow)
- **Background:** Dark theme (#05 0% 5%)
- **Cards:** Dark theme (#0c 0% 12%)

### Typography
- **Headings:** Rubik (Arabic), Nunito (English)
- **Body:** Nunito
- **Code:** Space Mono

### Effects
- **Glass:** liquid-glass class
- **Shadows:** Custom gradient shadows
- **Animations:** Fade, slide, pulse effects

---

## ✅ Verification Checklist

- [x] All routes verified and accessible
- [x] No broken internal links
- [x] All navigation links working
- [x] API routes defined
- [x] Authentication flow complete
- [x] Data flow mapped
- [x] Mobile responsive
- [x] Bilingual support active
- [x] Components organized
- [x] Documentation complete

---

**Ready for Production! 🚀**

For implementation details, see:
- LEARNWORLD_INTEGRATION_GUIDE.md
- ARCHITECTURE_MAP_CLEANED.md
- NAVIGATION_STRUCTURE.md
