import Link from 'next/link'
import { ArrowLeft, ArrowUpLeft } from 'lucide-react'

export const metadata = {
  title: 'درباره من | sevo personal blog',
  description: 'کمی درباره سروش و این وبلاگ.',
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background px-5 py-8 text-foreground md:px-8 md:py-12" dir="rtl">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" /> بازگشت به خانه</Link>
        <header className="py-16">
          <p className="mb-3 text-sm font-bold text-primary">درباره من</p>
          <h1 className="text-balance text-4xl font-bold leading-[1.45] tracking-tight md:text-6xl">سلام، من سروش‌ام.</h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-9 text-muted-foreground">
            اینجا دفتر عمومی‌ منه؛ جایی برای فکر کردن، نوشتن و آزمودن ایده‌ها. می‌نویسم تا جهان اطرافم را بهتر بفهمم — درباره زندگی، آدم‌ها و پرسش‌هایی که جواب ساده‌ای ندارند.
          </p>
        </header>
        <section className="space-y-6 leading-9 text-foreground/85">
          <p>نوشته‌ها حاصل مکث‌های کوتاه میان کار و زندگی‌اند. اگر چیزی در اینجا برایتان مفید بود، آن را با کسی که دوستش دارید به اشتراک بگذارید.</p>
          <p>برای دنبال کردنِ نوشته‌های تازه، سری به کانال تلگرام بزنید:</p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a href="https://t.me/srvoshna" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-bold text-primary-foreground hover:opacity-90">کانال تلگرام: srvoshna@</a>
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-primary">مشاهده نوشته‌ها <ArrowUpLeft className="size-4" /></Link>
          </div>
        </section>
      </div>
    </main>
  )
}
