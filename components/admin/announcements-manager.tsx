'use client'

import { Pin, PinOff, Trash2 } from 'lucide-react'
import {
  createAnnouncementAction,
  deleteAnnouncementAction,
  toggleAnnouncementPinAction,
} from '@/app/actions/admin'
import { Button } from '@/components/ui/button'
import type { Announcement } from '@/lib/queries'
import { Card, Field, useToastForm } from './admin-ui'

export function AnnouncementsManager({ announcements }: { announcements: Announcement[] }) {
  const { action, pending, ref } = useToastForm(createAnnouncementAction)

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
      <Card title="New announcement">
        <form ref={ref} action={action} className="flex flex-col gap-4">
          <Field label="Title" id="a-title" name="title" required maxLength={200} />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Author (MC username)" id="a-author" name="author" placeholder="Staff" maxLength={16} />
            <Field label="Tag" id="a-tag" name="tag" placeholder="News" maxLength={30} />
          </div>
          <Field label="Content" id="a-content" name="content" textarea required rows={6} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="pinned" className="size-4 accent-primary" /> Pin to top
          </label>
          <Button type="submit" disabled={pending} className="self-start bg-brand text-primary-foreground hover:opacity-90">
            {pending ? 'Posting...' : 'Post announcement'}
          </Button>
        </form>
      </Card>

      <Card title={`All announcements (${announcements.length})`}>
        {announcements.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nothing posted yet.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-border">
            {announcements.map((a) => (
              <li key={a.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-2 font-medium">
                    {a.pinned && <Pin className="size-3.5 text-primary" aria-label="Pinned" />}
                    <span className="truncate">{a.title}</span>
                  </p>
                  <p className="line-clamp-2 text-xs text-muted-foreground">{a.content}</p>
                </div>
                <form action={toggleAnnouncementPinAction}>
                  <input type="hidden" name="id" value={a.id} />
                  <input type="hidden" name="pinned" value={a.pinned ? 'false' : 'true'} />
                  <Button type="submit" variant="ghost" size="icon" aria-label={a.pinned ? 'Unpin' : 'Pin'}>
                    {a.pinned ? <PinOff className="size-4" /> : <Pin className="size-4" />}
                  </Button>
                </form>
                <form
                  action={deleteAnnouncementAction}
                  onSubmit={(e) => {
                    if (!confirm('Delete this announcement?')) e.preventDefault()
                  }}
                >
                  <input type="hidden" name="id" value={a.id} />
                  <Button type="submit" variant="ghost" size="icon" aria-label="Delete">
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}
