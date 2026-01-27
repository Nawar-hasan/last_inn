import { SiteHeader } from "@/components/site-header"
import { AppverseFooter } from "@/components/appverse-footer"
import type { Metadata } from "next"
import { Shield } from "lucide-react"

export const metadata: Metadata = {
  title: "سياسة الخصوصية | Innovologia",
  description: "سياسة الخصوصية وحماية البيانات في Innovologia",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#551FBD] to-[#7C3AED] mb-6">
            <Shield className="h-10 w-10 text-white" />
          </div>
          <h1
            className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4"
            style={{ fontFamily: "var(--font-rubik)" }}
          >
            سياسة الخصوصية
          </h1>
          <p className="text-lg text-gray-700 dark:text-white" style={{ fontFamily: "var(--font-rubik)" }}>
            آخر تحديث: يناير 2025
          </p>
        </div>

        {/* Content */}
        <div className="liquid-glass-enhanced rounded-3xl p-8 md:p-12 space-y-8">
          <section>
            <h2
              className="text-3xl font-bold text-gray-900 dark:text-white mb-4"
              style={{ fontFamily: "var(--font-rubik)" }}
            >
              المقدمة
            </h2>
            <p
              className="text-lg text-gray-700 dark:text-white leading-relaxed"
              style={{ fontFamily: "var(--font-rubik)" }}
            >
              في Innovologia، نحن ملتزمون بحماية خصوصيتك وبياناتك الشخصية. توضح هذه السياسة كيفية جمع واستخدام وحماية
              المعلومات التي تقدمها لنا عند استخدام خدماتنا.
            </p>
          </section>

          <section>
            <h2
              className="text-3xl font-bold text-gray-900 dark:text-white mb-4"
              style={{ fontFamily: "var(--font-rubik)" }}
            >
              البيانات التي نجمعها
            </h2>
            <p
              className="text-lg text-gray-700 dark:text-white leading-relaxed mb-4"
              style={{ fontFamily: "var(--font-rubik)" }}
            >
              نقوم بجمع المعلومات التالية:
            </p>
            <ul
              className="custom-list-rtl space-y-3 text-lg text-gray-700 dark:text-white"
              style={{ fontFamily: "var(--font-rubik)" }}
              dir="rtl"
            >
              <li className="list-item-bullet">
                <span className="list-bullet-dot bg-purple-500"></span>
                <span>معلومات الحساب (الاسم، البريد الإلكتروني، كلمة المرور)</span>
              </li>
              <li className="list-item-bullet">
                <span className="list-bullet-dot bg-purple-500"></span>
                <span>معلومات الملف الشخصي (الصورة، السيرة الذاتية، المهارات)</span>
              </li>
              <li className="list-item-bullet">
                <span className="list-bullet-dot bg-purple-500"></span>
                <span>بيانات الاستخدام (التقدم في الدورات، الشهادات، التفاعلات)</span>
              </li>
              <li className="list-item-bullet">
                <span className="list-bullet-dot bg-purple-500"></span>
                <span>معلومات الدفع (عبر مزودي الدفع الآمنين)</span>
              </li>
            </ul>
          </section>

          <section>
            <h2
              className="text-3xl font-bold text-gray-900 dark:text-white mb-4"
              style={{ fontFamily: "var(--font-rubik)" }}
            >
              كيف نستخدم بياناتك
            </h2>
            <p
              className="text-lg text-gray-700 dark:text-white leading-relaxed mb-4"
              style={{ fontFamily: "var(--font-rubik)" }}
            >
              نستخدم المعلومات المجمعة للأغراض التالية:
            </p>
            <ul
              className="custom-list-rtl space-y-3 text-lg text-gray-700 dark:text-white"
              style={{ fontFamily: "var(--font-rubik)" }}
              dir="rtl"
            >
              <li className="list-item-bullet">
                <span className="list-bullet-dot bg-purple-500"></span>
                <span>تقديم وتحسين خدماتنا التعليمية</span>
              </li>
              <li className="list-item-bullet">
                <span className="list-bullet-dot bg-purple-500"></span>
                <span>إدارة حسابك وتتبع تقدمك في الدورات</span>
              </li>
              <li className="list-item-bullet">
                <span className="list-bullet-dot bg-purple-500"></span>
                <span>إصدار الشهادات والاعتمادات</span>
              </li>
              <li className="list-item-bullet">
                <span className="list-bullet-dot bg-purple-500"></span>
                <span>التواصل معك بشأن الدورات والفعاليات</span>
              </li>
              <li className="list-item-bullet">
                <span className="list-bullet-dot bg-purple-500"></span>
                <span>معالجة المدفوعات والاشتراكات</span>
              </li>
              <li className="list-item-bullet">
                <span className="list-bullet-dot bg-purple-500"></span>
                <span>تحسين تجربة المستخدم وتخصيص المحتوى</span>
              </li>
            </ul>
          </section>

          <section>
            <h2
              className="text-3xl font-bold text-gray-900 dark:text-white mb-4"
              style={{ fontFamily: "var(--font-rubik)" }}
            >
              حماية البيانات
            </h2>
            <p
              className="text-lg text-gray-700 dark:text-white leading-relaxed"
              style={{ fontFamily: "var(--font-rubik)" }}
            >
              نستخدم تقنيات أمان متقدمة لحماية بياناتك، بما في ذلك التشفير والمصادقة الآمنة. لا نشارك معلوماتك الشخصية
              مع أطراف ثالثة إلا بموافقتك الصريحة أو عند الضرورة القانونية.
            </p>
          </section>

          <section>
            <h2
              className="text-3xl font-bold text-gray-900 dark:text-white mb-4"
              style={{ fontFamily: "var(--font-rubik)" }}
            >
              حقوقك
            </h2>
            <p
              className="text-lg text-gray-700 dark:text-white leading-relaxed mb-4"
              style={{ fontFamily: "var(--font-rubik)" }}
            >
              لديك الحق في:
            </p>
            <ul
              className="custom-list-rtl space-y-3 text-lg text-gray-700 dark:text-white"
              style={{ fontFamily: "var(--font-rubik)" }}
              dir="rtl"
            >
              <li className="list-item-bullet">
                <span className="list-bullet-dot bg-purple-500"></span>
                <span>الوصول إلى بياناتك الشخصية</span>
              </li>
              <li className="list-item-bullet">
                <span className="list-bullet-dot bg-purple-500"></span>
                <span>تصحيح أو تحديث معلوماتك</span>
              </li>
              <li className="list-item-bullet">
                <span className="list-bullet-dot bg-purple-500"></span>
                <span>حذف حسابك وبياناتك</span>
              </li>
              <li className="list-item-bullet">
                <span className="list-bullet-dot bg-purple-500"></span>
                <span>الاعتراض على معالجة بياناتك</span>
              </li>
              <li className="list-item-bullet">
                <span className="list-bullet-dot bg-purple-500"></span>
                <span>طلب نسخة من بياناتك</span>
              </li>
            </ul>
          </section>

          <section>
            <h2
              className="text-3xl font-bold text-gray-900 dark:text-white mb-4"
              style={{ fontFamily: "var(--font-rubik)" }}
            >
              الاتصال بنا
            </h2>
            <p
              className="text-lg text-gray-700 dark:text-white leading-relaxed"
              style={{ fontFamily: "var(--font-rubik)" }}
            >
              لأي استفسارات حول سياسة الخصوصية أو للاستفسار عن بياناتك، يرجى التواصل معنا عبر:
              <br />
              البريد الإلكتروني: privacy@innovologia.com
            </p>
          </section>
        </div>
      </main>

      <AppverseFooter />
    </div>
  )
}
