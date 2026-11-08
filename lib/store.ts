/**
 * Upstash Redis store — works on serverless / Netlify.
 * All data lives in Upstash Redis keys.
 */
import { Redis } from '@upstash/redis'
import { randomUUID } from 'node:crypto'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// ── Types ────────────────────────────────────────────────────────────────────

export type Announcement = {
  id: string
  title: string
  content: string
  author: string
  tag: string
  pinned: boolean
  createdAt: string // ISO
}

export type ForumCategory = {
  id: string
  name: string
  description: string
  position: number
  createdAt: string
}

export type ForumTopic = {
  id: string
  categoryId: string
  title: string
  content: string
  author: string
  pinned: boolean
  locked: boolean
  createdAt: string
}

export type ForumReply = {
  id: string
  topicId: string
  author: string
  content: string
  createdAt: string
}

export type StaffMember = {
  id: string
  username: string
  rank: string
  color: string
  position: number
  online: boolean
  createdAt: string
}

export type AdminUser = {
  id: string
  username: string
  passwordHash: string
  isOwner: boolean
  createdAt: string
}

export type StoreData = {
  announcements: Announcement[]
  categories: ForumCategory[]
  topics: ForumTopic[]
  replies: ForumReply[]
  staff: StaffMember[]
  adminUsers: AdminUser[]
  settings: Record<string, unknown>
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const now = () => new Date().toISOString()
const uid = () => randomUUID()

async function readKey<T>(key: string, fallback: T): Promise<T> {
  try {
    const val = await redis.get<T>(key)
    return val ?? fallback
  } catch {
    return fallback
  }
}

async function writeKey<T>(key: string, data: T): Promise<void> {
  await redis.set(key, data)
}

// ── Settings ──────────────────────────────────────────────────────────────────

export async function readSettings(): Promise<Record<string, unknown>> {
  return readKey<Record<string, unknown>>('settings', {})
}

export async function writeSettings(data: Record<string, unknown>): Promise<void> {
  await writeKey('settings', data)
}

// ── Announcements ─────────────────────────────────────────────────────────────

export async function readAnnouncements(): Promise<Announcement[]> {
  return readKey<Announcement[]>('announcements', [])
}

export async function createAnnouncement(fields: Omit<Announcement, 'id' | 'createdAt'>): Promise<Announcement> {
  const list = await readAnnouncements()
  const item: Announcement = { ...fields, id: uid(), createdAt: now() }
  await writeKey('announcements', [item, ...list])
  return item
}

export async function updateAnnouncement(id: string, patch: Partial<Announcement>): Promise<void> {
  const list = (await readAnnouncements()).map((a) => (a.id === id ? { ...a, ...patch } : a))
  await writeKey('announcements', list)
}

export async function deleteAnnouncement(id: string): Promise<void> {
  await writeKey('announcements', (await readAnnouncements()).filter((a) => a.id !== id))
}

// ── Forum categories ──────────────────────────────────────────────────────────

export async function readCategories(): Promise<ForumCategory[]> {
  const cats = await readKey<ForumCategory[]>('categories', [])
  if (cats.length > 0) return cats
  const seeds: ForumCategory[] = [
    { id: uid(), name: 'Suggestions', description: 'Share your ideas to improve the server.', position: 1, createdAt: now() },
    { id: uid(), name: 'General Discussion', description: 'Chat about anything and everything.', position: 2, createdAt: now() },
    { id: uid(), name: 'Bug Reports', description: 'Report bugs and issues you encounter in-game.', position: 3, createdAt: now() },
    { id: uid(), name: 'Guides', description: 'Tutorials and tips from the community.', position: 4, createdAt: now() },
    { id: uid(), name: 'Off-Topic', description: "Everything that doesn't fit elsewhere.", position: 5, createdAt: now() },
  ]
  await writeKey('categories', seeds)
  return seeds
}

export async function readCategoriesWithSeed(): Promise<ForumCategory[]> {
  return readCategories()
}

export async function createCategory(fields: Omit<ForumCategory, 'id' | 'createdAt'>): Promise<ForumCategory> {
  const list = await readCategories()
  const item: ForumCategory = { ...fields, id: uid(), createdAt: now() }
  await writeKey('categories', [...list, item])
  return item
}

export async function deleteCategory(id: string): Promise<void> {
  await writeKey('categories', (await readCategories()).filter((c) => c.id !== id))
  // cascade
  const allTopics = await readTopics()
  const topics = allTopics.filter((t) => t.categoryId === id)
  await writeKey('topics', allTopics.filter((t) => t.categoryId !== id))
  const topicIds = new Set(topics.map((t) => t.id))
  await writeKey('replies', (await readReplies()).filter((r) => !topicIds.has(r.topicId)))
}

// ── Forum topics ──────────────────────────────────────────────────────────────

export async function readTopics(): Promise<ForumTopic[]> {
  return readKey<ForumTopic[]>('topics', [])
}

export async function createTopic(fields: Omit<ForumTopic, 'id' | 'createdAt'>): Promise<ForumTopic> {
  const list = await readTopics()
  const item: ForumTopic = { ...fields, id: uid(), createdAt: now() }
  await writeKey('topics', [item, ...list])
  return item
}

export async function updateTopic(id: string, patch: Partial<ForumTopic>): Promise<void> {
  await writeKey('topics', (await readTopics()).map((t) => (t.id === id ? { ...t, ...patch } : t)))
}

export async function deleteTopic(id: string): Promise<void> {
  await writeKey('topics', (await readTopics()).filter((t) => t.id !== id))
  await writeKey('replies', (await readReplies()).filter((r) => r.topicId !== id))
}

// ── Forum replies ─────────────────────────────────────────────────────────────

export async function readReplies(): Promise<ForumReply[]> {
  return readKey<ForumReply[]>('replies', [])
}

export async function createReply(fields: Omit<ForumReply, 'id' | 'createdAt'>): Promise<ForumReply> {
  const list = await readReplies()
  const item: ForumReply = { ...fields, id: uid(), createdAt: now() }
  await writeKey('replies', [...list, item])
  return item
}

export async function deleteReply(id: string): Promise<void> {
  await writeKey('replies', (await readReplies()).filter((r) => r.id !== id))
}

// ── Staff ─────────────────────────────────────────────────────────────────────

export async function readStaff(): Promise<StaffMember[]> {
  return readKey<StaffMember[]>('staff', [])
}

export async function createStaff(fields: Omit<StaffMember, 'id' | 'createdAt'>): Promise<StaffMember> {
  const list = await readStaff()
  const item: StaffMember = { ...fields, id: uid(), createdAt: now() }
  await writeKey('staff', [...list, item])
  return item
}

export async function updateStaff(id: string, patch: Partial<StaffMember>): Promise<void> {
  await writeKey('staff', (await readStaff()).map((s) => (s.id === id ? { ...s, ...patch } : s)))
}

export async function deleteStaff(id: string): Promise<void> {
  await writeKey('staff', (await readStaff()).filter((s) => s.id !== id))
}

// ── Admin users ───────────────────────────────────────────────────────────────

export async function readAdminUsers(): Promise<AdminUser[]> {
  return readKey<AdminUser[]>('admins', [])
}

export async function findAdminUser(username: string): Promise<AdminUser | null> {
  return (await readAdminUsers()).find((u) => u.username === username) ?? null
}

export async function createAdminUser(fields: Omit<AdminUser, 'id' | 'createdAt'>): Promise<AdminUser> {
  const list = await readAdminUsers()
  if (list.find((u) => u.username === fields.username)) throw new Error('Username exists')
  const item: AdminUser = { ...fields, id: uid(), createdAt: now() }
  await writeKey('admins', [...list, item])
  return item
}

export async function updateAdminUser(id: string, patch: Partial<AdminUser>): Promise<void> {
  await writeKey('admins', (await readAdminUsers()).map((u) => (u.id === id ? { ...u, ...patch } : u)))
}

export async function deleteAdminUser(id: string): Promise<void> {
  await writeKey('admins', (await readAdminUsers()).filter((u) => u.id !== id))
}

// ── Rate-limit helpers (Redis TTL-based) ──────────────────────────────────────

export async function canReply(author: string, cooldownSec = 30): Promise<boolean> {
  const key = 'ratelimit:reply:' + author.toLowerCase()
  const exists = await redis.exists(key)
  if (exists) return false
  await redis.set(key, '1', { ex: cooldownSec })
  return true
}

export async function canPost(author: string, cooldownSec = 120): Promise<boolean> {
  const key = 'ratelimit:post:' + author.toLowerCase()
  const exists = await redis.exists(key)
  if (exists) return false
  await redis.set(key, '1', { ex: cooldownSec })
  return true
}

// ── Tickets ───────────────────────────────────────────────────────────────────

export type TicketStatus = 'open' | 'in-progress' | 'closed'

export type Ticket = {
  id: string
  title: string
  reason: string
  minecraftUser: string
  discordUser: string
  discordUserId?: string
  content: string
  status: TicketStatus
  createdAt: string
}

export async function readTickets(): Promise<Ticket[]> {
  return readKey<Ticket[]>('tickets', [])
}

export async function createTicket(fields: Omit<Ticket, 'id' | 'createdAt' | 'status'> & { discordUserId?: string }): Promise<Ticket> {
  const list = await readTickets()
  const item: Ticket = { ...fields, id: uid(), status: 'open', createdAt: now() }
  await writeKey('tickets', [item, ...list])
  return item
}

export async function updateTicketStatus(id: string, status: TicketStatus): Promise<void> {
  await writeKey('tickets', (await readTickets()).map((t) => (t.id === id ? { ...t, status } : t)))
}

export async function deleteTicket(id: string): Promise<void> {
  await writeKey('tickets', (await readTickets()).filter((t) => t.id !== id))
}

export async function canSubmitTicket(discordUser: string, cooldownSec = 300): Promise<boolean> {
  const key = 'ratelimit:ticket:' + discordUser.toLowerCase()
  const exists = await redis.exists(key)
  if (exists) return false
  await redis.set(key, '1', { ex: cooldownSec })
  return true
}

// ── Ticket Messages ────────────────────────────────────────────────────────────

export type TicketMessage = {
  id: string
  ticketId: string
  authorId: string
  authorName: string
  content: string
  createdAt: string
  isStaff: boolean
}

export async function readTicketMessages(ticketId: string): Promise<TicketMessage[]> {
  return (await readKey<TicketMessage[]>('ticket-messages', [])).filter((m) => m.ticketId === ticketId)
}

export async function createTicketMessage(fields: Omit<TicketMessage, 'id' | 'createdAt'>): Promise<TicketMessage> {
  const all = await readKey<TicketMessage[]>('ticket-messages', [])
  const item: TicketMessage = { ...fields, id: uid(), createdAt: now() }
  await writeKey('ticket-messages', [...all, item])
  return item
}

export async function deleteTicketMessage(id: string): Promise<void> {
  const all = await readKey<TicketMessage[]>('ticket-messages', [])
  await writeKey('ticket-messages', all.filter((m) => m.id !== id))
}
