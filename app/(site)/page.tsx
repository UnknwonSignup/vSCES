import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { ArrowRight, Pin, ShieldCheck, Sparkles, Trophy, Users } from 'lucide-react'
import { OnlineStaffWidget, PageTitle, Panel, PlayerHead, SocialsWidget } from '@/components/site/widgets'
import { FeaturesShowcase } from '@/components/site/features-showcase'
import { HowToJoin } from '@/components/site/how-to-join'
import { FloatingQuickDock } from '@/components/site/floating-dock'
import { getAnnouncements, getForumOverview, getStaff } from '@/lib/queries'
import { getSettings } from '@/lib/settings'
import { safeUrl } from '@/lib/settings-shared'

export default async function HomePage() {
  const settings = await getSettings()
  const { features } = settings
  const [announcements, staff, forum] = await Promise.all([
    features.announcements ? getAnnouncements(10) : [],
    features.onlineStaffWidget ? getStaff() : [],
    features.forum ? getForumOverview() : [],
  ])

  const discordUrl = safeUrl(settings.socials.discord)

  return (
    <div className="space-y-10">
      {/* Quick Server Highlights Ribbon */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {[
          { label: 'Vanilla+ Survival SMP', desc: 'Enhanced mechanics & claims', icon: Sparkles, color: 'text-purple-400' },
          { label: '100% Grief Protected', desc: 'Build safely with shovel claims', icon: ShieldCheck, color: 'text-emerald-400' },
          { label: 'Active Community', desc: 'Friendly staff & active Discord', icon: Users, color: 'text-blue-400' },
          { label: 'Vote & Earn Rewards', desc: 'Daily keys, cash & perks', icon: Trophy, color: 'text-amber-400' },
        ].map(({ label, desc, icon: Icon, color }) => (
          <div
            key={label}
            className="flex items-center gap-3 rounded-xl border border-border/80 bg-card/60 p-3 shadow-sm backdrop-blur transition-all duration-200 hover:border-primary/40 hover:bg-card"
          >
            <div className={`flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary/80 ${color}`}>
              <Icon className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-foreground">{label}</p>
              <p className="truncate text-[11px] text-muted-foreground">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Connection Guide (Java & Bedrock) */}
      <HowToJoin serverIp={settings.serverIp} />

      {/* Features Showcase Grid */}
      <FeaturesShowcase />

      {/* Main Content Layout: Announcements & Forum + Sidebar Widgets */}
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          {features.announcements && (
            <Panel title="Server Announcements">
              {announcements.length === 0 ? (
                <p className="text-sm text-muted-foreground">No announcements yet.</p>
              ) : (
                <ul className="flex flex-col divide-y divide-border">
                  {announcements.map((a) => (
                    <li key={a.id} className="py-4 first:pt-0 last:pb-0">
                      <article className="flex gap-4">
                        <PlayerHead username={a.author} size={40} />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            {a.pinned && <Pin className="size-3.5 text-primary" aria-label="Pinned" />}
                            <h3 className="font-semibold text-foreground">{a.title}</h3>
                            <span className="rounded bg-primary/15 px-2 py-0.5 text-[11px] font-medium text-primary">
                              {a.tag}
                            </span>
                          </div>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {a.author} &middot; {formatDate(a.createdAt)}
                          </p>
                          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                            {a.content}
                          </p>
                        </div>
                      </article>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          )}

          {features.forum && forum.length > 0 && (
            <Panel
              title="Latest from the Forum"
              action={
                <Link href="/forum" className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                  View forum <ArrowRight className="size-3" aria-hidden="true" />
                </Link>
              }
            >
              <ul className="flex flex-col gap-3">
                {forum.map((c) => (
                  <li key={c.id}>
                    <Link
                      href={`/forum/${c.id}`}
                      className="flex items-center justify-between gap-4 rounded-md border border-border bg-secondary/50 px-4 py-3 transition-colors hover:border-primary"
                    >
                      <span className="min-w-0">
                        <span className="block font-medium">{c.name}</span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {c.latestTopic ? `Latest: ${c.latestTopic.title}` : c.description}
                        </span>
                      </span>
                      <span className="shrink-0 text-xs text-muted-foreground">{c.topicCount} topics</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Panel>
          )}
        </div>

        {/* Sidebar Cards */}
        <aside className="flex w-full flex-col gap-6 lg:w-80">
          {features.onlineStaffWidget && <OnlineStaffWidget staff={staff} />}
          {features.socialsWidget && <SocialsWidget socials={settings.socials} />}

          {/* Discord Community Card */}
          {discordUrl && (
            <div className="relative overflow-hidden rounded-xl border border-[#5865F2]/40 bg-gradient-to-br from-[#5865F2]/15 via-card to-card p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#5865F2] text-white shadow-md shadow-[#5865F2]/30">
                  <svg className="size-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">Join Our Discord</h4>
                  <p className="text-xs text-muted-foreground">Giveaways, updates &amp; active voice chats.</p>
                </div>
              </div>
              <a
                href={discordUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 block w-full rounded-lg bg-[#5865F2] py-2 text-center text-xs font-semibold text-white shadow transition-all duration-200 hover:bg-[#4752c4] active:scale-95"
              >
                Join Server Community
              </a>
            </div>
          )}
        </aside>
      </div>

      {/* Floating Bottom Quick-Play Bar */}
      <FloatingQuickDock serverIp={settings.serverIp} discordUrl={discordUrl} />
    </div>
  )
}
