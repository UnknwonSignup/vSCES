import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  Clock,
  Lock,
  MessageSquare,
  Shield,
  CheckCircle2,
  Loader,
  AlertCircle,
  User2,
  Send,
} from 'lucide-react'
import { TicketMessageForm } from '@/components/site/ticket-message-form'
import { PlayerHead } from '@/components/site/widgets'
import { Button } from '@/components/ui/button'
import { getSession } from '@/lib/admin-auth'
import { getDiscordSession } from '@/lib/discord-auth'
import { readTickets, readTicketMessages, type TicketStatus } from '@/lib/store'
import { formatDate } from '@/lib/utils'
import { updateTicketStatusAction } from '@/app/actions/tickets'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ ticketId: string }>
}): Promise<Metadata> {
  const { ticketId } = await params
  const ticket = (await readTickets()).find((t) => t.id === ticketId)
  return { title: ticket ? `Ticket: ${ticket.title}` : 'Support Ticket' }
}

const STATUS_META: Record<TicketStatus, { label: string; cls: string; icon: typeof CheckCircle2; desc: string }> = {
  open: {
    label: 'Open',
    cls: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    icon: CheckCircle2,
    desc: 'Waiting for staff review',
  },
  'in-progress': {
    label: 'In Progress',
    cls: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    icon: Loader,
    desc: 'Staff is currently reviewing',
  },
  closed: {
    label: 'Closed',
    cls: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
    icon: AlertCircle,
    desc: 'Ticket has been resolved',
  },
}

const REASON_ICONS: Record<string, string> = {
  'Bug Report': '🐛',
  'Appeal a Ban': '⚖️',
  'Appeal a Mute': '🔇',
  'Grief Report': '🏚️',
  'Player Report': '🚨',
  'General Support': '💬',
  Other: '📋',
}

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg className={className ?? 'size-4'} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  )
}

