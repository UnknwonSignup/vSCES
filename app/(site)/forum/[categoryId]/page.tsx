import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft, Flame, Lock, MessageSquare, Pin } from 'lucide-react'
import { TopicForm } from '@/components/site/topic-form'
import { PageTitle, Panel, PlayerHead } from '@/components/site/widgets'
import { getCategoryWithTopics } from '@/lib/queries'
import { getSettings } from '@/lib/settings'

export default async function CategoryPage({ params }: { params: Promise<{ categoryId: string }> }) {
  const settings = await getSettings()
  if (!settings.features.forum) notFound()
  const { categoryId } = await params
  if (!categoryId) notFound()
  const data = await getCategoryWithTopics(categoryId)
  if (!data) notFound()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href="/forum"
          className="mb-4 inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-primary"
        >
          <ChevronLeft className="size-3.5" aria-hidden="true" /> Back to forum
        </Link>
        <PageTitle title={data.category.name} description={data.category.description} />
      </div>

      <Panel title={`Topics (${data.topics.length})`}>
        {data.topics.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">No topics yet — be the first to post!</p>
        ) : (
          <ul className="flex flex-col divide-y divide-border">
            {data.topics.map((t) => (
              <li key={t.id} className="py-2.5 first:pt-0 last:pb-0">
                <Link
                  href={`/forum/topic/${t.id}`}
                  className="group flex flex-col gap-2 rounded-lg p-2 transition-all duration-200 hover:bg-secondary/40 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <PlayerHead username={t.author} size={36} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        {t.pinned && <Pin className="size-3.5 text-primary shrink-0" aria-label="Pinned" />}
                        {t.locked && <Lock className="size-3.5 text-muted-foreground shrink-0" aria-label="Locked" />}
                        <span className="truncate text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                          {t.title}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {t.author} &middot; {formatDate(t.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                    {t.isHot && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-orange-500/40 bg-orange-500/15 px-2 py-0.5 text-[10px] font-bold text-orange-400 shadow-sm">
                        <Flame className="size-3 fill-orange-400 text-orange-400 animate-bounce" /> Hot
                      </span>
                    )}
                    <span className="flex items-center gap-1.5 rounded-md border border-border/60 bg-secondary/70 px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                      <MessageSquare className="size-3 text-muted-foreground/70" />
                      <span>{t.replyCount ?? 0}</span>
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <TopicForm categoryId={categoryId} />
    </div>
  )
}
