'use client'

import { useActionState, useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { ActionState } from '@/app/actions/admin'
import { cn } from '@/lib/utils'

export function Card({
  title,
  description,
  children,
  className,
}: {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className={cn('rounded-lg border border-border bg-card', className)}>
      <div className="relative border-b border-border px-5 py-4">
        <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1 bg-brand" />
        <h2 className="font-semibold">{title}</h2>
        {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
      </div>
      <div className="p-5">{children}</div>
    </section>
  )
}

export function Field({
  label,
  id,
  hint,
  textarea,
  ...props
}: {
  label: string
  id: string
  hint?: string
  textarea?: boolean
} & React.InputHTMLAttributes<HTMLInputElement> &
  React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      {textarea ? <Textarea id={id} rows={4} {...props} /> : <Input id={id} {...props} />}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}

export function useToastForm(
  fn: (prev: ActionState, fd: FormData) => Promise<ActionState>,
) {
  const [state, action, pending] = useActionState(fn, null)
  const ref = useRef<HTMLFormElement>(null)
  useEffect(() => {
    if (!state) return
    if (state.ok) {
      toast.success(state.message)
      ref.current?.reset()
    } else {
      toast.error(state.message)
    }
  }, [state])
  return { action, pending, ref }
}
