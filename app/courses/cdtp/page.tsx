import type { Metadata } from "next"
import CDTPCourseClient from "./CDTPCourseClient"

export const metadata: Metadata = {
  title: "دورة محترف التفكير التصميمي المعتمد CDTP - Innovologia",
  description: "الدورة التحضيرية لامتحان شهادة محترف التفكير التصميمي المعتمد",
}

export default function CDTPCoursePage() {
  return <CDTPCourseClient />
}
