'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import { useState } from 'react'

export default function PostEditor({ initialContent, onChange }: { initialContent?: Record<string, unknown>; onChange: (content: Record<string, unknown>) => void }) {
  const [saved, setSaved] = useState(false)
  const [uploading, setUploading] = useState(false)
  async function insertImage(file: File) {
    setUploading(true)
    try {
      const body = new FormData()
      body.append('file', file)
      const response = await fetch('/api/upload', { method: 'POST', body })
      const data = await response.json().catch(() => ({}))
      if (!response.ok || !data.url) throw new Error(data.error || 'آپلود تصویر انجام نشد.')
      editor?.chain().focus().setImage({ src: data.url, alt: file.name.replace(/\.[^.]+$/, '') }).run()
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'آپلود تصویر انجام نشد.')
    } finally {
      setUploading(false)
    }
  }
  const editor = useEditor({
    extensions: [StarterKit, Underline, Link.configure({ openOnClick: false }), Image.configure({ allowBase64: false }), TextAlign.configure({ types: ['heading', 'paragraph'] })],
    content: initialContent ?? { type: 'doc', content: [{ type: 'paragraph' }] },
    immediatelyRender: false,
    editorProps: {
      handleDrop: (_view, event) => {
        const file = event.dataTransfer?.files?.[0]
        if (!file?.type.startsWith('image/')) return false
        event.preventDefault()
        void insertImage(file)
        return true
      },
      handlePaste: (_view, event) => {
        const file = Array.from(event.clipboardData?.files ?? []).find((item) => item.type.startsWith('image/'))
        if (!file) return false
        event.preventDefault()
        void insertImage(file)
        return true
      },
    },
    onUpdate: ({ editor: current }) => { setSaved(false); onChange(current.getJSON() as Record<string, unknown>) },
  })
  if (!editor) return <div className="min-h-64 animate-pulse rounded-2xl bg-muted" />
  const button = (label: string, action: () => void, active = false) => <button type="button" aria-label={label} onClick={action} className={`min-h-10 min-w-10 rounded-lg px-2 text-sm ${active ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>{label}</button>
  return <div className="overflow-hidden rounded-2xl border border-border bg-card"><div className="flex flex-wrap gap-1 border-b border-border p-2">{button('Bold', () => editor.chain().focus().toggleBold().run(), editor.isActive('bold'))}{button('Italic', () => editor.chain().focus().toggleItalic().run(), editor.isActive('italic'))}{button('Underline', () => editor.chain().focus().toggleUnderline().run(), editor.isActive('underline'))}{button('Heading 2', () => editor.chain().focus().toggleHeading({ level: 2 }).run(), editor.isActive('heading', { level: 2 }))}{button('Quote', () => editor.chain().focus().toggleBlockquote().run(), editor.isActive('blockquote'))}{button('List', () => editor.chain().focus().toggleBulletList().run(), editor.isActive('bulletList'))}{button('Code', () => editor.chain().focus().toggleCodeBlock().run(), editor.isActive('codeBlock'))}<label className="inline-flex min-h-10 cursor-pointer items-center rounded-lg px-2 text-sm hover:bg-muted">{uploading ? 'آپلود…' : 'تصویر'}<input type="file" accept="image/*" className="sr-only" disabled={uploading} onChange={(event) => { const file = event.target.files?.[0]; if (file) void insertImage(file); event.target.value = '' }} /></label><span className="mx-2 w-px bg-border" />{button('چپ', () => editor.chain().focus().setTextAlign('left').run())}{button('وسط', () => editor.chain().focus().setTextAlign('center').run())}<span className="mr-auto self-center px-2 text-xs text-muted-foreground">{saved ? 'ذخیره شد' : 'تغییرات ذخیره نشده'}</span></div><EditorContent editor={editor} className="prose prose-neutral min-h-72 max-w-none p-5 outline-none dark:prose-invert" /> </div>
}
