import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft, Lock } from 'lucide-react'
import { ReplyForm } from '@/components/site/reply-form'
import { Panel, PlayerHead } from '@/components/site/widgets'
import { getTopicWithReplies } from '@/lib/queries'
import { getSettings } from '@/lib/settings'

export default async function TopicPage({ params }: { params: Promise<{ topicId: string }> }) {
  const settings = await getSettings()
  if (!settings.features.forum) notFound()
  const { topicId } = await params
  if (!topicId) notFound()
  const data = await getTopicWithReplies(topicId)
  if (!data) notFound()
  const { topic, category, replies } = data

  return (
    <div className="flex flex-col gap-6">
      {category && (
        <Link
          href={`/forum/${category.id}`}
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
        >
          <ChevronLeft className="size-3" aria-hidden="true" /> {category.name}
        </Link>
      )}

      <article className="rounded-lg border border-border bg-card p-6">
        <h1 className="text-2xl font-bold text-balance">{topic.title}</h1>
        <div className="mt-3 flex items-center gap-3">
          <PlayerHead username={topic.author} />
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{topic.author}</span> &middot; {formatDate(topic.createdAt)}
          </p>
        </div>
        <p className="mt-5 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{topic.content}</p>
      </article>

      <Panel title={`Replies (${replies.length})`}>
        {replies.length === 0 ? (
          <p className="text-sm text-muted-foreground">No replies yet.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-border">
            {replies.map((r) => (
              <li key={r.id} className="flex gap-3 py-4 first:pt-0 last:pb-0">
                <PlayerHead username={r.author} />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">{r.author}</span> &middot; {formatDate(r.createdAt)}
                  </p>
                  <p className="mt-1 whitespace-pre-line text-sm leading-relaxed">{r.content}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      {topic.locked ? (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Lock className="size-4" aria-hidden="true" /> This topic is locked.
        </p>
      ) : (
        settings.features.forumReplies && <ReplyForm topicId={topic.id} />
      )}
    </div>
  )
}
