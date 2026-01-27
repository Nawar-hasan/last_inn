import { SiteHeader } from "@/components/site-header"
import type { Metadata } from "next"
import { Calendar, Clock, Heart, MessageCircle, Share2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export const metadata: Metadata = {
  title: "المدونة | Innovologia",
  description: "اكتشف أحدث المقالات والأفكار حول الابتكار والتفكير الإبداعي",
}

const blogPosts = [
  {
    id: 1,
    slug: "innovation-culture-building",
    title: "كيف تبني ثقافة الابتكار في مؤسستك",
    excerpt:
      "الابتكار ليس حدثاً عابراً، بل ثقافة مستدامة تحتاج إلى بيئة داعمة وقيادة ملهمة. اكتشف الخطوات العملية لبناء ثقافة ابتكار حقيقية.",
    image: "/blog/innovation-culture.jpg",
    date: "2025-01-15",
    readTime: "8 دقائق",
    likes: 124,
    comments: 23,
  },
  {
    id: 2,
    slug: "design-thinking-practical-guide",
    title: "دليلك العملي للتفكير التصميمي",
    excerpt:
      "التفكير التصميمي منهجية قوية لحل المشكلات المعقدة. تعلم كيف تطبق مراحله الخمس لتحويل التحديات إلى فرص إبداعية.",
    image: "/blog/design-thinking.jpg",
    date: "2025-01-10",
    readTime: "12 دقيقة",
    likes: 189,
    comments: 34,
  },
  {
    id: 3,
    slug: "creative-brainstorming-techniques",
    title: "تقنيات العصف الذهني الإبداعي",
    excerpt:
      "العصف الذهني أكثر من مجرد جلسة اقتراحات. تعرف على أفضل التقنيات والأدوات لتحفيز الإبداع الجماعي وتوليد أفكار مبتكرة.",
    image: "/blog/brainstorming.jpg",
    date: "2025-01-05",
    readTime: "6 دقائق",
    likes: 97,
    comments: 18,
  },
  {
    id: 4,
    slug: "innovation-certifications-guide",
    title: "دليل شهادات الابتكار الاحترافية",
    excerpt:
      "شهادات معهد الابتكار العالمي تفتح لك آفاقاً جديدة. تعرف على مسارات الشهادات المتاحة وكيف تختار المناسب لمسيرتك المهنية.",
    image: "/blog/certifications.jpg",
    date: "2024-12-28",
    readTime: "10 دقائق",
    likes: 156,
    comments: 29,
  },
  {
    id: 5,
    slug: "successful-hackathon-organization",
    title: "تنظيم هاكاثون ناجح: من الفكرة للتنفيذ",
    excerpt: "الهاكاثونات أداة قوية لتحفيز الابتكار. اكتشف أسرار تنظيم هاكاثون ناجح يحقق أهدافك ويلهم المشاركين.",
    image: "/blog/hackathon.jpg",
    date: "2024-12-20",
    readTime: "9 دقائق",
    likes: 142,
    comments: 31,
  },
  {
    id: 6,
    slug: "innovation-trends-2025",
    title: "اتجاهات الابتكار في 2025",
    excerpt:
      "ما هي التوجهات الكبرى التي ستشكل مستقبل الابتكار؟ نظرة شاملة على التقنيات والأساليب الناشئة التي يجب أن تعرفها.",
    image: "/blog/trends-2025.jpg",
    date: "2024-12-15",
    readTime: "11 دقيقة",
    likes: 213,
    comments: 45,
  },
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="container mx-auto px-4 py-16 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <h1
            className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4"
            style={{ fontFamily: "var(--font-rubik)" }}
          >
            المدونة
          </h1>
          <p
            className="text-xl text-gray-700 dark:text-white max-w-2xl mx-auto leading-relaxed"
            style={{ fontFamily: "var(--font-rubik)" }}
          >
            أفكار ملهمة وقصص نجاح وأدوات عملية لرحلتك في عالم الابتكار
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <article className="liquid-glass-enhanced rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-violet-500/20 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2 h-full flex flex-col">
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  {/* Meta */}
                  <div className="flex items-center gap-4 mb-3 text-sm text-gray-600 dark:text-white">
                    <span className="flex items-center gap-1" style={{ fontFamily: "var(--font-rubik)" }}>
                      <Calendar className="h-4 w-4" />
                      {new Date(post.date).toLocaleDateString("ar-EG", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                    <span className="flex items-center gap-1" style={{ fontFamily: "var(--font-rubik)" }}>
                      <Clock className="h-4 w-4" />
                      {post.readTime}
                    </span>
                  </div>

                  {/* Title */}
                  <h2
                    className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-[#551FBD] dark:group-hover:text-[#53FBA1] transition-colors line-clamp-2"
                    style={{ fontFamily: "var(--font-rubik)" }}
                  >
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  <p
                    className="text-gray-700 dark:text-white leading-relaxed mb-4 flex-1 line-clamp-3"
                    style={{ fontFamily: "var(--font-rubik)" }}
                  >
                    {post.excerpt}
                  </p>

                  {/* Engagement */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-white/10">
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-white">
                      <span className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        {post.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        {post.comments}
                      </span>
                    </div>
                    <Share2 className="h-4 w-4 text-gray-600 dark:text-white hover:text-[#551FBD] dark:hover:text-[#53FBA1] transition-colors cursor-pointer" />
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <button
            className="px-8 py-4 bg-gradient-to-r from-[#551FBD] to-[#7C3AED] text-white font-bold rounded-full
                       hover:shadow-[0_0_30px_rgba(85,31,189,0.5)] hover:scale-105 transition-all duration-300"
            style={{ fontFamily: "var(--font-rubik)" }}
          >
            تحميل المزيد من المقالات
          </button>
        </div>
      </main>
    </div>
  )
}
