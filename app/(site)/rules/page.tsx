import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PageTitle } from '@/components/site/widgets'
import { getSettings } from '@/lib/settings'

export const metadata: Metadata = { title: 'Rules' }

export default async function RulesPage() {
  const settings = await getSettings()
  if (!settings.features.rules) notFound()

  return (
    <div className="max-w-3xl">
      <PageTitle title="Server Rules" description="Please follow these rules to keep Reverie fun for everyone." />
      <ol className="flex flex-col gap-3">
        {settings.rules.map((r, i) => (
          <li key={i} className="flex gap-4 rounded-lg border border-border bg-card p-5">
            <span className="text-brand text-xl font-extrabold">{String(i + 1).padStart(2, '0')}</span>
            <div>
              <h2 className="font-semibold">{r.title}</h2>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{r.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