export default async function TicketDetailPage({
  params,
}: {
  params: Promise<{ ticketId: string }>
}) {
  const { ticketId } = await params
  const ticket = (await readTickets()).find((t) => t.id === ticketId)
  if (!ticket) notFound()

  const adminSession = await getSession()
  const discordSession = await getDiscordSession()

  const isStaff = adminSession !== null
  const isOwner =
    discordSession !== null &&
    ((ticket.discordUserId && ticket.discordUserId === discordSession.id) ||
      ticket.discordUser.toLowerCase() === discordSession.username.toLowerCase())

  // Access denied screen
  if (!isStaff && !isOwner) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl border-2 border-border/80 bg-card shadow-lg">
          <Lock className="size-7 text-muted-foreground" />
        </div>
        <h1 className="mt-5 text-2xl font-bold text-foreground">Private Ticket</h1>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          This ticket is strictly confidential between the creator and server staff.
        </p>

        {!discordSession ? (
          <div className="mt-6 flex flex-col items-center gap-3">
            <p className="text-xs text-muted-foreground">Are you the ticket creator? Connect Discord to verify access.</p>
            <a
              href="/api/auth/discord"
              className="inline-flex items-center gap-2 rounded-xl bg-[#5865F2] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#5865F2]/30 transition-all hover:bg-[#4752c4] hover:scale-[1.02]"
            >
              <DiscordIcon className="size-4" />
              Connect Discord
            </a>
          </div>
        ) : (
          <p className="mt-4 text-xs text-destructive">
            Signed in as <span className="font-semibold">{discordSession.username}</span>, but this ticket was submitted by <span className="font-semibold">{ticket.discordUser}</span>.
          </p>
        )}

        <div className="mt-8">
          <Link
            href="/tickets"
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" /> Back to Support Desk
          </Link>
        </div>
      </div>
    )
  }

  const messages = await readTicketMessages(ticket.id)
  const st = STATUS_META[ticket.status] ?? STATUS_META.open
  const StatusIcon = st.icon
  const reasonEmoji = REASON_ICONS[ticket.reason] ?? '📋'

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Back Action */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/tickets"
          className="group inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/60 px-4 py-1.5 text-xs font-semibold text-muted-foreground shadow-sm backdrop-blur transition-all duration-200 hover:border-primary/50 hover:bg-secondary hover:text-foreground active:scale-95"
        >
          <ArrowLeft className="size-3.5 text-muted-foreground transition-transform group-hover:-translate-x-0.5 group-hover:text-primary" />
          <span>Back to Tickets</span>
        </Link>

        <span className="text-xs font-mono text-muted-foreground">
          #{ticket.id.slice(0, 8).toUpperCase()}
        </span>
      </div>

      {/* Ticket Header Banner Card */}
      <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card/90 to-secondary/30 p-6 sm:p-7 shadow-lg">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"
        />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-background text-2xl shadow-sm border border-border">
              {reasonEmoji}
            </div>
            <div className="min-w-0">
              <div className="mb-1.5 flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${st.cls}`}>
                  <StatusIcon className="size-3" />
                  {st.label}
                </span>
                <span className="rounded-full bg-secondary/80 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                  {ticket.reason}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground leading-tight">{ticket.title}</h1>
              <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Clock className="size-3.5" /> Opened {formatDate(ticket.createdAt)}
                </span>
                <span className="inline-flex items-center gap-1">
                  <MessageSquare className="size-3.5" /> {messages.length} {messages.length === 1 ? 'reply' : 'replies'}
                </span>
              </p>
            </div>
          </div>

          {/* Staff Status Controls */}
          {isStaff && (
            <div className="shrink-0 rounded-2xl border border-primary/25 bg-primary/5 p-3">
              <p className="mb-2 flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-primary">
                <Shield className="size-3" /> Staff Controls
              </p>
              <div className="flex flex-wrap gap-1.5">
                {(['open', 'in-progress', 'closed'] as const).map((s) => (
                  <form key={s} action={updateTicketStatusAction}>
                    <input type="hidden" name="id" value={ticket.id} />
                    <input type="hidden" name="status" value={s} />
                    <Button
                      type="submit"
                      size="sm"
                      variant={ticket.status === s ? 'default' : 'outline'}
                      className={
                        ticket.status === s
                          ? 'h-7 bg-brand px-2.5 text-[11px] font-semibold text-primary-foreground shadow-md'
                          : 'h-7 px-2.5 text-[11px]'
                      }
                    >
                      {s === 'in-progress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)}
                    </Button>
                  </form>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Original Ticket Report */}
      <div className="flex gap-3.5">
        <div className="shrink-0 pt-0.5">
          <PlayerHead username={ticket.minecraftUser} size={42} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex flex-wrap items-center gap-2">
            <span className="text-sm font-bold text-foreground">{ticket.minecraftUser}</span>
            <span className="text-[11px] text-muted-foreground">@{ticket.discordUser}</span>
            <span className="text-[11px] text-muted-foreground">· Original Post · {formatDate(ticket.createdAt)}</span>
          </div>
          <div className="rounded-3xl rounded-tl-sm border border-border/80 bg-card p-5 shadow-sm">
            <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/90">{ticket.content}</p>
          </div>
        </div>
      </div>

      {/* Conversation Thread Separator */}
      {messages.length > 0 && (
        <div className="flex items-center gap-3 py-2">
          <div className="h-px flex-1 bg-border/80" />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {messages.length} {messages.length === 1 ? 'Message' : 'Messages'}
          </span>
          <div className="h-px flex-1 bg-border/80" />
        </div>
      )}

      {/* Message List */}
      {messages.length > 0 && (
        <ul className="flex flex-col gap-4">
          {messages.map((m) => (
            <li key={m.id} className="flex gap-3.5">
              <div className="shrink-0 pt-0.5">
                {m.isStaff ? (
                  <div className="flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-brand text-primary-foreground shadow-md shadow-primary/20">
                    <Shield className="size-4" />
                  </div>
                ) : (
                  <div className="flex size-10 items-center justify-center rounded-2xl bg-secondary text-muted-foreground ring-1 ring-border">
                    <User2 className="size-4" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-1.5 flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-foreground">{m.authorName}</span>
                  {m.isStaff && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold text-primary ring-1 ring-primary/20">
                      <Shield className="size-2.5" /> Staff
                    </span>
                  )}
                  <span className="text-[11px] text-muted-foreground">· {formatDate(m.createdAt)}</span>
                </div>
                <div
                  className={`rounded-3xl p-5 shadow-sm ${
                    m.isStaff
                      ? 'rounded-tl-sm border border-primary/25 bg-primary/5 text-foreground'
                      : 'rounded-tl-sm border border-border/80 bg-card text-foreground'
                  }`}
                >
                  <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/90">{m.content}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Reply Box / Closed Banner */}
      {ticket.status !== 'closed' ? (
        <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-foreground">
            <Send className="size-4 text-primary" />
            {isStaff ? 'Send Staff Response' : 'Reply to this Ticket'}
          </h3>
          <TicketMessageForm ticketId={ticket.id} isStaff={isStaff} />
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 rounded-3xl border border-border/80 bg-secondary/30 p-8 text-center">
          <AlertCircle className="size-7 text-muted-foreground/60" />
          <p className="text-base font-semibold text-foreground">Ticket Closed & Resolved</p>
          <p className="max-w-md text-xs text-muted-foreground">
            This support ticket has been closed by staff. If you still need help or have another inquiry, please submit a new ticket.
          </p>
          <Link
            href="/tickets"
            className="mt-3 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow transition-transform hover:scale-[1.02] active:scale-95"
          >
            Create New Ticket
          </Link>
        </div>
      )}
    </div>
  )
}
