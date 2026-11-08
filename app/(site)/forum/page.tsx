import { formatDate } from '@/lib/utils'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MessagesSquare } from 'lucide-react'
import { OnlineStaffWidget, PageTitle, Panel } from '@/components/site/widgets'
import { getForumOverview, getStaff } from '@/lib/queries'
import { getSettings } from '@/lib/settings'

export const metadata: Metadata = { title: 'Forum' }

export default async function ForumPage() {
  const settings = await getSettings()
  if (!settings.features.forum) notFound()
  const [categories, staff] = await Promise.all([
    getForumOverview(),
    settings.features.onlineStaffWidget ? getStaff() : [],
  ])

  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      <div className="min-w-0 flex-1">
        <PageTitle title="Forum" description="Discuss, share guides and suggest ideas with the community." />
        <Panel title="Categories">
          {categories.length === 0 ? (
            <p className="text-sm text-muted-foreground">No categories yet.</p>
          ) : (
            <ul className="flex flex-col divide-y divide-border">
              {categories.map((c) => (
                <li key={c.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/15 text-primary">
                      <MessagesSquare className="size-5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <Link href={`/forum/${c.id}`} className="font-semibold hover:text-primary">
                        {c.name}
                      </Link>
                      <p className="text-xs text-muted-foreground">{c.description}</p>
                      <p className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                        <span>{c.topicCount} topics</span>
                        <span>&middot;</span>
                        <span>{c.replyCount ?? 0} replies</span>
                      </p>
                    </div>
                    <div className="min-w-0 sm:w-56 sm:text-right">
                      {c.latestTopic ? (
                        <>
                          <Link
                            href={`/forum/topic/${c.latestTopic.id}`}
                            className="block truncate text-sm font-medium hover:text-primary"
                          >
                            {c.latestTopic.title}
                          </Link>
                          <p className="text-[11px] text-muted-foreground">
                            {c.latestTopic.author} &middot; {formatDate(c.latestTopic.createdAt)}
                          </p>
                        </>
                      ) : (
                        <p className="text-xs text-muted-foreground">No topics yet</p>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
      {settings.features.onlineStaffWidget && (
        <aside className="w-full lg:w-80">
          <OnlineStaffWidget staff={staff} />
        </aside>
      )}
    </div>
  )
}
