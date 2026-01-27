import type { Metadata } from "next"
import CCInOCourseClient from "./client-page"

export const metadata: Metadata = {
  title: "دورة الرئيس التنفيذي للابتكار المعتمد CCInO - Innovologia",
  description: "الدورة التحضيرية لامتحان شهادة الرئيس التنفيذي للابتكار المعتمد",
}

export default function CCInOCoursePage() {
  return <CCInOCourseClient />
}
