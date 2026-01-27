# SSO Implementation with LearnWorlds

## Overview
LearnWorlds handles SSO (Single Sign-On) authentication internally. When users click on social login buttons (Google, Facebook, LinkedIn, Apple), they are redirected to the LearnWorlds platform where the authentication is managed.

## How It Works

### User Flow:
1. User clicks on a social login button (e.g., "Continue with Google")
2. Application redirects to LearnWorlds login page: `https://innovologia.learnworlds.com/login`
3. User authenticates via Google/Facebook/LinkedIn/Apple on LearnWorlds
4. LearnWorlds handles the OAuth flow and user creation
5. After successful authentication, user can be redirected back to your platform

### Why This Approach?

LearnWorlds manages:
- OAuth client credentials for all social providers
- User account creation and linking
- Session management
- Security tokens and refresh tokens
- User data synchronization

## Implementation Details

### Login Page (`app/auth/login/page.tsx`)
- Main LearnWorlds button: Redirects to `/login` for full authentication
- Social login buttons: All redirect to LearnWorlds `/login` where users can choose their provider
- Email/password form: Uses custom API for direct authentication

### Register Page (`app/auth/register/page.tsx`)
- Main LearnWorlds button: Redirects to `/signup` for registration
- Social signup buttons: All redirect to LearnWorlds `/signup` where users can register via social providers
- Email/password form: Uses custom API for direct registration

## Environment Variables Required

```env
NEXT_PUBLIC_LEARNWORLD_SCHOOL_DOMAIN=innovologia.learnworlds.com
```

## User Journey

### For Existing Users:
```
Click "Continue with Google" 
  → Redirect to LearnWorlds 
  → User logs in with Google 
  → LearnWorlds authenticates 
  → User accesses course content
```

### For New Users:
```
Click "Continue with Google" on Register page
  → Redirect to LearnWorlds signup
  → User creates account via Google
  → Account created in LearnWorlds
  → User can access courses
```

## Benefits

1. **Security**: LearnWorlds handles all OAuth security
2. **Maintenance**: No need to manage OAuth credentials
3. **Compliance**: LearnWorlds ensures GDPR and privacy compliance
4. **Integration**: Seamless user management across platforms
5. **Updates**: Automatic updates when social providers change APIs

## Alternative: Custom SSO (Not Recommended for Now)

If you need custom SSO later, you can use LearnWorlds SSO API:

```typescript
// Create SSO link via API
const ssoUrl = await learnworldsClient.createSSOLink(userEmail, redirectUrl)
// Redirect user to ssoUrl
```

However, this requires:
- Email/password authentication first
- Additional API calls
- More complex user flow

## Current Implementation Status

✅ Login page redirects to LearnWorlds  
✅ Register page redirects to LearnWorlds  
✅ All social buttons properly configured  
✅ Loading states added  
✅ Error handling implemented  
✅ Arabic and English support  

## Notes

- The "This content is blocked" error was caused by trying to open LearnWorlds in a popup/iframe
- Now using direct redirect (`window.location.href`) which works correctly
- Users authenticate on LearnWorlds domain, not in embedded views
