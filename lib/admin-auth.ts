import 'server-only'
import { createHmac, randomBytes, timingSafeEqual, pbkdf2Sync } from 'node:crypto'
import { cookies } from 'next/headers'
import {
  findAdminUser,
  readAdminUsers,
  type AdminUser,
} from './store'

const COOKIE_NAME = 'reverie_admin'
const SESSION_MS = 1000 * 60 * 60 * 12

function sessionSecret() {
  const p = process.env.ADMIN_PASSWORD
  if (!p) return null
  return `reverie-session:${p}`
}

function sign(payload: string, key: string) {
  return createHmac('sha256', key).update(payload).digest('hex')
}

function safeEq(a: string, b: string) {
  const ab = Buffer.from(a)
  const bb = Buffer.from(b)
  return ab.length === bb.length && timingSafeEqual(ab, bb)
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex')
  const hash = pbkdf2Sync(password, salt, 200_000, 32, 'sha256').toString('hex')
  return `${salt}:${hash}`
}

export function verifyHash(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':')
  if (!salt || !hash) return false
  const attempt = pbkdf2Sync(password, salt, 200_000, 32, 'sha256').toString('hex')
  const a = Buffer.from(attempt, 'hex')
  const b = Buffer.from(hash, 'hex')
  return a.length === b.length && timingSafeEqual(a, b)
}

export function isAdminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD)
}

export function verifyOwnerPassword(input: string): boolean {
  const password = process.env.ADMIN_PASSWORD
  if (!password) return false
  const a = createHmac('sha256', 'cmp').update(input).digest()
  const b = createHmac('sha256', 'cmp').update(password).digest()
  return timingSafeEqual(a, b)
}

export async function createAdminSession(username: string, isOwner: boolean) {
  const key = sessionSecret()
  if (!key) throw new Error('ADMIN_PASSWORD not configured')
  const expires = Date.now() + SESSION_MS
  const payload = `${expires}|${username}|${isOwner ? '1' : '0'}`
  const isDev = process.env.NODE_ENV === 'development'
  ;(await cookies()).set(COOKIE_NAME, `${payload}.${sign(payload, key)}`, {
    httpOnly: true,
    secure: !isDev,
    sameSite: 'lax',
    path: '/',
    expires: new Date(expires),
  })
}

export async function clearAdminSession() {
  ;(await cookies()).delete(COOKIE_NAME)
}

export type SessionInfo = { username: string; isOwner: boolean } | null

export async function getSession(): Promise<SessionInfo> {
  try {
    const key = sessionSecret()
    if (!key) return null
    let value = (await cookies()).get(COOKIE_NAME)?.value
    if (!value) return null
    if (value.includes('%7C')) {
      value = decodeURIComponent(value)
    }
    const lastDot = value.lastIndexOf('.')
    if (lastDot === -1) return null
    const payload = value.slice(0, lastDot)
    const signature = value.slice(lastDot + 1)
    if (!safeEq(signature, sign(payload, key))) return null
    const parts = payload.split('|')
    if (parts.length !== 3) return null
    const [expiresStr, username, ownerFlag] = parts
    if (Number(expiresStr) <= Date.now()) return null
    return { username, isOwner: ownerFlag === '1' }
  } catch (err) {
    console.error('[admin-auth] getSession error:', err)
    return null
  }
}

export async function isAdmin(): Promise<boolean> {
  return (await getSession()) !== null
}

export async function requireAdmin(): Promise<SessionInfo> {
  const session = await getSession()
  if (!session) throw new Error('Unauthorized')
  return session
}

export async function requireOwner(): Promise<void> {
  const session = await getSession()
  if (!session?.isOwner) throw new Error('Owner only')
}

export function getAdminUsers(): Omit<AdminUser, 'passwordHash'>[] {
  return readAdminUsers().map(({ passwordHash: _, ...rest }) => rest)
}
