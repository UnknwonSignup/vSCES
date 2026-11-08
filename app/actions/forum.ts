'use server'

import { revalidatePath } from 'next/cache'
import { canReply, canPost, createReply, createTopic, readCategories, readTopics } from '@/lib/store'
import { getSettings } from '@/lib/settings'

export type ReplyState = { ok: boolean; message: string } | null
export type TopicState = { ok: boolean; message: string; topicId?: string } | null

export async function postReplyAction(_prev: ReplyState, fd: FormData): Promise<ReplyState> {
  const settings = await getSettings()
  if (!settings.features.forum || !settings.features.forumReplies) {
    return { ok: false, message: 'Replies are currently disabled.' }
  }
  if (fd.get('website')) return { ok: true, message: 'Reply posted.' }

  const topicId = String(fd.get('topicId') ?? '').trim()
  const author = String(fd.get('author') ?? '').trim()
  const content = String(fd.get('content') ?? '').trim()

  if (!topicId) return { ok: false, message: 'Invalid topic.' }
  if (!/^[A-Za-z0-9_]{2,16}$/.test(author)) return { ok: false, message: 'Use your Minecraft username (2-16 characters).' }
  if (content.length < 2 || content.length > 2000) return { ok: false, message: 'Reply must be 2-2000 characters.' }

  const topic = (await readTopics()).find((t) => t.id === topicId)
  if (!topic) return { ok: false, message: 'Topic not found.' }
  if (topic.locked) return { ok: false, message: 'This topic is locked.' }

  if (!(await canReply(author))) return { ok: false, message: 'Please wait a moment before replying again.' }

  await createReply({ topicId, author, content })
  revalidatePath(`/forum/topic/${topicId}`)
  return { ok: true, message: 'Reply posted.' }
}

export async function postTopicAction(_prev: TopicState, fd: FormData): Promise<TopicState> {
  const settings = await getSettings()
  if (!settings.features.forum) return { ok: false, message: 'Forum is currently disabled.' }
  if (fd.get('website')) return { ok: true, message: 'Topic posted.' }

  const categoryId = String(fd.get('categoryId') ?? '').trim()
  const author = String(fd.get('author') ?? '').trim()
  const title = String(fd.get('title') ?? '').trim()
  const content = String(fd.get('content') ?? '').trim()

  if (!categoryId) return { ok: false, message: 'Invalid category.' }
  if (!/^[A-Za-z0-9_]{2,16}$/.test(author)) return { ok: false, message: 'Use your Minecraft username (2-16 characters).' }
  if (title.length < 3 || title.length > 120) return { ok: false, message: 'Title must be 3-120 characters.' }
  if (content.length < 10 || content.length > 5000) return { ok: false, message: 'Post must be 10-5000 characters.' }

  const category = (await readCategories()).find((c) => c.id === categoryId)
  if (!category) return { ok: false, message: 'Category not found.' }

  if (!(await canPost(author))) return { ok: false, message: 'Please wait 2 minutes before posting again.' }

  const topic = await createTopic({ categoryId, title, content, author, pinned: false, locked: false })
  revalidatePath(`/forum/${categoryId}`)
  revalidatePath('/forum')
  return { ok: true, message: 'Topic posted.', topicId: topic.id }
}
