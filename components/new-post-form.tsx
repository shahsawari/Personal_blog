'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PostEditor from './post-editor'
import { createPost } from '@/app/actions/posts'

export default function NewPostForm() {
  const router = useRouter(); const [title, setTitle] = useState(''); const [slug, setSlug] = useState(''); const [excerpt, setExcerpt] = useState(''); const [status, setStatus] = useState('draft'); const [content, setContent] = useState<Record<string, unknown>>({ type: 'doc', content: [{ type: 'paragraph' }] }); const [error, setError] = useState(''); const [saving, setSaving] = useState(false)
  async function submit() { setSaving(true); setError(''); try { await createPost({ title, slug, excerpt, content, status, readingTime: Math.max(1, Math.ceil(JSON.stringify(content).length / 900)) }); router.push('/admin') } catch { setError('ذخیره انجام نشد. اتصال دیتابیس و تنظیمات ادمین را بررسی کنید.') } finally { setSaving(false) } }
  return <div className="space-y-6"><div className="grid gap-4 md:grid-cols-2"><input required value={title} onChange={(e) => { setTitle(e.target.value); if (!slug) setSlug(e.target.value.toLowerCase().trim().replace(/[^a-z0-9آ-ی]+/g, '-').replace(/^-|-$/g, '')) }} placeholder="عنوان نوشته" className="h-12 rounded-xl border border-border bg-background px-4 text-base" /><input required value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="slug-url" className="h-12 rounded-xl border border-border bg-background px-4 text-base" /></div><textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="خلاصه کوتاه نوشته" rows={3} className="w-full rounded-xl border border-border bg-background p-4 text-base" /><PostEditor onChange={setContent} /><div className="flex flex-wrap items-center gap-3"><select value={status} onChange={(e) => setStatus(e.target.value)} className="h-11 rounded-xl border border-border bg-background px-3"><option value="draft">پیش‌نویس</option><option value="published">انتشار</option></select><button onClick={submit} disabled={saving || !title || !slug} className="h-11 rounded-xl bg-primary px-5 font-medium text-primary-foreground disabled:opacity-50">{saving ? 'در حال ذخیره…' : 'ذخیره نوشته'}</button>{error && <p role="alert" className="text-sm text-destructive">{error}</p>}</div></div>
}
