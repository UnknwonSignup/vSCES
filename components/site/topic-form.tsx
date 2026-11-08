'use client'

import { useActionState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { postTopicAction } from '@/app/actions/forum'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Panel } from './widgets'

export function TopicForm({ categoryId }: { categoryId: string }) {
  const router = useRouter()
  const [state, action, pending] = useActionState(postTopicAction, null)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (!state) return
    if (state.ok) {
      toast.success(state.message)
      formRef.current?.reset()
      if (state.topicId) router.push(`/forum/topic/${state.topicId}`)
    } else {
      toast.error(state.message)
    }
  }, [state, router])

  return (
    <Panel title="Start a new topic">
      <form ref={formRef} action={action} className="flex flex-col gap-4">
        <input type="hidden" name="categoryId" value={categoryId} />
        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
        <div className="flex flex-col gap-2">
          <Label htmlFor="t-author">Your Minecraft username</Label>
          <Input
            id="t-author"
            name="author"
            required
            minLength={2}
            maxLength={16}
            pattern="[A-Za-z0-9_]{2,16}"
            placeholder="Steve"
            className="max-w-xs"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="t-title">Title</Label>
          <Input
            id="t-title"
            name="title"
            required
            minLength={3}
            maxLength={120}
            placeholder="What's on your mind?"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="t-content">Post</Label>
          <Textarea
            id="t-content"
            name="content"
            required
            minLength={10}
            maxLength={5000}
            rows={6}
            placeholder="Write your post here..."
          />
        </div>
        <Button
          type="submit"
          disabled={pending}
          className="self-start bg-brand text-primary-foreground hover:opacity-90"
        >
          {pending ? 'Posting...' : 'Post topic'}
        </Button>
      </form>
    </Panel>
  )
}
