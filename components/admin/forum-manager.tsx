'use client'

import { Lock, LockOpen, Pin, PinOff, Trash2 } from 'lucide-react'
import {
  createCategoryAction,
  createTopicAction,
  deleteCategoryAction,
  deleteReplyAction,
  deleteTopicAction,
  updateTopicFlagsAction,
} from '@/app/actions/admin'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import type { ForumCategory, ForumReply, ForumTopic } from '@/lib/queries'
import { Card, Field, useToastForm } from './admin-ui'

function ConfirmForm({
  action,
  message,
  children,
}: {
  action: (fd: FormData) => Promise<void>
  message: string
  children: React.ReactNode
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(message)) e.preventDefault()
      }}
    >
      {children}
    </form>
  )
}

export function ForumManager({
  categories,
  topics,
  replies,
}: {
  categories: ForumCategory[]
  topics: ForumTopic[]
  replies: ForumReply[]
}) {
  const category = useToastForm(createCategoryAction)
  const topic = useToastForm(createTopicAction)
  const topicTitle = (id: number) => topics.find((t) => t.id === id)?.title ?? `#${id}`

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="New category">
          <form ref={category.ref} action={category.action} className="flex flex-col gap-4">
            <Field label="Name" id="c-name" name="name" required maxLength={100} />
            <Field label="Description" id="c-desc" name="description" maxLength={300} />
            <Field label="Order" id="c-pos" name="position" type="number" defaultValue={0} />
            <Button type="submit" disabled={category.pending} className="self-start bg-brand text-primary-foreground hover:opacity-90">
              Create category
            </Button>
          </form>
        </Card>

        <Card title="New topic">
          {categories.length === 0 ? (
            <p className="text-sm text-muted-foreground">Create a category first.</p>
          ) : (
            <form ref={topic.ref} action={topic.action} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="t-cat">Category</Label>
                <select
                  id="t-cat"
                  name="categoryId"
                  required
                  className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id} className="bg-popover">
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <Field label="Title" id="t-title" name="title" required maxLength={200} />
              <Field label="Author (MC username)" id="t-author" name="author" placeholder="Staff" maxLength={16} />
              <Field label="Content" id="t-content" name="content" textarea required rows={5} />
              <div className="flex gap-6 text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="pinned" className="size-4 accent-primary" /> Pinned
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="locked" className="size-4 accent-primary" /> Locked
                </label>
              </div>
              <Button type="submit" disabled={topic.pending} className="self-start bg-brand text-primary-foreground hover:opacity-90">
                Create topic
              </Button>
            </form>
          )}
        </Card>
      </div>

      <Card title="Categories & topics">
        {categories.length === 0 ? (
          <p className="text-sm text-muted-foreground">No categories yet.</p>
        ) : (
          <ul className="flex flex-col gap-4">
            {categories.map((c) => (
              <li key={c.id} className="rounded-md border border-border bg-secondary/40 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.description}</p>
                  </div>
                  <ConfirmForm action={deleteCategoryAction} message="Delete this category and all its topics?">
                    <input type="hidden" name="id" value={c.id} />
                    <Button type="submit" variant="ghost" size="icon" aria-label={`Delete ${c.name}`}>
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </ConfirmForm>
                </div>
                <ul className="mt-3 flex flex-col divide-y divide-border border-t border-border">
                  {topics
                    .filter((t) => t.categoryId === c.id)
                    .map((t) => (
                      <li key={t.id} className="flex items-center gap-2 py-2">
                        <span className="min-w-0 flex-1 truncate text-sm">{t.title}</span>
                        <form action={updateTopicFlagsAction}>
                          <input type="hidden" name="id" value={t.id} />
                          <input type="hidden" name="pinned" value={t.pinned ? 'false' : 'true'} />
                          <input type="hidden" name="locked" value={String(t.locked)} />
                          <Button type="submit" variant="ghost" size="icon" aria-label={t.pinned ? 'Unpin' : 'Pin'}>
                            {t.pinned ? <PinOff className="size-4 text-primary" /> : <Pin className="size-4" />}
                          </Button>
                        </form>
                        <form action={updateTopicFlagsAction}>
                          <input type="hidden" name="id" value={t.id} />
                          <input type="hidden" name="pinned" value={String(t.pinned)} />
                          <input type="hidden" name="locked" value={t.locked ? 'false' : 'true'} />
                          <Button type="submit" variant="ghost" size="icon" aria-label={t.locked ? 'Unlock' : 'Lock'}>
                            {t.locked ? <Lock className="size-4 text-primary" /> : <LockOpen className="size-4" />}
                          </Button>
                        </form>
                        <ConfirmForm action={deleteTopicAction} message="Delete this topic?">
                          <input type="hidden" name="id" value={t.id} />
                          <Button type="submit" variant="ghost" size="icon" aria-label="Delete topic">
                            <Trash2 className="size-4 text-destructive" />
                          </Button>
                        </ConfirmForm>
                      </li>
                    ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card title="Recent replies" description="Moderate replies posted by visitors.">
        {replies.length === 0 ? (
          <p className="text-sm text-muted-foreground">No replies yet.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-border">
            {replies.map((r) => (
              <li key={r.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">{r.author}</span> on {topicTitle(r.topicId)}
                  </p>
                  <p className="line-clamp-2 text-sm">{r.content}</p>
                </div>
                <ConfirmForm action={deleteReplyAction} message="Delete this reply?">
                  <input type="hidden" name="id" value={r.id} />
                  <Button type="submit" variant="ghost" size="icon" aria-label="Delete reply">
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </ConfirmForm>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}
