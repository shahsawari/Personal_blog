import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { list } from '@vercel/blob'
import { ArrowRight, ImageIcon } from 'lucide-react'
import { COOKIE_NAME, isValidAdminSession } from '@/lib/admin-auth'

export default async function MediaPage() {
  const jar = await cookies()
  if (!isValidAdminSession(jar.get(COOKIE_NAME)?.value)) redirect('/login')
  const { blobs } = await list({ prefix: 'blog/' }).catch(() => ({ blobs: [] }))
  return <main className="min-h-screen bg-background paper-grain px-4 py-8 sm:px-8" dir="rtl"><div className="mx-auto max-w-6xl"><Link href="/admin" className="inline-flex min-h-11 items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowRight data-icon="inline-start" />بازگشت به داشبورد</Link><header className="mt-8 flex flex-col gap-3 border-b border-border pb-6"><p className="text-sm font-bold text-primary">کتابخانه رسانه</p><h1 className="text-3xl font-black">تصاویر سایت</h1><p className="text-sm text-muted-foreground">تصاویر آپلودشده از Vercel Blob در اینجا قابل مشاهده‌اند.</p></header>{blobs.length === 0 ? <div className="mt-8 rounded-2xl border border-dashed border-border bg-card p-12 text-center"><ImageIcon className="mx-auto size-10 text-muted-foreground" /><p className="mt-4 font-bold">هنوز تصویری آپلود نشده است</p><p className="mt-2 text-sm text-muted-foreground">هنگام ساخت یا ویرایش پست، تصویر جلد را از فرم انتخاب کنید.</p></div> : <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">{blobs.map((blob) => <figure key={blob.url} className="overflow-hidden rounded-2xl border border-border bg-card"><Image src={blob.url} alt={blob.pathname} width={600} height={600} unoptimized className="aspect-square w-full object-cover" /><figcaption className="truncate p-3 text-xs text-muted-foreground">{blob.pathname.replace('blog/', '')}</figcaption></figure>)}</div>}</div></main>
}
