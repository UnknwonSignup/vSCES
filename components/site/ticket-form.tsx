'use client'

import { useActionState, useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { CheckCircle2, Loader2, Send } from 'lucide-react'
import { submitTicketAction } from '@/app/actions/tickets'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const REASONS = [
  'Bug Report',
  'Appeal a Ban',
  'Appeal a Mute',
  'Grief Report',
  'Player Report',
  'General Support',
  'Other',
]

export function TicketForm({ defaultDiscordUser }: { defaultDiscordUser?: string }) {
  const [state, action, pending] = useActionState(submitTicketAction, null)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (!state) return
    if (state.ok) {
      toast.success(state.message)
      formRef.current?.reset()
    } else {
      toast.error(state.message)
    }
  }, [state])

  return (
    <form
      ref={formRef}
      action={action}
      className="flex flex-col gap-5 rounded-lg border border-border bg-card p-6 shadow-sm transition-shadow duration-300 hover:shadow-md"
    >
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="tk-minecraft">Minecraft Username</Label>
          <Input
            id="tk-minecraft"
            name="minecraftUser"
            required
            minLength={2}
            maxLength={16}
            pattern="[A-Za-z0-9_]{2,16}"
            placeholder="Steve"
            className="transition-colors focus:border-primary"
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="tk-discord">Discord Username</Label>
            {defaultDiscordUser && (
              <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                <CheckCircle2 className="size-3" /> Linked
              </span>
            )}
          </div>
          <Input
            id="tk-discord"
            name="discordUser"
            required
            defaultValue={defaultDiscordUser ?? ''}
            minLength={2}
            maxLength={37}
            placeholder="steve or steve#1234"
            className="transition-colors focus:border-primary"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="tk-reason">Reason</Label>
        <select
          id="tk-reason"
          name="reason"
          required
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="">Select a reason...</option>
          {REASONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="tk-title">Title</Label>
        <Input
          id="tk-title"
          name="title"
          required
          minLength={3}
          maxLength={120}
          placeholder="Brief summary of your issue"
          className="transition-colors focus:border-primary"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="tk-content">Description</Label>
        <Textarea
          id="tk-content"
          name="content"
          required
          minLength={10}
          maxLength={3000}
          rows={6}
          placeholder="Describe your issue in detail. Include any relevant information such as when it happened, who was involved, coordinates, etc."
          className="resize-y transition-colors focus:border-primary"
        />
      </div>

      <Button
        type="submit"
        disabled={pending}
        className="self-start bg-brand font-semibold text-primary-foreground shadow-md transition-all duration-200 hover:scale-[1.02] hover:opacity-95 active:scale-95"
      >
        {pending ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Send className="mr-2 size-4" />
            Submit Ticket
          </>
        )}
      </Button>
    </form>
  )
}
