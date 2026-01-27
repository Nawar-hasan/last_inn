"use client"

import { useEffect, useState } from "react"
import { X, CheckCircle, AlertCircle, Info } from "lucide-react"

interface Toast {
  id: string
  type: "success" | "error" | "info" | "warning"
  title: string
  message: string
}

export function NotificationToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    const handleNotification = (event: CustomEvent) => {
      const notification = event.detail
      const id = Math.random().toString(36).substr(2, 9)

      setToasts((prev) => [...prev, { ...notification, id }])

      // Auto remove after 5 seconds
      setTimeout(() => {
        removeToast(id)
      }, 5000)
    }

    window.addEventListener("notification", handleNotification as EventListener)
    return () => window.removeEventListener("notification", handleNotification as EventListener)
  }, [])

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      default:
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`p-4 rounded-lg shadow-lg flex items-start gap-3 max-w-sm glass-border ${
            toast.type === "success"
              ? "bg-green-500/10 border-green-500/30"
              : toast.type === "error"
                ? "bg-red-500/10 border-red-500/30"
                : "bg-blue-500/10 border-blue-500/30"
          }`}
        >
          {getIcon(toast.type)}
          <div className="flex-1">
            <h4 className="font-semibold">{toast.title}</h4>
            <p className="text-sm opacity-90">{toast.message}</p>
          </div>
          <button onClick={() => removeToast(toast.id)} className="mt-1">
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
