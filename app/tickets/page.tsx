import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, Clock, MessageSquare, PlusCircle, AlertCircle, CheckCircle2, Loader, Sparkles, LifeBuoy } from 'lucide-react'
import { TicketForm } from '@/components/site/ticket-form'
import { Panel } from '@/components/site/widgets'
import { getSettings } from '@/lib/settings'
import { getDiscordSession } from '@/lib/discord-auth'
import { readTickets, readTicketMessages, type TicketStatus } from '@/lib/store'
import { formatDate } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Support Desk & Tickets',
  description: 'Submit and track support tickets for Reverie SMP.',
}

const STATUS_META: Record<TicketStatus, { label: string; cls: string; icon: typeof CheckCircle2 }> = {
  open:         { label: 'Open',        cls: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 ring-emerald-500/20', icon: CheckCircle2 },
  'in-progress':{ label: 'In Progress', cls: 'bg-amber-500/15  text-amber-400  border-amber-500/30  ring-amber-500/20',  icon: Loader },
  closed:       { label: 'Closed',      cls: 'bg-zinc-500/10   text-zinc-400   border-zinc-500/20   ring-zinc-500/10',   icon: AlertCircle },
}

const REASON_ICONS: Record<string, string> = {
  'Bug Report':      '🐛',
  'Appeal a Ban':    '⚖️',
  'Appeal a Mute':   '🔇',
  'Grief Report':    '🏚️',
  'Player Report':   '🚨',
  'General Support': '💬',
  'Other':           '📋',
}

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg className={className ?? 'size-4'} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  )
}

