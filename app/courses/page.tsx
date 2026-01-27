import type { Metadata } from "next"
import CoursesClientPage from "./client-page"

export const metadata: Metadata = {
  title: "دوراتنا - Innovologia",
  description: "دورات معتمدة للتحضير لشهادات معهد الابتكار العالمي",
}

export default function CoursesPage() {
  return <CoursesClientPage />
}
