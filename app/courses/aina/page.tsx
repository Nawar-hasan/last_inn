import type { Metadata } from "next"
import AInACoursePage from "./aina-client-page"

export const metadata: Metadata = {
  title: "دورة مقيم الابتكار المعتمد AInA - Innovologia",
  description: "الدورة التحضيرية لامتحان شهادة مقيم الابتكار المعتمد",
}

export default function AInAPage() {
  return <AInACoursePage />
}
