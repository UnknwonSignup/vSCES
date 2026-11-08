import 'server-only'
import {
  readAnnouncements,
  readCategories,
  readTopics,
  readReplies,
  readStaff,
  readAdminUsers,
  readTickets,
  readTicketMessages,
  type Announcement,
  type ForumCategory,
  type ForumTopic,
  type ForumReply,
  type StaffMember,
  type AdminUser,
  type Ticket,
  type TicketStatus,
  type TicketMessage,
} from './store'

// Re-export types so existing imports keep working
export type { Announcement, ForumCategory, ForumTopic, ForumReply, StaffMember, AdminUser, Ticket, TicketStatus, TicketMessage }

export async function getAnnouncements(limit = 20): Promise<Announcement[]> {
  return (await readAnnouncements())
    .sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
      return b.createdAt.localeCompare(a.createdAt)
    })
    .slice(0, limit)
}

export async function getStaff(): Promise<StaffMember[]> {
  return (await readStaff()).sort((a, b) => (a.position ?? 0) - (b.position ?? 0) || (a.createdAt ?? '').localeCompare(b.createdAt ?? ''))
}

export async function getForumOverview() {
  const [categoriesRaw, topics, replies] = await Promise.all([readCategories(), readTopics(), readReplies()])
  const categories = categoriesRaw.sort((a, b) => (a.position ?? 0) - (b.position ?? 0) || (a.createdAt ?? '').localeCompare(b.createdAt ?? ''))
  return categories.map((cat) => {
    const catTopics = topics.filter((t) => t.categoryId === cat.id)
    const latest = catTopics.sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''))[0] ?? null
    const replyCount = catTopics.reduce((acc, t) => acc + replies.filter((r) => r.topicId === t.id).length, 0)
    return { ...cat, topicCount: catTopics.length, replyCount, latestTopic: latest }
  })
}

export async function getCategoryWithTopics(categoryId: string) {
  const [categories, replies, topics] = await Promise.all([readCategories(), readReplies(), readTopics()])
  const category = categories.find((c) => c.id === categoryId)
  if (!category) return null
  const catTopics = topics
    .filter((t) => t.categoryId === categoryId)
    .sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
      return (b.createdAt ?? '').localeCompare(a.createdAt ?? '')
    })
    .map((t) => {
      const replyCount = replies.filter((r) => r.topicId === t.id).length
      return { ...t, replyCount, isHot: replyCount > 5 }
    })
  return { category, topics: catTopics }
}

export async function getTopicWithReplies(topicId: string) {
  const [topics, categories, allReplies] = await Promise.all([readTopics(), readCategories(), readReplies()])
  const topic = topics.find((t) => t.id === topicId)
  if (!topic) return null
  const category = categories.find((c) => c.id === topic.categoryId) ?? null
  const replies = allReplies
    .filter((r) => r.topicId === topicId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
  return { topic, category, replies }
}

export async function getAdminData() {
  const [announcements, categoriesRaw, topics, staff, replies, adminUsersRaw, tickets] = await Promise.all([
    getAnnouncements(100),
    readCategories(),
    readTopics(),
    getStaff(),
    readReplies(),
    readAdminUsers(),
    readTickets(),
  ])
  const categories = categoriesRaw.sort((a, b) => a.position - b.position)
  const sortedTopics = topics.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  const sortedReplies = replies.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 50)
  const adminUsers = adminUsersRaw.map(({ passwordHash: _, ...rest }) => rest)
  return { announcements, categories, topics: sortedTopics, staff, replies: sortedReplies, adminUsers, tickets }
}

export { readTickets, readTicketMessages } from './store'
