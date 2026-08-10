import { createHmac, timingSafeEqual } from 'node:crypto'

const COOKIE_NAME = 'blog_admin_session'
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7

function getConfig() {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD
  const secret = process.env.ADMIN_AUTH_SECRET
  if (!email || !password || !secret) throw new Error('ADMIN_EMAIL, ADMIN_PASSWORD and ADMIN_AUTH_SECRET must be configured')
  return { email, password, secret }
}

function sign(value: string, secret: string) {
  return createHmac('sha256', secret).update(value).digest('base64url')
}

export function verifyAdminCredentials(email: string, password: string) {
  const config = getConfig()
  return email === config.email && password === config.password
}

export function createAdminSession() {
  const { secret } = getConfig()
  const expires = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS
  const payload = `admin.${expires}`
  return `${payload}.${sign(payload, secret)}`
}

export function isValidAdminSession(value?: string) {
  if (!value) return false
  const [subject, expires, signature] = value.split('.')
  if (subject !== 'admin' || !expires || !signature || Number(expires) < Math.floor(Date.now() / 1000)) return false
  const { secret } = getConfig()
  const expected = sign(`${subject}.${expires}`, secret)
  return signature.length === expected.length && timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
}

export { COOKIE_NAME, SESSION_TTL_SECONDS }
