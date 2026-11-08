'use server'

import { revalidatePath } from 'next/cache'
import {
  clearAdminSession,
  createAdminSession,
  hashPassword,
  isAdminConfigured,
  requireAdmin,
  requireOwner,
  verifyHash,
  verifyOwnerPassword,
} from '@/lib/admin-auth'
import {
  createAnnouncement,
  createAdminUser,
  createCategory,
  createReply,
  createStaff,
  createTopic,
  deleteAnnouncement,
  deleteAdminUser,
  deleteCategory,
  deleteReply,
  deleteStaff,
  deleteTopic,
  findAdminUser,
  readAdminUsers,
  readTopics,
  updateAnnouncement,
  updateAdminUser,
  updateStaff,
  updateTopic,
  writeSettings,
} from '@/lib/store'
import { normalizeSettings } from '@/lib/settings-shared'

export type ActionState = { ok: boolean; message: string } | null

const txt = (fd: FormData, key: string, max = 5000) => String(fd.get(key) ?? '').trim().slice(0, max)
const flag = (fd: FormData, key: string) => fd.get(key) === 'on' || fd.get(key) === 'true'
const rowId = (fd: FormData) => {
  const v = String(fd.get('id') ?? '').trim()
  if (!v) throw new Error('Invalid id')
  return v
}

function refresh() { revalidatePath('/', 'layout') }

// ── AUTH ─────────────────────────────────────────────────────────────────────

export async function loginAction(_prev: ActionState, fd: FormData): Promise<ActionState> {
  if (!isAdminConfigured()) return { ok: false, message: 'Admin not configured.' }
  const username = txt(fd, 'username', 60)
  const password = txt(fd, 'password', 200)
  if (!username || !password) return { ok: false, message: 'Username and password required.' }

  const ownerUsername = process.env.ADMIN_USERNAME ?? 'admin'
  if (username === ownerUsername && verifyOwnerPassword(password)) {
    await createAdminSession(username, true)
    revalidatePath('/adminpanel')
    return { ok: true, message: 'Logged in.' }
  }

  const user = await findAdminUser(username)
  if (user && verifyHash(password, user.passwordHash)) {
    await createAdminSession(user.username, user.isOwner)
    revalidatePath('/adminpanel')
    return { ok: true, message: 'Logged in.' }
  }

  return { ok: false, message: 'Incorrect username or password.' }
}

export async function logoutAction() {
  await clearAdminSession()
  revalidatePath('/adminpanel')
}

// ── ADMIN USERS ───────────────────────────────────────────────────────────────

export async function createAdminUserAction(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireOwner()
  const username = txt(fd, 'username', 60)
  const password = txt(fd, 'password', 200)
  if (!username || !password) return { ok: false, message: 'Username and password required.' }
  if (password.length < 8) return { ok: false, message: 'Password must be at least 8 characters.' }
  if (await findAdminUser(username)) return { ok: false, message: 'Username already exists.' }
  await createAdminUser({ username, passwordHash: hashPassword(password), isOwner: false })
  return { ok: true, message: `Sub-admin "${username}" created.` }
}

export async function deleteAdminUserAction(fd: FormData): Promise<ActionState> {
  await requireOwner()
  await deleteAdminUser(rowId(fd))
  return { ok: true, message: 'User deleted.' }
}

export async function changeAdminPasswordAction(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const session = await requireAdmin()
  const targetId = String(fd.get('id') ?? '').trim()
  if (!session.isOwner) {
    const self = await findAdminUser(session.username)
    if (!self || self.id !== targetId) return { ok: false, message: 'Permission denied.' }
  }
  const password = txt(fd, 'password', 200)
  if (password.length < 8) return { ok: false, message: 'Password must be at least 8 characters.' }
  await updateAdminUser(targetId, { passwordHash: hashPassword(password) })
  return { ok: true, message: 'Password updated.' }
}

// ── SETTINGS ──────────────────────────────────────────────────────────────────

export async function saveSettingsAction(json: string): Promise<ActionState> {
  await requireAdmin()
  let parsed: unknown
  try { parsed = JSON.parse(json) } catch { return { ok: false, message: 'Invalid payload.' } }
  const data = normalizeSettings(parsed)
  await writeSettings(data as unknown as Record<string, unknown>)
  refresh()
  return { ok: true, message: 'Settings saved.' }
}

