'use client'

import { useActionState } from 'react'
import { Lock, User } from 'lucide-react'
import { loginAction } from '@/app/actions/admin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, null)

  return (
    <form action={action} className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6">
      <div className="flex items-center gap-2">
        <Lock className="size-4 text-primary" aria-hidden="true" />
        <h1 className="font-semibold">Admin login</h1>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="username">Username</Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="username"
            name="username"
            type="text"
            required
            autoComplete="username"
            autoFocus
            className="pl-9"
            placeholder="Stratoukos"
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="pl-9"
          />
        </div>
      </div>
      {state && !state.ok && (
        <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.message}
        </p>
      )}
      <Button type="submit" disabled={pending} className="bg-brand text-primary-foreground hover:opacity-90">
        {pending ? 'Signing in…' : 'Sign in'}
      </Button>
    </form>
  )
}
