import type React from "react"
import { StudentSidebar } from "./_components/sidebar"
import { StudentTopbar } from "./_components/topbar"

export const metadata = {
  title: "Student Dashboard | Innovologia",
  description: "لوحة تحكم الطالب - Innovologia",
}

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-background">
      <StudentSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <StudentTopbar />
        <main className="flex-1 overflow-auto">
          <div className="p-6 max-w-7xl mx-auto w-full">{children}</div>
        </main>
      </div>
    </div>
  )
}