// ── ANNOUNCEMENTS ─────────────────────────────────────────────────────────────

export async function createAnnouncementAction(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin()
  const title = txt(fd, 'title', 200)
  const content = txt(fd, 'content')
  if (!title || !content) return { ok: false, message: 'Title and content required.' }
  await createAnnouncement({
    title, content,
    author: txt(fd, 'author', 60) || 'Staff',
    tag: txt(fd, 'tag', 30) || 'News',
    pinned: flag(fd, 'pinned'),
  })
  refresh()
  return { ok: true, message: 'Announcement posted.' }
}

export async function toggleAnnouncementPinAction(fd: FormData) {
  await requireAdmin()
  await updateAnnouncement(rowId(fd), { pinned: flag(fd, 'pinned') })
  refresh()
}

export async function deleteAnnouncementAction(fd: FormData) {
  await requireAdmin()
  await deleteAnnouncement(rowId(fd))
  refresh()
}

// ── FORUM ─────────────────────────────────────────────────────────────────────

export async function createCategoryAction(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin()
  const name = txt(fd, 'name', 100)
  if (!name) return { ok: false, message: 'Category name required.' }
  await createCategory({
    name,
    description: txt(fd, 'description', 300),
    position: Number(fd.get('position')) || 0,
  })
  refresh()
  return { ok: true, message: 'Category created.' }
}

export async function deleteCategoryAction(fd: FormData) {
  await requireAdmin()
  await deleteCategory(rowId(fd))
  refresh()
}

export async function createTopicAction(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin()
  const title = txt(fd, 'title', 200)
  const content = txt(fd, 'content')
  const categoryId = txt(fd, 'categoryId', 40)
  if (!title || !content || !categoryId) return { ok: false, message: 'Category, title and content required.' }
  await createTopic({
    categoryId, title, content,
    author: txt(fd, 'author', 60) || 'Staff',
    pinned: flag(fd, 'pinned'),
    locked: flag(fd, 'locked'),
  })
  refresh()
  return { ok: true, message: 'Topic created.' }
}

export async function updateTopicFlagsAction(fd: FormData) {
  await requireAdmin()
  await updateTopic(rowId(fd), { pinned: flag(fd, 'pinned'), locked: flag(fd, 'locked') })
  refresh()
}

export async function deleteTopicAction(fd: FormData) {
  await requireAdmin()
  await deleteTopic(rowId(fd))
  refresh()
}

export async function deleteReplyAction(fd: FormData) {
  await requireAdmin()
  await deleteReply(rowId(fd))
  refresh()
}

// ── STAFF ─────────────────────────────────────────────────────────────────────

export async function createStaffAction(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin()
  const username = txt(fd, 'username', 32)
  if (!/^[A-Za-z0-9_]{2,16}$/.test(username)) return { ok: false, message: 'Enter a valid Minecraft username.' }
  const color = txt(fd, 'color', 7)
  await createStaff({
    username,
    rank: txt(fd, 'rank', 30) || 'Helper',
    color: /^#[0-9a-fA-F]{6}$/.test(color) ? color : '#a855f7',
    position: Number(fd.get('position')) || 0,
    online: flag(fd, 'online'),
  })
  refresh()
  return { ok: true, message: 'Staff member added.' }
}

export async function toggleStaffOnlineAction(fd: FormData) {
  await requireAdmin()
  await updateStaff(rowId(fd), { online: flag(fd, 'online') })
  refresh()
}

export async function deleteStaffAction(fd: FormData) {
  await requireAdmin()
  await deleteStaff(rowId(fd))
  refresh()
}

// ── 3D LOGO MAKER ─────────────────────────────────────────────────────────────

export async function saveLogoAction(base64Data: string): Promise<ActionState> {
  await requireAdmin()
  if (!base64Data || !base64Data.startsWith('data:image/')) {
    return { ok: false, message: 'Invalid image data format.' }
  }
  const currentSettings = await readSettings()
  await writeSettings({ ...currentSettings, logoUrl: base64Data })
  refresh()
  return { ok: true, message: 'Website logo updated live across the entire site!' }
}

export async function resetLogoAction(): Promise<ActionState> {
  await requireAdmin()
  const currentSettings = await readSettings()
  await writeSettings({ ...currentSettings, logoUrl: '' })
  refresh()
  return { ok: true, message: 'Logo reset to default.' }
}
