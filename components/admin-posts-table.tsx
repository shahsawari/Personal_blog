'use client'

import Link from 'next/link'
import { useState } from 'react'
import { deletePost } from '@/app/actions/posts'

type AdminPost = { id: string; title: string; slug: string; status: string; updatedAt: Date | null; publishedAt: Date | null }

export default function AdminPostsTable({ posts }: { posts: AdminPost[] }) {
  const [query, setQuery] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)
  const filtered = posts.filter((post) => `${post.title} ${post.slug}`.toLowerCase().includes(query.toLowerCase()))
  async function remove(id: string) {
    if (!window.confirm('این نوشته حذف شود؟')) return
    setDeleting(id)
    try { await deletePost(id); window.location.reload() } finally { setDeleting(null) }
  }
  return <section className="overflow-hidden rounded-2xl border border-border bg-card"><div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-semibold">نوشته‌ها</h2><p className="mt-1 text-sm text-muted-foreground">جستجو، ویرایش یا حذف پست‌ها</p></div><input aria-label="جستجوی نوشته‌ها" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="جستجوی عنوان یا slug" className="min-h-11 rounded-xl border border-border bg-background px-4 text-base sm:w-72" /></div>{filtered.length === 0 ? <p className="p-8 text-center text-muted-foreground">نوشته‌ای پیدا نشد.</p> : <div className="divide-y divide-border">{filtered.map((post) => <div key={post.id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><h3 className="truncate font-medium">{post.title}</h3><p className="mt-1 truncate text-sm text-muted-foreground">/{post.slug}</p></div><div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-muted px-3 py-1 text-xs">{post.status === 'published' ? 'منتشر شده' : 'پیش‌نویس'}</span>{post.status === 'published' && <Link href={`/blog/${post.slug}`} target="_blank" className="min-h-10 rounded-lg border border-border px-3 py-2 text-sm hover:bg-muted">مشاهده</Link>}<Link href={`/admin/edit/${post.id}`} className="min-h-10 rounded-lg border border-border px-3 py-2 text-sm hover:bg-muted">ویرایش</Link><button type="button" disabled={deleting === post.id} onClick={() => remove(post.id)} className="min-h-10 rounded-lg border border-destructive/40 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 disabled:opacity-50">{deleting === post.id ? 'در حال حذف…' : 'حذف'}</button></div></div>)}</div>}</section>
}
