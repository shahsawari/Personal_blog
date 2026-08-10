// Seeds the blog post "شماره ۳ — گرم‌تر از ربات‌ها، سردتر از انسان‌ها"
// into the PostgreSQL database using the same drizzle/pg driver as the app.
//
// Usage:
//   DATABASE_URL="postgresql://user:pass@host:5432/db" node scripts/seed-post.mjs
//
// The post is inserted only if the slug does not already exist (idempotent).

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { randomUUID } from 'node:crypto'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { eq } from 'drizzle-orm'
import { boolean, integer, jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

// Mirror of lib/db/schema.ts `posts` table so the script runs as plain ESM
// without a TypeScript loader step.
const posts = pgTable('posts', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  excerpt: text('excerpt'),
  content: jsonb('content').notNull().default({}),
  coverImage: text('cover_image'),
  status: text('status').notNull().default('draft'),
  categoryId: text('category_id'),
  author: text('author').notNull().default('سروش'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  readingTime: integer('reading_time').notNull().default(1),
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  isFeatured: boolean('is_featured').notNull().default(false),
})

const slug = 'shomare-3-garm-tar-az-robot-ha-sard-tar-az-ensan-ha'
const title = 'شماره ۳ — گرم‌تر از ربات‌ها، سردتر از انسان‌ها'
const excerpt =
  'بدترین اتفاق، مردن نیست؛ بلکه گم‌کردن خود در مسیر زندگیه. یادداشت‌هایی درباره سرما، عبور، و آن کبوتری که شبیه من بود.'

function loadContent() {
  const raw = readFileSync(join(root, 'scripts', 'post-content.json'), 'utf8')
  return JSON.parse(raw)
}

function countChars(node, acc = { n: 0 }) {
  if (node.text) acc.n += node.text.length
  if (Array.isArray(node.content)) node.content.forEach((c) => countChars(c, acc))
  return acc.n
}

async function main() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    console.error('DATABASE_URL is not set. Export it before running this script.')
    process.exit(1)
  }

  const content = loadContent()
  const charCount = countChars(content)
  const readingTime = Math.max(1, Math.ceil(charCount / 350))

  const pool = new Pool({ connectionString })
  const db = drizzle(pool, { schema: { posts } })

  const existing = await db.select({ id: posts.id }).from(posts).where(eq(posts.slug, slug)).limit(1)
  if (existing.length > 0) {
    console.log(`Post "${slug}" already exists — skipping insert.`)
    await pool.end()
    return
  }

  const now = new Date()
  await db.insert(posts).values({
    id: randomUUID(),
    title,
    slug,
    excerpt,
    content,
    coverImage: '/images/elderly-man.jpg',
    status: 'published',
    author: 'سروش',
    publishedAt: now,
    updatedAt: now,
    readingTime,
  })

  console.log(`Inserted post "${slug}" (${charCount} chars, ~${readingTime} min read).`)
  await pool.end()
}

main().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
