import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PageTitle, PlayerHead, RankBadge } from '@/components/site/widgets'
import { getStaff } from '@/lib/queries'
import { getSettings } from '@/lib/settings'

export const metadata: Metadata = { title: 'Staff' }

export default async function StaffPage() {
  const settings = await getSettings()
  if (!settings.features.staff) notFound()
  const staff = await getStaff()

  return (
    <div className="space-y-8">
      <PageTitle title="Our Staff Team" description={`The dedicated team behind ${settings.serverName}.`} />
      {staff.length === 0 ? (
        <p className="text-sm text-muted-foreground">No staff listed yet.</p>
      ) : (
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {staff.map((m) => (
            <li
              key={m.id}
              className="group relative flex flex-col items-center gap-4 overflow-hidden rounded-2xl border bg-card p-6 text-center transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
              style={{
                borderColor: `color-mix(in srgb, ${m.color} 30%, var(--border))`,
                boxShadow: `0 8px 24px -4px ${m.color}20`,
              }}
            >
              {/* Top ambient colored gradient highlight */}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1.5 transition-opacity group-hover:opacity-100"
                style={{
                  background: `linear-gradient(90deg, transparent, ${m.color}, transparent)`,
                }}
              />

              {/* Centered avatar with subtle backdrop glow */}
              <div className="relative mt-2">
                <span
                  aria-hidden="true"
                  className="absolute inset-0 -z-10 rounded-full blur-md opacity-30 transition-opacity group-hover:opacity-70"
                  style={{ backgroundColor: m.color }}
                />
                <PlayerHead username={m.username} size={72} />
              </div>

              <div className="space-y-1">
                <p className="text-base font-bold text-foreground tracking-tight transition-colors group-hover:text-primary">
                  {m.username}
                </p>
                <div className="flex justify-center pt-0.5">
                  <RankBadge rank={m.rank} color={m.color} />
                </div>
              </div>

              <div className="mt-auto flex items-center justify-center gap-2 rounded-full border border-border/60 bg-secondary/60 px-3 py-1 text-xs text-muted-foreground">
                <span className="relative flex size-2">
                  {m.online && (
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  )}
                  <span
                    className={`relative inline-flex size-2 rounded-full ${
                      m.online ? 'bg-emerald-400' : 'bg-muted-foreground/40'
                    }`}
                  />
                </span>
                <span className="font-medium">{m.online ? 'Online Now' : 'Offline'}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
