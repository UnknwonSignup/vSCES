'use client'

import { useActionState, useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { postReplyAction } from '@/app/actions/forum'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Panel } from './widgets'

export function ReplyForm({ topicId }: { topicId: number }) {
  const [state, action, pending] = useActionState(postReplyAction, null)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (!state) return
    if (state.ok) {
      toast.success(state.message)
      const content = formRef.current?.elements.namedItem('content') as HTMLTextAreaElement | null
      if (content) content.value = ''
    } else {
      toast.error(state.message)
    }
  }, [state])

  return (
    <Panel title="Leave a reply">
      <form ref={formRef} action={action} className="flex flex-col gap-4">
        <input type="hidden" name="topicId" value={topicId} />
        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
        <div className="flex flex-col gap-2">
          <Label htmlFor="author">Minecraft username</Label>
          <Input id="author" name="author" required minLength={2} maxLength={16} pattern="[A-Za-z0-9_]{2,16}" placeholder="Steve" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="content">Reply</Label>
          <Textarea id="content" name="content" required minLength={2} maxLength={2000} rows={4} />
        </div>
        <Button type="submit" disabled={pending} className="self-start bg-brand text-primary-foreground hover:opacity-90">
          {pending ? 'Posting...' : 'Post reply'}
        </Button>
      </form>
    </Panel>
  )
}
