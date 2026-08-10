'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PostEditor from './post-editor'
import { createPost, updatePost, type PostInput } from '@/app/actions/posts'

type InitialPost = { id: string; title: string; slug: string; excerpt: string; content: Record<string, unknown>; coverImage: string | null; status: string }

export default function NewPostForm({ initialPost }: { initialPost?: InitialPost }) {
  const router = useRouter()
  const [title, setTitle] = useState(initialPost?.title ?? '')
  const [slug, setSlug] = useState(initialPost?.slug ?? '')
  const [excerpt, setExcerpt] = useState(initialPost?.excerpt ?? '')
  const [coverImage, setCoverImage] = useState<string | null>(initialPost?.coverImage ?? null)
  const [uploading, setUploading] = useState(false)
  async function uploadCover(file: File) { setUploading(true); try { const body = new FormData(); body.append('file', file); const response = await fetch('/api/upload', { method: 'POST', body }); const data = await response.json(); if (!response.ok) throw new Error(data.error); setCoverImage(data.url) } catch (error) { setError(error instanceof Error ? error.message : 'آپلود تصویر انجام نشد.') } finally { setUploading(false) } }
  const [status, setStatus] = useState<'draft' | 'published'>(initialPost?.status === 'published' ? 'published' : 'draft')
  const [content, setContent] = useState<Record<string, unknown>>(initialPost?.content ?? { type: 'doc', content: [{ type: 'paragraph' }] })
  const [error, setError] = useState(''); const [saving, setSaving] = useState(false)
  async function submit() {
    setSaving(true); setError('')
    const input: PostInput = { title, slug, excerpt, content, coverImage, status, readingTime: Math.max(1, Math.ceil(JSON.stringify(content).length / 900)) }
    try { if (initialPost) await updatePost(initialPost.id, input); else await createPost(input); router.push('/admin'); router.refresh() } catch { setError('ذخیره انجام نشد. عنوان و slug را بررسی کنید.') } finally { setSaving(false) }
  }
  return <div className="flex flex-col gap-6"><div className="grid gap-4 md:grid-cols-2"><input required value={title} onChange={(e) => { setTitle(e.target.value); if (!initialPost && !slug) setSlug(e.target.value.toLowerCase().trim().replace(/[^a-z0-9آ-ی]+/g, '-').replace(/^-|-$/g, '')) }} placeholder="عنوان نوشته" className="min-h-12 rounded-xl border border-border bg-background px-4 text-base" /><input required value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="slug-url" className="min-h-12 rounded-xl border border-border bg-background px-4 text-base" /></div><textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="خلاصه کوتاه نوشته" rows={3} className="w-full rounded-xl border border-border bg-background p-4 text-base" /><div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4"><div className="flex items-center justify-between gap-3"><label htmlFor="cover-image" className="font-medium">تصویر جلد</label>{coverImage && <button type="button" onClick={() => setCoverImage(null)} className="text-sm text-destructive">حذف تصویر</button>}</div>{coverImage ? <Image src={coverImage} alt="پیش‌نمایش تصویر جلد" width={1200} height={525} sizes="(max-width: 768px) 100vw, 768px" className="aspect-[16/7] w-full rounded-xl object-cover" /> : <p className="text-sm text-muted-foreground">برای هر نوشته یک تصویر اختصاصی انتخاب کنید.</p>}<input id="cover-image" type="file" accept="image/*" disabled={uploading} onChange={(e) => { const file = e.target.files?.[0]; if (file) void uploadCover(file) }} className="min-h-11 text-base file:mr-3 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-primary-foreground" />{uploading && <p className="text-sm text-muted-foreground">در حال آپلود تصویر…</p>}</div><PostEditor initialContent={content} onChange={setContent} /><div className="flex flex-wrap items-center gap-3"><select value={status} onChange={(e) => setStatus(e.target.value as 'draft' | 'published')} className="min-h-11 rounded-xl border border-border bg-background px-3 text-base"><option value="draft">پیش‌نویس</option><option value="published">انتشار</option></select><button onClick={submit} disabled={saving || !title || !slug} className="min-h-11 rounded-xl bg-primary px-5 font-medium text-primary-foreground disabled:opacity-50">{saving ? 'در حال ذخیره…' : initialPost ? 'ذخیره تغییرات' : 'ذخیره نوشته'}</button>{error && <p role="alert" className="text-sm text-destructive">{error}</p>}</div></div>
}
