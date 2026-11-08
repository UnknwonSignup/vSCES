'use client'

import { useEffect, useState } from 'react'
import { Copy, Check, Users, Sparkles } from 'lucide-react'
import { toast } from 'sonner'

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg className={className ?? 'size-4'} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  )
}

export function FloatingQuickDock({
  serverIp,
  discordUrl,
}: {
  serverIp: string
  discordUrl?: string | null
}) {
  const [visible, setVisible] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled down 260px
      setVisible(window.scrollY > 260)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const copyIp = async () => {
    try {
      await navigator.clipboard.writeText(serverIp)
      setCopied(true)
      toast.success('Server IP copied!', { description: serverIp })
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Could not copy IP', { description: serverIp })
    }
  }

  if (!visible) return null

  return (
    <aside
      aria-label="Quick play actions"
      className="fixed bottom-20 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5 rounded-full border border-border/80 bg-background/90 px-4 py-2 shadow-2xl backdrop-blur-md transition-all duration-300 hover:border-primary/50 md:bottom-6"
    >
      {/* Live Server Indicator */}
      <div className="flex items-center gap-2 pr-1">
        <span className="relative flex size-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
        </span>
        <span className="hidden text-xs font-bold text-foreground sm:inline">
          {serverIp}
        </span>
      </div>

      <button
        type="button"
        onClick={copyIp}
        className="flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-sm transition-transform hover:scale-105 active:scale-95"
      >
        {copied ? (
          <>
            <Check className="size-3" />
            <span>Copied!</span>
          </>
        ) : (
          <>
            <Copy className="size-3" />
            <span>Copy IP</span>
          </>
        )}
      </button>

      {discordUrl && (
        <a
          href={discordUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-full border border-border/70 bg-secondary px-3 py-1 text-xs font-semibold text-muted-foreground transition-all hover:bg-[#5865F2]/15 hover:text-[#5865F2] hover:border-[#5865F2]/40"
        >
          <DiscordIcon className="size-3 text-[#5865F2]" />
          <span className="hidden xs:inline">Discord</span>
        </a>
      )}
    </aside>
  )
}
