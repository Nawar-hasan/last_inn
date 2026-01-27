# Quick Start: LearnWorld Integration

## 3-Step Integration Process

### Step 1: Environment Setup (5 minutes)
Create `.env.local`:
\`\`\`
LEARNWORLD_API_KEY=your_key
LEARNWORLD_API_URL=https://api.learnworld.com
STRIPE_SECRET_KEY=your_stripe_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_key
\`\`\`

### Step 2: Replace Mock Data (30 minutes)
Search for these locations and replace with API calls:
- `components/site-header.tsx` - Line ~52 (Notifications)
- `app/student/certificates/page.tsx` - Line ~18 (Certificates)
- `app/student/messages/page.tsx` - Line ~16 (Messages)
- `app/api/payments/process/route.ts` - Entire file (Payment)

### Step 3: Test End-to-End (1 hour)
1. Test registration/login
2. Test notifications appearing
3. Test certificate display
4. Test message sending
5. Test payment flow

## Search & Replace Patterns

### Find All Mock Data
\`\`\`bash
grep -r "Mock" app/ components/ --include="*.tsx" --include="*.ts"
\`\`\`

### Find API Integration Points
\`\`\`bash
grep -r "// " app/ components/ --include="*.tsx" --include="*.ts"
\`\`\`

## Key Components to Know

### Authentication
- Context: `/lib/auth-context.tsx`
- Login Route: `/app/student/login`
- Register Route: `/app/student/login` (same page)

### Student Dashboard
- Layout: `/app/student/layout.tsx`
- Topbar: `/app/student/_components/topbar.tsx`
- Sidebar: `/app/student/_components/sidebar.tsx`

### Payment Flow
- Checkout: `/app/checkout/page.tsx`
- Success: `/app/checkout/success/page.tsx`
- API: `/app/api/payments/process/route.ts`

### New Pages
- Community Plans: `/app/community/page.tsx`
- Certificates: `/app/student/certificates/page.tsx`
- Messages: `/app/student/messages/page.tsx`

## Common Integration Tasks

### Add Notification Fetching
\`\`\`typescript
useEffect(() => {
  const fetchNotifications = async () => {
    const response = await fetch(`/api/student/notifications?studentId=${student?.id}`)
    const data = await response.json()
    setNotifications(data)
  }
  if (isAuthenticated) fetchNotifications()
}, [isAuthenticated])
\`\`\`

### Add Certificate Fetching
\`\`\`typescript
useEffect(() => {
  const fetchCertificates = async () => {
    const response = await fetch(`/api/student/certificates?studentId=${student?.id}`)
    const data = await response.json()
    setCertificates(data)
  }
  if (student?.id) fetchCertificates()
}, [student?.id])
\`\`\`

### Add Payment Processing with Stripe
\`\`\`typescript
const handlePayment = async (e) => {
  e.preventDefault()
  const response = await fetch("/api/payments/process", {
    method: "POST",
    body: JSON.stringify({
      planName, planPrice, studentId: student?.id
    })
  })
  const { clientSecret } = await response.json()
  // Use Stripe to handle payment with clientSecret
}
\`\`\`

## API Response Format Examples

### Notifications
\`\`\`json
[
  {
    "id": 1,
    "text": "Your certificate has been approved",
    "read": false,
    "timestamp": "2024-01-20T10:30:00Z"
  }
]
\`\`\`

### Certificates
\`\`\`json
[
  {
    "id": 1,
    "courseName": "Innovation Basics",
    "issueDate": "2024-01-15",
    "certificateNumber": "CERT-001",
    "status": "completed",
    "verified": true,
    "downloadUrl": "/certs/cert-001.pdf"
  }
]
\`\`\`

### Messages
\`\`\`json
[
  {
    "id": 1,
    "from": "Expert Name",
    "message": "Hello, how can I help?",
    "timestamp": "2024-01-20T10:30:00Z",
    "read": false
  }
]
\`\`\`

## Troubleshooting

### Issue: Notifications not showing
1. Check API is returning data
2. Verify isAuthenticated is true
3. Check browser console for errors
4. Add console.log("[v0] Notifications:", data) to debug

### Issue: Payment form not appearing
1. Ensure Stripe key is in environment
2. Check payment component is mounted
3. Verify form elements load correctly
4. Test Stripe sandbox mode first

### Issue: Pages not loading
1. Check all imports are correct
2. Verify page exists in filesystem
3. Check next.config.js for route conflicts
4. Restart dev server

## Deploy Checklist

Before deploying to production:
- [ ] All mock data replaced with API calls
- [ ] Environment variables set in Vercel
- [ ] Stripe live keys configured
- [ ] LearnWorld API credentials verified
- [ ] Email notifications tested
- [ ] Payment flow tested end-to-end
- [ ] User registration tested
- [ ] Certificate generation tested
- [ ] Mobile responsiveness verified
- [ ] Accessibility audit completed

## Support Resources

- Full integration guide: `docs/LEARNWORLD_API_INTEGRATION.md`
- Implementation summary: `docs/IMPLEMENTATION_SUMMARY.md`
- Project status: `README_PROJECT_STATUS.md`

---

**Estimated Integration Time**: 2-3 hours
**Difficulty Level**: Intermediate
**Last Updated**: 2025-01-12
