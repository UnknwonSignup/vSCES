'use client'

import { Shield, ShieldOff, Trash2 } from 'lucide-react'
import { changeAdminPasswordAction, createAdminUserAction, deleteAdminUserAction } from '@/app/actions/admin'
import { Button } from '@/components/ui/button'
import type { AdminUser } from '@/lib/queries'
import { Card, Field, useToastForm } from './admin-ui'

export function UsersManager({
  users,
  currentUsername,
  isOwner,
}: {
  users: Omit<AdminUser, 'passwordHash'>[]
  currentUsername: string
  isOwner: boolean
}) {
  const create = useToastForm(createAdminUserAction)

  return (
    <div className="flex flex-col gap-6">
      {isOwner && (
        <Card title="Add sub-admin" description="Sub-admins can manage content but cannot add or delete other admins.">
          <form ref={create.ref} action={create.action} className="flex flex-col gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Username" id="u-username" name="username" required maxLength={60} placeholder="moderator" />
              <Field label="Password" id="u-password" name="password" type="password" required minLength={8} placeholder="min 8 characters" />
            </div>
            <Button type="submit" disabled={create.pending} className="self-start bg-brand text-primary-foreground hover:opacity-90">
              {create.pending ? 'Creating…' : 'Create sub-admin'}
            </Button>
          </form>
        </Card>
      )}

      <Card title={`Admin users (${users.length + 1})`} description="Owner account is set via ADMIN_PASSWORD environment variable.">
        <ul className="flex flex-col divide-y divide-border">
          {/* Owner row — always shown, can't delete */}
          <li className="flex items-center gap-3 py-3 first:pt-0">
            <Shield className="size-4 shrink-0 text-primary" />
            <div className="flex-1 min-w-0">
              <p className="font-medium">Stratoukos <span className="ml-1 rounded bg-primary/15 px-1.5 py-0.5 text-[11px] text-primary">Owner</span></p>
              <p className="text-xs text-muted-foreground">Password set via ADMIN_PASSWORD env var</p>
            </div>
          </li>

          {users.filter(u => !u.isOwner).map((u) => (
            <li key={u.id} className="flex items-center gap-3 py-3 last:pb-0">
              <ShieldOff className="size-4 shrink-0 text-muted-foreground" />
              <div className="flex-1 min-w-0">
                <p className="font-medium">{u.username}
                  <span className="ml-2 rounded bg-secondary px-1.5 py-0.5 text-[11px] text-muted-foreground">Sub-admin</span>
                </p>
                <p className="text-xs text-muted-foreground">Added {new Date(u.createdAt).toLocaleDateString()}</p>
              </div>
              {isOwner && (
                <form
                  action={deleteAdminUserAction}
                  onSubmit={(e) => { if (!confirm(`Delete admin "${u.username}"?`)) e.preventDefault() }}
                >
                  <input type="hidden" name="id" value={u.id} />
                  <Button type="submit" variant="ghost" size="icon" aria-label="Delete">
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </form>
              )}
            </li>
          ))}
        </ul>
      </Card>

      <Card title="Change your password" description="Updates the password for your current account.">
        <ChangePasswordForm currentUsername={currentUsername} users={users} />
      </Card>
    </div>
  )
}

function ChangePasswordForm({
  currentUsername,
  users,
}: {
  currentUsername: string
  users: Omit<AdminUser, 'passwordHash'>[]
}) {
  const form = useToastForm(changeAdminPasswordAction)
  const self = users.find(u => u.username === currentUsername)

  // Owner changes password via env var — show info instead
  if (!self) {
    return (
      <p className="text-sm text-muted-foreground">
        As owner, change your password by updating the <code className="rounded bg-secondary px-1 text-foreground">ADMIN_PASSWORD</code> environment variable on your VPS and restarting the server.
      </p>
    )
  }

  return (
    <form ref={form.ref} action={form.action} className="flex flex-col gap-4">
      <input type="hidden" name="id" value={self.id} />
      <Field label="New password" id="cp-password" name="password" type="password" required minLength={8} placeholder="min 8 characters" />
      <Button type="submit" disabled={form.pending} className="self-start bg-brand text-primary-foreground hover:opacity-90">
        {form.pending ? 'Saving…' : 'Update password'}
      </Button>
    </form>
  )
}
