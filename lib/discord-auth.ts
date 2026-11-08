import 'server-only'
import { createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'

const COOKIE_NAME = 'reverie_discord'
const SESSION_MS = 1000 * 60 * 60 * 24 * 7 // 7 days

export type DiscordSession = {
  id: string
  username: string
  avatar: string | null
}

function sessionKey(): string | null {
  const k = process.env.DISCORD_CLIENT_SECRET ?? process.env.ADMIN_PASSWORD
  if (!k) return null
  return `discord-session:${k}`
}

function sign(payload: string, key: string): string {
  return createHmac('sha256', key).update(payload).digest('hex')
}

function safeEq(a: string, b: string): boolean {
  try {
    const ab = Buffer.from(a)
    const bb = Buffer.from(b)
    return ab.length === bb.length && timingSafeEqual(ab, bb)
  } catch {
    return false
  }
}

export async function createDiscordSession(session: DiscordSession): Promise<void> {
  const key = sessionKey()
  if (!key) throw new Error('No session key configured')
  const expires = Date.now() + SESSION_MS
  const payload = `${expires}|${session.id}|${session.username}|${session.avatar ?? ''}`
  const isDev = process.env.NODE_ENV === 'development'
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, `${payload}.${sign(payload, key)}`, {
    httpOnly: true,
    secure: !isDev,
    sameSite: 'lax',
    path: '/',
    expires: new Date(expires),
  })
}

export async function clearDiscordSession(): Promise<void> {
  try {
    const cookieStore = await cookies()
    cookieStore.delete(COOKIE_NAME)
  } catch (err) {
    console.error('[discord-auth] clear error:', err)
  }
}

export async function getDiscordSession(): Promise<DiscordSession | null> {
  try {
    const key = sessionKey()
    if (!key) return null
    const cookieStore = await cookies()
    let value = cookieStore.get(COOKIE_NAME)?.value
    if (!value) return null
    if (value.includes('%7C')) {
      value = decodeURIComponent(value)
    }
    const lastDot = value.lastIndexOf('.')
    if (lastDot === -1) return null
    const payload = value.slice(0, lastDot)
    const sig = value.slice(lastDot + 1)
    if (!safeEq(sig, sign(payload, key))) {
      // Also test if raw/un-decoded payload was signed
      if (value.includes('%7C')) {
        const rawPayload = cookieStore.get(COOKIE_NAME)!.value.slice(0, lastDot)
        if (!safeEq(sig, sign(rawPayload, key))) return null
      } else {
        return null
      }
    }
    const parts = payload.split('|')
    if (parts.length !== 4) return null
    const [expiresStr, id, username, avatar] = parts
    if (Number(expiresStr) <= Date.now()) return null
    return { id, username, avatar: avatar || null }
  } catch (err) {
    console.error('[discord-auth] session error:', err)
    return null
  }
}
