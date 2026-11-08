'use client'

import { useActionState, useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { Loader2, Send, Shield } from 'lucide-react'
import { postTicketMessageAction } from '@/app/actions/tickets'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

export function TicketMessageForm({ ticketId, isStaff }: { ticketId: string; isStaff?: boolean }) {
  const [state, action, pending] = useActionState(postTicketMessageAction, null)
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
    <form ref={formRef} action={action} className="flex flex-col gap-3">
      <input type="hidden" name="ticketId" value={ticketId} />
      <Textarea
        name="content"
        required
        minLength={1}
        maxLength={2000}
        rows={4}
        placeholder={isStaff ? 'Write your staff response…' : 'Write your reply…'}
        className="resize-y transition-colors focus:border-primary"
      />
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-muted-foreground">
          {isStaff ? (
            <span className="inline-flex items-center gap-1 text-primary">
              <Shield className="size-3" /> Replying as Staff
            </span>
          ) : (
            'Max 2,000 characters'
          )}
        </span>
        <Button
          type="submit"
          disabled={pending}
          size="sm"
          className="bg-brand font-semibold text-primary-foreground shadow-md shadow-primary/20 transition-all duration-200 hover:scale-[1.02] hover:opacity-90 active:scale-95"
        >
          {pending ? (
            <>
              <Loader2 className="mr-1.5 size-3.5 animate-spin" />
              Sending…
            </>
          ) : (
            <>
              <Send className="mr-1.5 size-3.5" />
              {isStaff ? 'Send Reply' : 'Reply'}
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
