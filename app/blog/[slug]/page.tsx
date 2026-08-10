import Link from 'next/link'
import { notFound } from 'next/navigation'
import { and, eq } from 'drizzle-orm'
import { ArrowLeft, Clock3 } from 'lucide-react'
import { db } from '@/lib/db'
import { posts } from '@/lib/db/schema'

type Props = { params: Promise<{ slug: string }> }

type RichNode = { type?: string; text?: string; content?: RichNode[]; attrs?: { level?: number } }

function renderNode(node: RichNode, index: number) {
  if (node.type === 'heading') {
    const Tag = (`h${Math.min(node.attrs?.level ?? 2, 3)}`) as 'h1' | 'h2' | 'h3'
    const text = node.content?.map((child) => child.text ?? '').join('') ?? ''
    return <Tag key={index} className="mt-10 text-2xl font-bold leading-10">{text}</Tag>
  }
  if (node.type === 'blockquote') return <blockquote key={index} className="my-8 space-y-3 border-r-4 border-primary pr-5 text-xl leading-10 text-muted-foreground">{node.content?.map((child, childIndex) => <p key={childIndex}>{child.content?.map((p) => p.text ?? '').join('')}</p>)}</blockquote>
  if (node.type === 'bulletList' || node.type === 'orderedList') return <ul key={index} className="my-6 list-inside list-disc space-y-3 leading-8">{node.content?.map((item, itemIndex) => <li key={itemIndex}>{item.content?.map((paragraph, paragraphIndex) => renderNode(paragraph, paragraphIndex))}</li>)}</ul>
  if (node.type === 'codeBlock') { const text = node.content?.map((child) => child.text ?? '').join('') ?? ''; return <pre key={index} className="my-8 overflow-x-auto rounded-2xl bg-foreground p-5 text-sm leading-7 text-background"><code>{text}</code></pre> }
  if (node.type === 'image' && node.attrs) return <img key={index} src={String((node.attrs as Record<string, unknown>).src ?? '')} alt={String((node.attrs as Record<string, unknown>).alt ?? '')} className="my-8 w-full rounded-2xl" />
  const text = node.text ?? node.content?.map((child) => child.text ?? '').join('') ?? ''
  return text ? <p key={index} className="my-6 leading-9 text-foreground/85">{text}</p> : null
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const [post] = await db.select().from(posts).where(and(eq(posts.slug, slug), eq(posts.status, 'published'))).limit(1)
  if (!post) notFound()
  const content = post.content as { content?: RichNode[] }
  return <main className="min-h-screen bg-background px-5 py-8 text-foreground md:px-8 md:py-12" dir="rtl"><article className="mx-auto max-w-3xl"><Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">بازگشت به نوشته‌ها <ArrowLeft className="size-4" /></Link><header className="py-16"><div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground"><span>{post.publishedAt?.toLocaleDateString('fa-IR')}</span><span className="size-1 rounded-full bg-border" /><span className="flex items-center gap-1"><Clock3 className="size-4" /> {post.readingTime} دقیقه مطالعه</span></div><h1 className="mt-6 text-balance text-4xl font-bold leading-[1.45] tracking-tight md:text-6xl">{post.title}</h1>{post.excerpt && <p className="mt-6 text-pretty text-lg leading-9 text-muted-foreground">{post.excerpt}</p>}</header>{post.coverImage && <img src={post.coverImage} alt={post.title} className="mb-12 aspect-[16/9] w-full rounded-3xl object-cover" />}<div className="prose prose-lg max-w-none dark:prose-invert">{content.content?.map(renderNode)}</div><footer className="mt-16 border-t border-border pt-8"><Link href="/blog" className="text-sm font-bold text-primary">مشاهده همه نوشته‌ها</Link></footer></article></main>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const [post] = await db.select({ title: posts.title, excerpt: posts.excerpt }).from(posts).where(and(eq(posts.slug, slug), eq(posts.status, 'published'))).limit(1)
  return { title: post?.title ?? 'نوشته پیدا نشد', description: post?.excerpt ?? undefined }
}
