'use client'

import { Trash2 } from 'lucide-react'
import { createStaffAction, deleteStaffAction, toggleStaffOnlineAction } from '@/app/actions/admin'
import { PlayerHead, RankBadge } from '@/components/site/widgets'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import type { StaffMember } from '@/lib/queries'
import { Card, Field, useToastForm } from './admin-ui'

export function StaffManager({ staff }: { staff: StaffMember[] }) {
  const { action, pending, ref } = useToastForm(createStaffAction)

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
      <Card title="Add staff member">
        <form ref={ref} action={action} className="flex flex-col gap-4">
          <Field label="Minecraft username" id="s-user" name="username" required maxLength={16} pattern="[A-Za-z0-9_]{2,16}" />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Rank" id="s-rank" name="rank" placeholder="Admin" maxLength={30} />
            <div className="flex flex-col gap-2">
              <Label htmlFor="s-color">Rank color</Label>
              <input id="s-color" name="color" type="color" defaultValue="#a855f7" className="h-9 w-full rounded-md border border-input bg-transparent" />
            </div>
          </div>
          <Field label="Order" id="s-pos" name="position" type="number" defaultValue={0} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="online" className="size-4 accent-primary" /> Show as online
          </label>
          <Button type="submit" disabled={pending} className="self-start bg-brand text-primary-foreground hover:opacity-90">
            Add member
          </Button>
        </form>
      </Card>

      <Card title={`Staff (${staff.length})`} description="Toggle online to show members in the Online Staff widget.">
        {staff.length === 0 ? (
          <p className="text-sm text-muted-foreground">No staff added yet.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-border">
            {staff.map((m) => (
              <li key={m.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <PlayerHead username={m.username} />
                <span className="min-w-0 flex-1 truncate text-sm font-medium">{m.username}</span>
                <RankBadge rank={m.rank} color={m.color} />
                <form action={toggleStaffOnlineAction}>
                  <input type="hidden" name="id" value={m.id} />
                  <input type="hidden" name="online" value={m.online ? 'false' : 'true'} />
                  <Button type="submit" variant="outline" size="sm" className="w-20">
                    <span className={`size-2 rounded-full ${m.online ? 'bg-emerald-400' : 'bg-muted-foreground/50'}`} />
                    {m.online ? 'Online' : 'Offline'}
                  </Button>
                </form>
                <form
                  action={deleteStaffAction}
                  onSubmit={(e) => {
                    if (!confirm(`Remove ${m.username}?`)) e.preventDefault()
                  }}
                >
                  <input type="hidden" name="id" value={m.id} />
                  <Button type="submit" variant="ghost" size="icon" aria-label={`Remove ${m.username}`}>
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