export default async function TicketsPage() {
  const settings = await getSettings()
  if (!(settings.features as Record<string, boolean>).tickets) notFound()

  const discordSession = await getDiscordSession()
  const allTickets = await readTickets()

  const userTickets = discordSession
    ? allTickets
        .filter(
          (t) =>
            (t.discordUserId && t.discordUserId === discordSession.id) ||
            t.discordUser.toLowerCase() === discordSession.username.toLowerCase()
        )
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    : []

  const openCount   = userTickets.filter((t) => t.status === 'open').length
  const inProgCount = userTickets.filter((t) => t.status === 'in-progress').length

  // Pre-fetch message counts for all user tickets (async)
  const msgCountsArr = await Promise.all(userTickets.map((t) => readTicketMessages(t.id).then((msgs) => msgs.length)))
  const msgCounts = Object.fromEntries(userTickets.map((t, i) => [t.id, msgCountsArr[i]]))

  return (
    <div className="space-y-10">
      {/* Support Portal Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card/90 to-secondary/40 p-8 shadow-xl">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/15 via-transparent to-transparent"
        />
        <div className="relative">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
            <span className="flex size-2 rounded-full bg-primary animate-pulse" />
            <LifeBuoy className="size-3.5" />
            {settings.serverName} Support Center
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            How can we help you?
          </h1>
          <p className="mt-3 max-w-2xl text-sm sm:text-base text-muted-foreground leading-relaxed">
            Have a question, encountered a bug, or need staff assistance on {settings.serverName}? Submit a support ticket below or connect your Discord account to view previous conversations.
          </p>

          {/* Stats Bar */}
          {discordSession && userTickets.length > 0 && (
            <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-border/60 pt-5">
              {[
                { label: 'Your Tickets', val: userTickets.length, cls: 'bg-primary/10 text-primary border-primary/20' },
                { label: 'Open',         val: openCount,          cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
                { label: 'In Progress',  val: inProgCount,        cls: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
              ].map(({ label, val, cls }) => (
                <div key={label} className={`flex items-center gap-2 rounded-xl border px-3.5 py-1.5 text-xs font-semibold shadow-sm ${cls}`}>
                  <span className="text-base font-extrabold">{val}</span>
                  <span className="opacity-80">{label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Discord Connect CTA Card (if not signed in) */}
      {!discordSession && (
        <div className="relative overflow-hidden rounded-2xl border border-[#5865F2]/40 bg-gradient-to-r from-[#5865F2]/10 via-[#5865F2]/5 to-transparent p-6 shadow-md">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-start gap-3.5">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#5865F2]/20 text-[#5865F2] ring-1 ring-[#5865F2]/30">
                <DiscordIcon className="size-6" />
              </div>
              <div>
                <p className="text-base font-semibold text-foreground">Connect Discord for Live Updates</p>
                <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                  Link your Discord to see replies from moderators in real-time, reply to staff, and track all your ticket history in one place.
                </p>
              </div>
            </div>
            <a
              href="/api/auth/discord"
              className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-[#5865F2] px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-[#5865F2]/30 transition-all duration-200 hover:scale-[1.02] hover:bg-[#4752c4] active:scale-95"
            >
              <DiscordIcon className="size-4" />
              Connect Discord
            </a>
          </div>
        </div>
      )}

      {/* My Tickets List (if logged in) */}
      {discordSession && (
        <Panel title={`My Tickets ${userTickets.length > 0 ? `(${userTickets.length})` : ''}`}>
          {userTickets.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <div className="flex size-14 items-center justify-center rounded-full bg-secondary">
                <MessageSquare className="size-6 text-muted-foreground/60" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">No tickets yet</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Your submitted tickets will appear here.</p>
              </div>
            </div>
          ) : (
            <ul className="flex flex-col gap-2.5">
              {userTickets.map((t) => {
                const msgCount = msgCounts[t.id] ?? 0
                const st = STATUS_META[t.status] ?? STATUS_META.open
                const StatusIcon = st.icon
                const emoji = REASON_ICONS[t.reason] ?? '📋'
                return (
                  <li key={t.id}>
                    <Link
                      href={`/tickets/${t.id}`}
                      className="group flex flex-col gap-3 rounded-2xl border border-border/80 bg-secondary/30 p-4 transition-all duration-200 hover:border-primary/50 hover:bg-secondary/60 hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-background text-xl shadow-sm border border-border">
                          {emoji}
                        </div>
                        <div className="min-w-0 flex-1 space-y-1">
                          <p className="truncate text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                            {t.title}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                            <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-medium ring-1 ${st.cls}`}>
                              <StatusIcon className="size-2.5" />
                              {st.label}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="size-3" />
                              {formatDate(t.createdAt)}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageSquare className="size-3" />
                              {msgCount} {msgCount === 1 ? 'reply' : 'replies'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-primary opacity-0 transition-all duration-150 group-hover:translate-x-1 group-hover:opacity-100">
                        View Thread <ArrowRight className="size-3.5" />
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </Panel>
      )}

      {/* Ticket Submission Form Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary/15 text-primary shadow-sm">
            <PlusCircle className="size-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Create Support Ticket</h2>
            <p className="text-xs text-muted-foreground">Fill in the details below. Our staff responds as soon as possible.</p>
          </div>
        </div>

        {/* Quick category helper chips */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {Object.entries(REASON_ICONS).slice(0, 4).map(([reason, emoji]) => (
            <div key={reason} className="flex items-center gap-2.5 rounded-xl border border-border/80 bg-card/60 px-3.5 py-2 text-xs text-muted-foreground shadow-sm">
              <span className="text-base">{emoji}</span>
              <span className="truncate font-medium">{reason}</span>
            </div>
          ))}
        </div>

        <TicketForm defaultDiscordUser={discordSession?.username} />
      </section>

      {/* Helpful Guarantee Badges */}
      <div className="grid gap-4 sm:grid-cols-3 pt-4">
        {[
          { icon: '⚡', title: 'Fast Response', desc: 'Our moderation team monitors tickets around the clock.' },
          { icon: '🔒', title: 'Private & Confidential', desc: 'Only you and server staff can read your ticket thread.' },
          { icon: '💬', title: 'Direct Communication', desc: 'Exchange replies directly with staff until the issue is solved.' },
        ].map(({ icon, title, desc }) => (
          <div key={title} className="rounded-2xl border border-border/80 bg-card/40 p-4 shadow-sm">
            <div className="mb-2 text-2xl">{icon}</div>
            <p className="text-sm font-semibold text-foreground">{title}</p>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
