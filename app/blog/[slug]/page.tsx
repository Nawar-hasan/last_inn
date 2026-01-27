import { SiteHeader } from "@/components/site-header"
import type { Metadata } from "next"
import { Calendar, Clock, Heart, MessageCircle, Share2, User } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"

const blogPosts = {
  "innovation-culture-building": {
    id: 1,
    title: "كيف تبني ثقافة الابتكار في مؤسستك",
    excerpt: "الابتكار ليس حدثاً عابراً، بل ثقافة مستدامة تحتاج إلى بيئة داعمة وقيادة ملهمة.",
    image: "/blog/innovation-culture.jpg",
    date: "2025-01-15",
    readTime: "8 دقائق",
    author: "أسامة بدندي",
    likes: 124,
    comments: 23,
    content: `
      <p>الابتكار ليس مجرد كلمة رنانة أو حدث يحصل مرة في السنة. إنه ثقافة حية تتنفسها المؤسسة في كل قرار وكل مشروع. لكن كيف تبني هذه الثقافة؟</p>

      <h2>1. القيادة الملهمة</h2>
      <p>كل تحول ثقافي يبدأ من القمة. القيادة يجب أن تؤمن بالابتكار وتعيشه، لا أن تتحدث عنه فقط. عندما يرى الموظفون أن القادة يجربون أفكاراً جديدة ويتقبلون الفشل كجزء من التعلم، سيشعرون بالأمان للتجربة.</p>

      <h2>2. بيئة آمنة للتجربة</h2>
      <p>الخوف من الفشل هو القاتل الأول للإبداع. المؤسسات المبتكرة تخلق مساحات آمنة حيث يمكن للفرق أن تجرب وتفشل وتتعلم دون خوف من العقاب. الفشل السريع يؤدي إلى التعلم السريع.</p>

      <h2>3. التنوع والتعاون</h2>
      <p>الأفكار المبتكرة غالباً ما تأتي من تقاطع وجهات نظر مختلفة. شجع التعاون بين الأقسام المختلفة، واجمع أشخاصاً من خلفيات وتخصصات متنوعة. التنوع ليس رفاهية، بل ضرورة للابتكار.</p>

      <h2>4. الوقت والموارد</h2>
      <p>الابتكار يحتاج وقتاً وموارد. بعض الشركات مثل Google تخصص 20% من وقت الموظفين لمشاريع جانبية. لا يجب أن تصل إلى هذا الحد، لكن خصص وقتاً منتظماً للتفكير والتجريب.</p>

      <h2>5. الاحتفاء بالنجاح والفشل</h2>
      <p>احتفِ بالأفكار الجديدة، سواء نجحت أم فشلت. شارك قصص الفشل والدروس المستفادة علناً. هذا يخلق ثقافة شفافة حيث يتعلم الجميع من بعضهم البعض.</p>

      <h2>الخلاصة</h2>
      <p>بناء ثقافة الابتكار ليس سهلاً، لكنه ممكن. يبدأ بالتزام القيادة، ويستمر بخلق بيئة آمنة وداعمة للتجربة والتعلم. المؤسسات التي تنجح في ذلك لا تبتكر فقط، بل تصبح الابتكار نفسه.</p>
    `,
  },
  "design-thinking-practical-guide": {
    id: 2,
    title: "دليلك العملي للتفكير التصميمي",
    excerpt: "التفكير التصميمي منهجية قوية لحل المشكلات المعقدة.",
    image: "/blog/design-thinking.jpg",
    date: "2025-01-10",
    readTime: "12 دقيقة",
    author: "أسامة بدندي",
    likes: 189,
    comments: 34,
    content: `
      <p>التفكير التصميمي (Design Thinking) ليس مجرد أداة للمصممين، بل منهجية شاملة لحل المشكلات بطريقة إبداعية ومتمحورة حول الإنسان.</p>

      <h2>ما هو التفكير التصميمي؟</h2>
      <p>التفكير التصميمي هو عملية تكرارية تسعى لفهم المستخدم، وتحدي الافتراضات، وإعادة تعريف المشكلات لإيجاد حلول مبتكرة. يتكون من خمس مراحل أساسية.</p>

      <h2>المراحل الخمس</h2>
      
      <h3>1. التعاطف (Empathize)</h3>
      <p>ابدأ بفهم عميق للأشخاص الذين تصمم لهم. اقضِ وقتاً معهم، استمع لقصصهم، لاحظ تحدياتهم. التعاطف يكشف الاحتياجات الحقيقية، ليس المفترضة.</p>

      <h3>2. التعريف (Define)</h3>
      <p>استخدم ما تعلمته لتحديد المشكلة بدقة. اكتب بيان المشكلة بوضوح: "كيف يمكننا أن...؟". البيان الجيد يلهم الحلول ويوجه الفريق.</p>

      <h3>3. التخيل (Ideate)</h3>
      <p>الآن حان وقت العصف الذهني! ولّد أكبر عدد ممكن من الأفكار دون حكم. الهدف هو الكمية أولاً، ثم الجودة. الأفكار المجنونة مرحب بها.</p>

      <h3>4. النمذجة (Prototype)</h3>
      <p>حوّل أفضل الأفكار إلى نماذج أولية بسيطة. يمكن أن تكون رسوماً، أو نماذج ورقية، أو حتى تمثيلاً. النموذج الأولي يجعل الفكرة ملموسة.</p>

      <h3>5. الاختبار (Test)</h3>
      <p>اختبر نماذجك مع المستخدمين الحقيقيين. راقب ردود أفعالهم، واسألهم، وتعلم. كل اختبار يعطيك رؤى جديدة تحسّن الحل.</p>

      <h2>لماذا التفكير التصميمي؟</h2>
      <p>لأنه يضع الإنسان في المركز، ويشجع التجريب، ويتقبل الفشل كجزء من التعلم. هذه المنهجية تخلق حلولاً حقيقية لمشكلات حقيقية.</p>
    `,
  },
  "creative-brainstorming-techniques": {
    id: 3,
    title: "تقنيات العصف الذهني الإبداعي",
    excerpt: "العصف الذهني أكثر من مجرد جلسة اقتراحات.",
    image: "/blog/brainstorming.jpg",
    date: "2025-01-05",
    readTime: "6 دقائق",
    author: "أسامة بدندي",
    likes: 97,
    comments: 18,
    content: `
      <p>العصف الذهني أداة قوية، لكن معظم الجلسات تفشل لأنها تُدار بشكل خاطئ. إليك تقنيات مجربة لجعل جلساتك أكثر إبداعاً وإنتاجية.</p>

      <h2>1. قاعدة "لا انتقاد"</h2>
      <p>في مرحلة توليد الأفكار، أوقف كل أشكال النقد. حتى التعليق "لكن..." ممنوع. الهدف هو خلق مساحة آمنة حيث تتدفق الأفكار بحرية.</p>

      <h2>2. اجمع الكمية أولاً</h2>
      <p>الكمية تؤدي للجودة. حدد هدفاً طموحاً: 50 فكرة في 30 دقيقة مثلاً. عندما تسعى للكمية، تجبر عقلك على تجاوز الحلول الواضحة.</p>

      <h2>3. تقنية SCAMPER</h2>
      <p>استخدم هذه الأسئلة لتوليد أفكار جديدة: استبدل (Substitute)، ادمج (Combine)، تكيّف (Adapt)، عدّل (Modify)، استخدم لغرض آخر (Put to other use)، احذف (Eliminate)، اعكس (Reverse).</p>

      <h2>4. الأفكار المجنونة</h2>
      <p>شجع الأفكار المجنونة والمستحيلة. غالباً ما تحمل بذور حلول مبتكرة. يمكنك ترويضها لاحقاً، لكن الآن دعها تطير.</p>

      <h2>5. البناء على أفكار الآخرين</h2>
      <p>استخدم عبارة "نعم، و..." بدلاً من "لكن...". خذ فكرة أحدهم وطورها. التعاون يخلق أفكاراً أفضل من التفكير الفردي.</p>

      <h2>الخلاصة</h2>
      <p>العصف الذهني الفعّال يحتاج قواعد واضحة وبيئة آمنة. طبق هذه التقنيات في جلستك القادمة وشاهد الفرق.</p>
    `,
  },
}

