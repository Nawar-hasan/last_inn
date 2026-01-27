import { NextResponse } from "next/server"

/**
 * Debug API to check environment configuration
 * This helps diagnose issues with LearnWorlds integration on production
 * 
 * IMPORTANT: This endpoint should be removed or protected in production
 */

export async function GET() {
  const envCheck = {
    // LearnWorlds Configuration
    LEARNWORLD_ADMIN_API_URL: {
      set: !!process.env.LEARNWORLD_ADMIN_API_URL,
      value: process.env.LEARNWORLD_ADMIN_API_URL ? 
        process.env.LEARNWORLD_ADMIN_API_URL.substring(0, 30) + "..." : "NOT SET"
    },
    LEARNWORLD_ADMIN_TOKEN: {
      set: !!process.env.LEARNWORLD_ADMIN_TOKEN,
      length: process.env.LEARNWORLD_ADMIN_TOKEN?.length || 0
    },
    LEARNWORLD_CLIENT_ID: {
      set: !!process.env.LEARNWORLD_CLIENT_ID,
      length: process.env.LEARNWORLD_CLIENT_ID?.length || 0
    },
    LEARNWORLD_PUBLIC_API_URL: {
      set: !!process.env.LEARNWORLD_PUBLIC_API_URL,
      value: process.env.LEARNWORLD_PUBLIC_API_URL ? 
        process.env.LEARNWORLD_PUBLIC_API_URL.substring(0, 30) + "..." : "NOT SET"
    },
    LEARNWORLD_PUBLIC_API_KEY: {
      set: !!process.env.LEARNWORLD_PUBLIC_API_KEY,
      length: process.env.LEARNWORLD_PUBLIC_API_KEY?.length || 0
    },
    LEARNWORLD_SCHOOL_ID: {
      set: !!process.env.LEARNWORLD_SCHOOL_ID,
      value: process.env.LEARNWORLD_SCHOOL_ID || "NOT SET"
    },
    LEARNWORLD_SCHOOL_DOMAIN: {
      set: !!process.env.LEARNWORLD_SCHOOL_DOMAIN,
      value: process.env.LEARNWORLD_SCHOOL_DOMAIN || "NOT SET"
    },
    
    // Environment
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_ENV: process.env.VERCEL_ENV || "NOT SET",
  }

  // Test LearnWorlds connection
  let connectionTest = { success: false, error: "", coursesCount: 0 }
  
  try {
    const { learnworldsClient } = await import("@/lib/learnworlds-client")
    
    if (!learnworldsClient.isConfigured()) {
      connectionTest.error = "LearnWorlds client is NOT configured - missing LEARNWORLD_ADMIN_TOKEN or LEARNWORLD_CLIENT_ID"
    } else {
      const courses = await learnworldsClient.getCourses()
      connectionTest.success = true
      connectionTest.coursesCount = Array.isArray(courses) ? courses.length : 0
    }
  } catch (error: any) {
    connectionTest.error = error.message
  }

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    environment: envCheck,
    connectionTest,
    instructions: {
      message: "If environment variables show 'NOT SET', make sure they are added to Vercel Project Settings > Environment Variables",
      requiredVars: [
        "LEARNWORLD_ADMIN_API_URL",
        "LEARNWORLD_ADMIN_TOKEN", 
        "LEARNWORLD_CLIENT_ID",
        "LEARNWORLD_SCHOOL_ID",
        "LEARNWORLD_SCHOOL_DOMAIN"
      ]
    }
  })
}
