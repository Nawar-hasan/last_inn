type LogLevel = "info" | "warn" | "error" | "debug"

interface LogEntry {
  timestamp: string
  level: LogLevel
  endpoint: string
  method: string
  userId?: string
  duration?: number
  statusCode?: number
  error?: string
  requestBody?: any
  responseBody?: any
  metadata?: Record<string, any>
}

class APILogger {
  private logs: LogEntry[] = []
  private maxLogs = 1000
  private isDevelopment = process.env.NODE_ENV === "development"

  log(entry: Omit<LogEntry, "timestamp">): void {
    const logEntry: LogEntry = {
      ...entry,
      timestamp: new Date().toISOString(),
    }

    // Add to memory
    this.logs.push(logEntry)
    if (this.logs.length > this.maxLogs) {
      this.logs.shift()
    }

    // Console output in development
    if (this.isDevelopment) {
      const color = this.getLogColor(entry.level)
      console.log(
        `%c[API ${entry.level.toUpperCase()}] ${entry.method} ${entry.endpoint}`,
        `color: ${color}; font-weight: bold`,
        {
          ...entry,
          timestamp: logEntry.timestamp,
        },
      )
    }

    // Send to external logging service in production
    if (!this.isDevelopment && entry.level === "error") {
      this.sendToExternalService(logEntry)
    }
  }

  private getLogColor(level: LogLevel): string {
    switch (level) {
      case "info":
        return "#0ea5e9"
      case "warn":
        return "#f59e0b"
      case "error":
        return "#ef4444"
      case "debug":
        return "#8b5cf6"
      default:
        return "#6b7280"
    }
  }

  private async sendToExternalService(entry: LogEntry): Promise<void> {
    try {
      // Integration with external logging service (e.g., Sentry, LogRocket, etc.)
      if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
        // Send to Sentry or other service
        console.error("API Error:", entry)
      }
    } catch (error) {
      console.error("Failed to send log to external service:", error)
    }
  }

  getRecentLogs(limit = 100): LogEntry[] {
    return this.logs.slice(-limit)
  }

  getErrorLogs(): LogEntry[] {
    return this.logs.filter((log) => log.level === "error")
  }

  clearLogs(): void {
    this.logs = []
  }

  getLogsByEndpoint(endpoint: string): LogEntry[] {
    return this.logs.filter((log) => log.endpoint.includes(endpoint))
  }

  getLogsByUserId(userId: string): LogEntry[] {
    return this.logs.filter((log) => log.userId === userId)
  }

  // Export logs for analysis
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2)
  }
}

export const apiLogger = new APILogger()

// Helper function to create a logged API call wrapper
export function withLogging<T>(
  handler: (req: Request) => Promise<Response>,
  endpoint: string,
  method: string,
): (req: Request) => Promise<Response> {
  return async (req: Request) => {
    const startTime = Date.now()
    let response: Response
    let error: Error | null = null
    let requestBody: any

    try {
      // Parse request body
      try {
        const clonedReq = req.clone()
        requestBody = await clonedReq.json()
      } catch {
        requestBody = null
      }

      // Execute handler
      response = await handler(req)

      // Parse response body
      let responseBody: any
      try {
        const clonedRes = response.clone()
        responseBody = await clonedRes.json()
      } catch {
        responseBody = null
      }

      // Log success
      apiLogger.log({
        level: response.ok ? "info" : "warn",
        endpoint,
        method,
        statusCode: response.status,
        duration: Date.now() - startTime,
        requestBody: process.env.NODE_ENV === "development" ? requestBody : undefined,
        responseBody: process.env.NODE_ENV === "development" ? responseBody : undefined,
      })

      return response
    } catch (err) {
      error = err as Error

      // Log error
      apiLogger.log({
        level: "error",
        endpoint,
        method,
        duration: Date.now() - startTime,
        error: error.message,
        requestBody: process.env.NODE_ENV === "development" ? requestBody : undefined,
      })

      throw error
    }
  }
}
