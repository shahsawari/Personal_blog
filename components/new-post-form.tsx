'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PostEditor from './post-editor'
import { createPost, updatePost, type PostInput } from '@/app/actions/posts'

type InitialPost = { id: string; title: string; slug: string; excerpt: string; content: Record<string, unknown>; status: string }

export default function NewPostForm({ initialPost }: { initialPost?: InitialPost }) {
  const router = useRouter()
  const [title, setTitle] = useState(initialPost?.title ?? '')
  const [slug, setSlug] = useState(initialPost?.slug ?? '')
  const [excerpt, setExcerpt] = useState(initialPost?.excerpt ?? '')
  const [status, setStatus] = useState<'draft' | 'published'>(initialPost?.status === 'published' ? 'published' : 'draft')
  const [content, setContent] = useState<Record<string, unknown>>(initialPost?.content ?? { type: 'doc', content: [{ type: 'paragraph' }] })
  const [error, setError] = useState(''); const [saving, setSaving] = useState(false)
  async function submit() {
    setSaving(true); setError('')
    const input: PostInput = { title, slug, excerpt, content, status, readingTime: Math.max(1, Math.ceil(JSON.stringify(content).length / 900)) }
    try { if (initialPost) await updatePost(initialPost.id, input); else await createPost(input); router.push('/admin'); router.refresh() } catch { setError('ذخیره انجام نشد. عنوان و slug را بررسی کنید.') } finally { setSaving(false) }
  }
  return <div className="flex flex-col gap-6"><div className="grid gap-4 md:grid-cols-2"><input required value={title} onChange={(e) => { setTitle(e.target.value); if (!initialPost && !slug) setSlug(e.target.value.toLowerCase().trim().replace(/[^a-z0-9آ-ی]+/g, '-').replace(/^-|-$/g, '')) }} placeholder="عنوان نوشته" className="min-h-12 rounded-xl border border-border bg-background px-4 text-base" /><input required value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="slug-url" className="min-h-12 rounded-xl border border-border bg-background px-4 text-base" /></div><textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="خلاصه کوتاه نوشته" rows={3} className="w-full rounded-xl border border-border bg-background p-4 text-base" /><PostEditor initialContent={content} onChange={setContent} /><div className="flex flex-wrap items-center gap-3"><select value={status} onChange={(e) => setStatus(e.target.value as 'draft' | 'published')} className="min-h-11 rounded-xl border border-border bg-background px-3 text-base"><option value="draft">پیش‌نویس</option><option value="published">انتشار</option></select><button onClick={submit} disabled={saving || !title || !slug} className="min-h-11 rounded-xl bg-primary px-5 font-medium text-primary-foreground disabled:opacity-50">{saving ? 'در حال ذخیره…' : initialPost ? 'ذخیره تغییرات' : 'ذخیره نوشته'}</button>{error && <p role="alert" className="text-sm text-destructive">{error}</p>}</div></div>
}
