'use client'

import { useState } from 'react'
import { LogOut, Loader2 } from 'lucide-react'
import type { DiscordSession } from '@/lib/discord-auth'

export function DiscordConnect({ session }: { session: DiscordSession | null }) {
  const [loading, setLoading] = useState(false)

  if (session) {
    const avatarUrl = session.avatar
      ? `https://cdn.discordapp.com/avatars/${session.id}/${session.avatar}.png?size=64`
      : `https://cdn.discordapp.com/embed/avatars/${Number(BigInt(session.id) >> 22n) % 6}.png`

    return (
      <div className="group flex items-center gap-2.5 rounded-full border border-border/80 bg-card/85 px-3 py-1.5 shadow-lg backdrop-blur-md transition-all duration-300 hover:border-primary/50 hover:shadow-primary/10">
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={avatarUrl}
            alt=""
            width={24}
            height={24}
            className="size-6 rounded-full object-cover ring-2 ring-emerald-500/30 transition-transform duration-300 group-hover:scale-105"
          />
          <span className="absolute -bottom-0.5 -right-0.5 size-2 rounded-full bg-emerald-500 ring-1 ring-card" />
        </div>
        <span className="max-w-[120px] truncate text-xs font-semibold text-foreground sm:max-w-[160px]">
          {session.username}
        </span>
        <a
          href="/api/auth/discord/logout"
          onClick={() => setLoading(true)}
          title="Disconnect Discord account"
          className="ml-1 inline-flex items-center gap-1 rounded-full border border-border/60 bg-secondary/70 px-2 py-0.5 text-[11px] font-medium text-muted-foreground transition-all duration-200 hover:border-destructive/40 hover:bg-destructive/15 hover:text-destructive active:scale-95"
        >
          {loading ? (
            <Loader2 className="size-3 animate-spin text-muted-foreground" />
          ) : (
            <>
              <LogOut className="size-3" />
              <span className="hidden sm:inline">Logout</span>
            </>
          )}
        </a>
      </div>
    )
  }

  return (
    <a
      href="/api/auth/discord"
      onClick={() => setLoading(true)}
      className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-[#5865F2]/40 bg-[#5865F2]/15 px-3.5 py-1.5 text-xs font-semibold text-[#818cf8] shadow-sm backdrop-blur-md transition-all duration-300 hover:scale-[1.03] hover:border-[#5865F2]/80 hover:bg-[#5865F2]/25 hover:shadow-[0_0_15px_-3px_rgba(88,101,242,0.5)] active:scale-95"
    >
      <span className="absolute inset-0 -z-10 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-[100%]" />
      {loading ? (
        <Loader2 className="size-4 animate-spin text-[#818cf8]" />
      ) : (
        <svg
          className="size-4 shrink-0 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
        </svg>
      )}
      <span>{loading ? 'Connecting…' : 'Connect Account'}</span>
    </a>
  )
}
