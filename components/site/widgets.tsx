'use client'

import { useState } from 'react'
import type { StaffMember } from '@/lib/queries'
import { safeUrl, type SiteSettings, type SocialKey } from '@/lib/settings-shared'
import { cn } from '@/lib/utils'

export function Panel({
  title,
  action,
  children,
  className,
}: {
  title: string
  action?: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className={cn('overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-shadow duration-300 hover:shadow-md', className)}>
      <div className="relative flex items-center justify-between gap-4 border-b border-border px-5 py-3.5">
        <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1 bg-brand" />
        {/* Subtle gradient accent top border */}
        <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px" style={{ background: 'linear-gradient(90deg, var(--primary), var(--brand-to), transparent)' }} />
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </section>
  )
}

export function PageTitle({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-foreground text-balance">{title}</h1>
      {description && <p className="mt-1 text-sm text-muted-foreground text-pretty">{description}</p>}
    </div>
  )
}

export function PlayerHead({ username, size = 32 }: { username: string; size?: number }) {
  const [failed, setFailed] = useState(false)
  const px = size * 2
  const src = failed
    ? `https://mc-heads.net/avatar/${encodeURIComponent(username)}/${px}`
    : `https://crafatar.com/avatars/${encodeURIComponent(username)}?size=${px}&overlay`

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      width={size}
      height={size}
      loading="lazy"
      className="shrink-0 rounded-sm [image-rendering:pixelated] transition-transform duration-200 hover:scale-105"
      style={{
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
        objectFit: 'cover',
        flexShrink: 0,
      }}
      onError={() => setFailed(true)}
    />
  )
}

function RankIcon({ rank }: { rank: string }) {
  const r = rank.toLowerCase()
  if (r.includes('owner')) {
    // Crown
    return (
      <svg className="size-[11px] shrink-0 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
      </svg>
    )
  }
  if (r.includes('admin')) {
    // Shield
    return (
      <svg className="size-[11px] shrink-0 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
      </svg>
    )
  }
  if (r.includes('dev')) {
    // Code brackets
    return (
      <svg className="size-[11px] shrink-0 fill-none stroke-current stroke-2" viewBox="0 0 24 24" aria-hidden="true">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    )
  }
  if (r.includes('mod')) {
    // Sword
    return (
      <svg className="size-[11px] shrink-0 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M14.5 17.5L3 6V3h3l11.5 11.5-3 3zM16.5 15.5l3-3 1 1-3 3-1-1zM3 3l1 1" />
      </svg>
    )
  }
  if (r.includes('helper')) {
    // Star
    return (
      <svg className="size-[11px] shrink-0 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    )
  }
  if (r.includes('build')) {
    // Hammer
    return (
      <svg className="size-[11px] shrink-0 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M22 13.29l-5-5-9 9L3 12.29l-1 1 5 5 9-9 5 5 1-1z" />
        <circle cx="7" cy="7" r="1" />
      </svg>
    )
  }
  // Default circle
  return (
    <svg className="size-[9px] shrink-0 fill-current" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="8" />
    </svg>
  )
}

export function RankBadge({ rank, color }: { rank: string; color: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-white shadow-sm transition-all duration-200 hover:scale-105 select-none"
      style={{
        background: `linear-gradient(135deg, ${color}, color-mix(in srgb, ${color} 65%, #000))`,
        boxShadow: `0 2px 8px -1px ${color}55`,
      }}
    >
      <RankIcon rank={rank} />
      <span>{rank}</span>
    </span>
  )
}

export function OnlineStaffWidget({ staff }: { staff: StaffMember[] }) {
  const online = staff.filter((s) => s.online)
  return (
    <Panel title="Online Staff">
      {online.length === 0 ? (
        <p className="text-sm text-muted-foreground">No staff online right now.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {online.map((member) => (
            <li key={member.id} className="flex items-center gap-3">
              <PlayerHead username={member.username} />
              <span className="flex-1 truncate text-sm font-medium">{member.username}</span>
              <RankBadge rank={member.rank} color={member.color} />
            </li>
          ))}
        </ul>
      )}
      <p className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">
        Total online staff: <span className="font-semibold text-foreground">{online.length}</span>
      </p>
    </Panel>
  )
}

function DiscordLogoIcon({ className }: { className?: string }) {
  return (
    <svg className={className ?? 'size-4'} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  )
}

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className ?? 'size-4'} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className ?? 'size-4'} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.5.18-1.92 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  )
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className ?? 'size-4'} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className ?? 'size-4'} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  )
}

function TwitchIcon({ className }: { className?: string }) {
  return (
    <svg className={className ?? 'size-4'} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M11.571 4.714h1.715v5.143H11.57zm4.714 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.428l-3 3v-3H6.857V1.714h13.714Z" />
    </svg>
  )
}

type SocialMeta = { label: string; icon: React.ComponentType<{ className?: string }>; brand: string }

const SOCIAL_META: Record<SocialKey, SocialMeta> = {
  discord:   { label: 'Discord',    icon: DiscordLogoIcon, brand: '#5865F2' },
  youtube:   { label: 'YouTube',    icon: YouTubeIcon,     brand: '#FF0000' },
  tiktok:    { label: 'TikTok',     icon: TikTokIcon,      brand: '#010101' },
  twitter:   { label: 'X / Twitter',icon: XIcon,           brand: '#000000' },
  instagram: { label: 'Instagram',  icon: InstagramIcon,   brand: '#E4405F' },
  twitch:    { label: 'Twitch',     icon: TwitchIcon,      brand: '#9146FF' },
}

export function SocialsWidget({ socials }: { socials: SiteSettings['socials'] }) {
  const links = (Object.keys(SOCIAL_META) as SocialKey[])
    .map((key) => ({ key, url: safeUrl(socials[key]), ...SOCIAL_META[key] }))
    .filter((l) => l.url)
  if (links.length === 0) return null
  return (
    <Panel title="Socials">
      <ul className="grid grid-cols-2 gap-2">
        {links.map(({ key, url, label, icon: Icon, brand }) => (
          <li key={key}>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 rounded-lg border border-border bg-secondary/50 px-3 py-2.5 text-xs font-medium transition-all duration-200 hover:scale-[1.02] hover:border-transparent hover:shadow-md"
              style={{ '--brand': brand } as React.CSSProperties}
            >
              <span
                className="flex size-6 shrink-0 items-center justify-center rounded-md transition-colors"
                style={{ background: `${brand}20`, color: brand }}
              >
                <Icon className="size-3.5" />
              </span>
              <span className="truncate text-foreground transition-colors group-hover:text-foreground">{label}</span>
            </a>
          </li>
        ))}
      </ul>
    </Panel>
  )
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(date))
}
