'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronUp, MessageSquare, Trash2 } from 'lucide-react'
import { deleteTicketAction, updateTicketStatusAction } from '@/app/actions/tickets'
import { Button } from '@/components/ui/button'
import type { Ticket, TicketStatus } from '@/lib/store'
import { cn } from '@/lib/utils'

const STATUS_STYLES: Record<TicketStatus, string> = {
  'open': 'bg-green-500/15 text-green-400 border-green-500/30',
  'in-progress': 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  'closed': 'bg-secondary text-muted-foreground border-border',
}

const STATUS_OPTIONS: { value: TicketStatus; label: string }[] = [
  { value: 'open', label: 'Open' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'closed', label: 'Closed' },
]

function TicketRow({ ticket }: { ticket: Ticket }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <li className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4">
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className={cn('rounded border px-2 py-0.5 text-[11px] font-semibold', STATUS_STYLES[ticket.status])}>
              {ticket.status}
            </span>
            <span className="rounded bg-secondary px-2 py-0.5 text-[11px] text-muted-foreground">{ticket.reason}</span>
          </div>
          <p className="mt-1 font-semibold truncate">{ticket.title}</p>
          <div className="mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span>MC: <span className="text-foreground font-medium">{ticket.minecraftUser}</span></span>
            <span>Discord: <span className="text-foreground font-medium">{ticket.discordUser}</span></span>
            <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        <button
          onClick={() => setExpanded((v) => !v)}
          className="shrink-0 rounded-md p-1 hover:bg-accent"
          aria-label={expanded ? 'Collapse' : 'Expand'}
        >
          {expanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
        </button>
      </div>

      {expanded && (
        <div className="flex flex-col gap-3 border-t border-border pt-3">
          <p className="whitespace-pre-line text-sm text-muted-foreground">{ticket.content}</p>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/tickets/${ticket.id}`}
              className="inline-flex items-center gap-1.5 rounded-md border border-primary/40 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
            >
              <MessageSquare className="size-3.5" /> View Thread & Reply
            </Link>
            {STATUS_OPTIONS.map((opt) => (
              <form key={opt.value} action={updateTicketStatusAction}>
                <input type="hidden" name="id" value={ticket.id} />
                <input type="hidden" name="status" value={opt.value} />
                <Button
                  type="submit"
                  size="sm"
                  variant={ticket.status === opt.value ? 'default' : 'outline'}
                  className={ticket.status === opt.value ? 'bg-brand text-primary-foreground' : ''}
                >
                  {opt.label}
                </Button>
              </form>
            ))}
            <form
              action={deleteTicketAction}
              onSubmit={(e) => { if (!confirm('Delete this ticket?')) e.preventDefault() }}
              className="ml-auto"
            >
              <input type="hidden" name="id" value={ticket.id} />
              <Button type="submit" variant="ghost" size="sm">
                <Trash2 className="size-4 text-destructive" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </li>
  )
}

export function TicketsManager({ tickets }: { tickets: Ticket[] }) {
  const [filter, setFilter] = useState<TicketStatus | 'all'>('all')
  const filtered = filter === 'all' ? tickets : tickets.filter((t) => t.status === filter)
  const counts = {
    all: tickets.length,
    open: tickets.filter((t) => t.status === 'open').length,
    'in-progress': tickets.filter((t) => t.status === 'in-progress').length,
    closed: tickets.filter((t) => t.status === 'closed').length,
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {(['all', 'open', 'in-progress', 'closed'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'rounded-md border px-3 py-1.5 text-xs font-medium transition-colors',
              filter === f
                ? 'border-primary bg-primary/15 text-primary'
                : 'border-border bg-secondary text-muted-foreground hover:text-foreground',
            )}
          >
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)} ({counts[f]})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">No tickets.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {filtered.map((t) => <TicketRow key={t.id} ticket={t} />)}
        </ul>
      )}
    </div>
  )
}
