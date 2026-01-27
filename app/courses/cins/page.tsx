import type { Metadata } from "next"
import CInSCourseClient from "./client"

export const metadata: Metadata = {
  title: "دورة استراتيجي الابتكار المعتمد CInS - Innovologia",
  description: "الدورة التحضيرية لامتحان شهادة استراتيجي الابتكار المعتمد من معهد الابتكار العالمي",
}

export default function CInSCoursePage() {
  return <CInSCourseClient />
}
