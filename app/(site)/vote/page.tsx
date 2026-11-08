import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ThumbsUp } from 'lucide-react'
import { PageTitle } from '@/components/site/widgets'
import { getSettings } from '@/lib/settings'
import { safeUrl } from '@/lib/settings-shared'

export const metadata: Metadata = { title: 'Vote' }

export default async function VotePage() {
  const settings = await getSettings()
  if (!settings.features.vote) notFound()
  const links = settings.voteLinks.filter((l) => safeUrl(l.url))

  return (
    <div>
      <PageTitle title="Vote for us" description="Voting helps new players find us and earns you in-game rewards." />
      {links.length === 0 ? (
        <p className="text-sm text-muted-foreground">No vote sites configured yet.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {links.map((l, i) => (
            <li key={i}>
              <a
                href={safeUrl(l.url)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary"
              >
                <span className="flex size-10 items-center justify-center rounded-md bg-brand font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <span className="flex-1 font-semibold">{l.name}</span>
                <ThumbsUp className="size-4 text-primary" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
