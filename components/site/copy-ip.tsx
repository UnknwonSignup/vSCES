'use client'

import { toast } from 'sonner'

export function CopyIp({ ip, children, className }: { ip: string; children: React.ReactNode; className?: string }) {
  return (
    <button
      type="button"
      className={className}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(ip)
          toast.success('Server IP copied!', { description: ip })
        } catch {
          toast.error('Could not copy IP', { description: ip })
        }
      }}
    >
      {children}
    </button>
  )
}
