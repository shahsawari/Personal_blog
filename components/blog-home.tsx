'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowUpLeft, Clock3, Menu, Moon, Search, Sun, X } from 'lucide-react'

export type PostCard = {
  title: string
  excerpt: string
  slug: string
  date: string
  time: string
  cover: string | null
  category: string
  tags: string[]
}

export function BlogHome({ posts }: { posts: PostCard[] }) {
  const [dark, setDark] = useState(false)
  const [menu, setMenu] = useState(false)
  return (
    <div className={dark ? 'dark min-h-screen bg-background text-foreground' : 'min-h-screen bg-background text-foreground'} dir="rtl">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 md:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="صفحه اصلی">
          <span className="flex size-10 items-center justify-center rounded-full bg-primary font-mono text-sm text-primary-foreground">ن</span>
          <span className="font-sans text-sm font-bold tracking-tight">sevo personal blog</span>
        </Link>
        <nav className={`${menu ? 'flex' : 'hidden'} absolute inset-x-4 top-20 z-20 flex-col gap-1 rounded-2xl border bg-card p-3 shadow-xl md:static md:flex md:flex-row md:items-center md:gap-8 md:border-0 md:bg-transparent md:p-0 md:shadow-none`}>
          <Link className="rounded-lg px-3 py-2 text-sm text-foreground/70 hover:bg-muted hover:text-foreground" href="#latest">نوشته‌ها</Link>
          <Link className="rounded-lg px-3 py-2 text-sm text-foreground/70 hover:bg-muted hover:text-foreground" href="/about">درباره من</Link>
          <Link className="rounded-lg px-3 py-2 text-sm text-foreground/70 hover:bg-muted hover:text-foreground" href="/admin">ورود مدیریت</Link>
        </nav>
        <div className="flex items-center gap-2">
          <button className="flex size-11 items-center justify-center rounded-full border border-border hover:bg-muted" aria-label="جستجو"><Search className="size-4" /></button>
          <button onClick={() => setDark(!dark)} className="hidden size-11 items-center justify-center rounded-full border border-border hover:bg-muted sm:flex" aria-label="تغییر پوسته">{dark ? <Sun className="size-4" /> : <Moon className="size-4" />}</button>
          <button onClick={() => setMenu(!menu)} className="flex size-11 items-center justify-center rounded-full border border-border md:hidden" aria-label="منوی سایت">{menu ? <X className="size-5" /> : <Menu className="size-5" />}</button>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl gap-10 px-5 pb-20 pt-14 md:grid-cols-[1.05fr_.95fr] md:items-center md:px-8 md:pb-28 md:pt-24">
          <div>
            <p className="mb-6 flex items-center gap-2 text-sm text-primary"><span className="size-2 rounded-full bg-primary" /> خوش آمدید، اینجا گوشه‌ای برای فکر کردن است</p>
            <h1 className="max-w-xl text-balance font-sans text-4xl font-bold leading-[1.35] tracking-tight md:text-6xl">فکرها، تجربه‌ها و چیزهایی که ارزش <span className="text-primary">به یاد سپردن</span> دارند.</h1>
            <p className="mt-7 max-w-lg text-pretty text-base leading-8 text-muted-foreground md:text-lg">من سروش هستم؛ می‌نویسم تا جهان اطرافم را بهتر بفهمم. درباره زندگی، آدم‌ها و پرسش‌هایی که جواب ساده‌ای ندارند.</p>
            <div className="mt-9 flex flex-wrap items-center gap-4"><Link href="#latest" className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground hover:opacity-90">خواندن نوشته‌ها <ArrowLeft className="size-4" /></Link><span className="text-sm text-muted-foreground">هر دو هفته یک یادداشت تازه</span></div>
          </div>
          <div className="relative overflow-hidden rounded-[2rem] border bg-muted shadow-sm"><img src="/images/hero-writing.png" alt="دفتر و قلم روی میز" className="aspect-[4/3] w-full object-cover" /></div>
        </section>

        <section id="latest" className="border-y border-border/70 bg-muted/35"><div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24"><div className="mb-10 flex items-end justify-between gap-4"><div><p className="mb-3 text-sm font-bold text-primary">از آرشیو</p><h2 className="text-3xl font-bold tracking-tight md:text-4xl">آخرین نوشته‌ها</h2></div><Link href="/blog" className="hidden items-center gap-2 text-sm font-bold text-primary sm:flex">مشاهده همه <ArrowLeft className="size-4" /></Link></div><div className="grid gap-6 md:grid-cols-3">{posts.length === 0 ? <p className="col-span-full py-8 text-muted-foreground">هنوز نوشته‌ای منتشر نشده است.</p> : posts.map((post, i) => <Link key={post.slug} href={`/blog/${post.slug}`} className={`${i === 0 ? 'md:col-span-2 md:grid md:grid-cols-[.9fr_1.1fr] md:gap-8' : ''} group rounded-2xl border border-border/80 bg-card p-5 transition hover:-translate-y-1 hover:shadow-lg`}><div className={`${i === 0 ? 'mb-5 md:mb-0' : 'mb-5'} aspect-[16/10] overflow-hidden rounded-xl bg-primary/10`}>{post.cover ? <img src={post.cover} alt={post.title} className="h-full w-full object-cover" /> : <div className="flex h-full items-end bg-[linear-gradient(135deg,hsl(var(--primary)/.12),hsl(var(--accent)/.5))] p-4"><span className="text-sm font-bold text-primary">{post.category}</span></div>}</div><div className="flex flex-col"><div className="mb-4 flex flex-wrap gap-2">{post.tags.map(tag => <span key={tag} className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">#{tag}</span>)}</div><h3 className="text-xl font-bold leading-8 group-hover:text-primary">{post.title}</h3><p className="mt-3 line-clamp-2 text-sm leading-7 text-muted-foreground">{post.excerpt}</p><div className="mt-auto flex items-center gap-3 pt-7 text-xs text-muted-foreground"><span>{post.date}</span><span className="size-1 rounded-full bg-border" /><span className="flex items-center gap-1"><Clock3 className="size-3" /> {post.time}</span></div></div></Link>)}</div></div></section>

        <section id="about" className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-20 md:flex-row md:items-end md:justify-between md:px-8 md:py-28"><div className="max-w-xl"><p className="mb-3 text-sm font-bold text-primary">کمی درباره اینجا</p><h2 className="text-3xl font-bold leading-10 tracking-tight">این وب‌سایت یک دفتر عمومی‌ست؛ جایی برای آزمودن ایده‌ها.</h2><p className="mt-5 leading-8 text-muted-foreground">نوشته‌ها حاصل مکث‌های کوتاه میان کار و زندگی‌اند. اگر چیزی در اینجا برایتان مفید بود، آن را با کسی که دوستش دارید به اشتراک بگذارید.</p></div><Link href="/about" className="inline-flex items-center gap-2 text-sm font-bold text-primary">بیشتر درباره من <ArrowLeft className="size-4" /></Link></section>
      </main>
      <footer className="border-t border-border/70"><div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between md:px-8"><span>© ۱۴۰۳ · sevo personal blog</span><a href="https://t.me/srvoshna" target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">کانال تلگرام: srvoshna@</a></div></footer>
    </div>
  )
}

export default BlogHome