const relatedPosts = [
  {
    slug: "innovation-certifications-guide",
    title: "دليل شهادات الابتكار الاحترافية",
    image: "/blog/certifications.jpg",
  },
  {
    slug: "successful-hackathon-organization",
    title: "تنظيم هاكاثون ناجح: من الفكرة للتنفيذ",
    image: "/blog/hackathon.jpg",
  },
  {
    slug: "innovation-trends-2025",
    title: "اتجاهات الابتكار في 2025",
    image: "/blog/trends-2025.jpg",
  },
]

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = blogPosts[params.slug as keyof typeof blogPosts]
  if (!post) return { title: "مقال غير موجود" }

  return {
    title: `${post.title} | Innovologia`,
    description: post.excerpt,
  }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts[params.slug as keyof typeof blogPosts]

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="container mx-auto px-4 py-16 max-w-5xl">
        {/* Hero Image */}
        <div className="relative h-[400px] rounded-3xl overflow-hidden mb-8 liquid-glass-enhanced">
          <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>

        {/* Article Header */}
        <article className="liquid-glass-enhanced rounded-2xl p-8 md:p-12 mb-12">
          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-600 dark:text-white">
            <span className="flex items-center gap-2" style={{ fontFamily: "var(--font-rubik)" }}>
              <User className="h-4 w-4" />
              {post.author}
            </span>
            <span className="flex items-center gap-2" style={{ fontFamily: "var(--font-rubik)" }}>
              <Calendar className="h-4 w-4" />
              {new Date(post.date).toLocaleDateString("ar-EG", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span className="flex items-center gap-2" style={{ fontFamily: "var(--font-rubik)" }}>
              <Clock className="h-4 w-4" />
              {post.readTime}
            </span>
          </div>

          {/* Title */}
          <h1
            className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight"
            style={{ fontFamily: "var(--font-rubik)" }}
          >
            {post.title}
          </h1>

          {/* Engagement Bar */}
          <div className="flex items-center justify-between py-6 border-y border-gray-200 dark:border-white/10 mb-8">
            <div className="flex items-center gap-6">
              <button className="flex items-center gap-2 text-gray-600 dark:text-white hover:text-[#551FBD] dark:hover:text-[#53FBA1] transition-colors">
                <Heart className="h-5 w-5" />
                <span className="font-semibold">{post.likes}</span>
              </button>
              <button className="flex items-center gap-2 text-gray-600 dark:text-white hover:text-[#551FBD] dark:hover:text-[#53FBA1] transition-colors">
                <MessageCircle className="h-5 w-5" />
                <span className="font-semibold">{post.comments}</span>
              </button>
            </div>
            <button className="flex items-center gap-2 text-gray-600 dark:text-white hover:text-[#551FBD] dark:hover:text-[#53FBA1] transition-colors">
              <Share2 className="h-5 w-5" />
              <span className="font-semibold" style={{ fontFamily: "var(--font-rubik)" }}>
                مشاركة
              </span>
            </button>
          </div>

          {/* Content */}
          <div
            className="prose prose-lg dark:prose-invert max-w-none 
                       prose-headings:text-gray-900 dark:prose-headings:text-white
                       prose-headings:font-bold prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
                       prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                       prose-p:text-gray-700 dark:prose-p:text-white prose-p:leading-relaxed prose-p:mb-6
                       prose-strong:text-gray-900 dark:prose-strong:text-white"
            style={{ fontFamily: "var(--font-rubik)" }}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>

        {/* Related Posts */}
        <div className="mt-16">
          <h2
            className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center"
            style={{ fontFamily: "var(--font-rubik)" }}
          >
            مقالات مشابهة
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((related) => (
              <Link
                key={related.slug}
                href={`/blog/${related.slug}`}
                className="group liquid-glass-enhanced rounded-xl overflow-hidden hover:shadow-xl hover:shadow-violet-500/20 transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="relative h-48">
                  <Image
                    src={related.image || "/placeholder.svg"}
                    alt={related.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3
                    className="font-bold text-gray-900 dark:text-white group-hover:text-[#551FBD] dark:group-hover:text-[#53FBA1] transition-colors line-clamp-2"
                    style={{ fontFamily: "var(--font-rubik)" }}
                  >
                    {related.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
