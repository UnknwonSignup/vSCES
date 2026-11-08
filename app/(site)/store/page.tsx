import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ExternalLink } from 'lucide-react'
import { PageTitle } from '@/components/site/widgets'
import { getSettings } from '@/lib/settings'
import { safeUrl } from '@/lib/settings-shared'

export const metadata: Metadata = { title: 'Store' }

export default async function StorePage() {
  const settings = await getSettings()
  if (!settings.features.store) notFound()
  const storeUrl = safeUrl(settings.storeUrl)

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <PageTitle title="Store" description="Support the server and unlock awesome perks." />
        {storeUrl && (
          <a
            href={storeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-6 inline-flex items-center gap-2 self-start rounded-md bg-brand px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            Visit full store <ExternalLink className="size-4" aria-hidden="true" />
          </a>
        )}
      </div>
      {settings.storePackages.length === 0 ? (
        <p className="text-sm text-muted-foreground">No packages available yet.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {settings.storePackages.map((p, i) => {
            const url = safeUrl(p.url) || storeUrl
            return (
              <li key={i} className="flex flex-col rounded-lg border border-border bg-card p-6">
                <h2 className="text-lg font-bold">{p.name}</h2>
                <p className="mt-1 text-2xl font-extrabold text-brand">{p.price}</p>
                <p className="mt-3 flex-1 text-sm text-muted-foreground">{p.description}</p>
                {url ? (
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 rounded-md bg-brand px-4 py-2 text-center text-sm font-semibold text-primary-foreground hover:opacity-90"
                  >
                    Buy now
                  </a>
                ) : (
                  <span className="mt-5 rounded-md border border-border px-4 py-2 text-center text-sm text-muted-foreground">
                    Coming soon
                  </span>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
