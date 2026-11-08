'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Home, MessagesSquare, ScrollText, ShoppingCart, ThumbsUp, Ticket, Users, Bot, Sparkles } from 'lucide-react'
import type { FeatureKey, NavigationStyle } from '@/lib/settings-shared'
import { cn } from '@/lib/utils'
import { useChatbot } from './chatbot-context'

const NAV: { href: string; label: string; icon: typeof Home; feature?: FeatureKey }[] = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/forum', label: 'Forum', icon: MessagesSquare, feature: 'forum' },
  { href: '/staff', label: 'Staff', icon: Users, feature: 'staff' },
  { href: '/store', label: 'Store', icon: ShoppingCart, feature: 'store' },
  { href: '/vote', label: 'Vote', icon: ThumbsUp, feature: 'vote' },
  { href: '/rules', label: 'Rules', icon: ScrollText, feature: 'rules' },
  { href: '/tickets', label: 'Tickets', icon: Ticket, feature: 'tickets' },
]

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? 'size-4'}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  )
}

export function Sidebar({
  features,
  discordUrl,
  mode = 'sidebar',
  serverName = 'Reverie SMP',
}: {
  features: Record<FeatureKey, boolean>
  discordUrl?: string | null
  mode?: NavigationStyle
  serverName?: string
}) {
  const pathname = usePathname()
  const { open: chatOpen, toggle: toggleChat } = useChatbot()
  const items = NAV.filter((item) => !item.feature || features[item.feature])

  // ── Top Bar Mode ──────────────────────────────────────────────────────────
  if (mode === 'topbar') {
    return (
      <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/80 backdrop-blur-xl transition-all">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative size-8 overflow-hidden rounded-lg border border-primary/30 bg-primary/10 shadow-sm transition-transform duration-200 group-hover:scale-105">
              <Image
                src="/images/reverie-logo.png"
                alt={serverName}
                fill
                className="object-contain p-1"
                priority
              />
            </div>
            <span className="font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
              {serverName}
            </span>
          </Link>

          <nav aria-label="Top navigation" className="hidden md:flex items-center gap-1">
            {items.map(({ href, label, icon: Icon }) => {
              const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'relative flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all duration-200',
                    active
                      ? 'bg-primary/15 text-primary shadow-sm border border-primary/25'
                      : 'text-muted-foreground hover:bg-secondary/70 hover:text-foreground'
                  )}
                >
                  <Icon className="size-3.5" />
                  <span>{label}</span>
                  {active && (
                    <span className="absolute -bottom-px left-1/2 -translate-x-1/2 h-0.5 w-6 rounded-full bg-primary" />
                  )}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleChat}
              aria-label="Open AI chat"
              className={cn(
                'flex items-center gap-1.5 rounded-xl border border-border/80 px-3 py-1.5 text-xs font-semibold transition-all duration-200',
                chatOpen
                  ? 'bg-primary text-primary-foreground border-primary shadow-md'
                  : 'bg-card/80 text-muted-foreground hover:border-primary/40 hover:text-foreground'
              )}
            >
              <Bot className="size-3.5" />
              <span className="hidden sm:inline">AI Chat</span>
            </button>

            {discordUrl && (
              <a
                href={discordUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-xl bg-[#5865F2] px-3.5 py-1.5 text-xs font-bold text-white shadow-md shadow-[#5865F2]/20 transition-all hover:bg-[#4752c4] hover:scale-[1.02] active:scale-95"
              >
                <DiscordIcon className="size-3.5" />
                <span className="hidden sm:inline">Discord</span>
              </a>
            )}
          </div>
        </div>

        {/* Mobile bottom nav bar when in topbar mode */}
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-background/95 backdrop-blur-md md:hidden">
          <ul className="flex h-14 items-center justify-around px-2">
            {items.map(({ href, label, icon: Icon }) => {
              const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={cn(
                      'flex flex-col items-center gap-0.5 rounded-lg p-1.5 text-[10px] font-medium transition-colors',
                      active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <Icon className="size-4" />
                    <span>{label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </header>
    )
  }

  // ── Modern Sidebar Mode ───────────────────────────────────────────────────
  const itemCls = (active?: boolean) =>
    cn(
      'group relative flex flex-col items-center gap-1 rounded-xl px-2.5 py-2 text-[10px] font-medium text-muted-foreground transition-all duration-200 hover:text-foreground',
      active && 'text-foreground font-semibold',
    )

  const iconCls = (active?: boolean) =>
    cn(
      'flex size-10 items-center justify-center rounded-xl border border-transparent transition-all duration-200 group-hover:bg-secondary group-hover:scale-105',
      active
        ? 'bg-gradient-to-br from-primary via-primary to-brand-to text-primary-foreground border-primary/40 shadow-[0_0_24px_-2px] shadow-primary/60 scale-105'
        : 'text-muted-foreground',
    )

  return (
    <nav
      aria-label="Main navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-sidebar/95 backdrop-blur-xl md:inset-y-0 md:left-0 md:right-auto md:w-20 md:border-r md:border-t-0 md:py-4"
    >
      <ul className="flex h-16 items-center justify-around md:h-full md:flex-col md:justify-start md:gap-3">
        {/* Server Emblem at Top of Sidebar */}
        <li className="hidden md:block mb-2">
          <Link href="/" className="group flex size-11 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 shadow-sm transition-all duration-200 hover:border-primary/60 hover:scale-105">
            <Image
              src="/images/reverie-logo.png"
              alt={serverName}
              width={32}
              height={32}
              className="size-7 object-contain"
              priority
            />
          </Link>
        </li>

        {items.map(({ href, label, icon: Icon }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                className={itemCls(active)}
              >
                <span className={iconCls(active)}>
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <span className="truncate max-w-[64px]">{label}</span>
              </Link>
            </li>
          )
        })}

        {/* Spacer */}
        <li className="hidden flex-1 md:block" aria-hidden="true" />

        {/* AI Chat button */}
        <li>
          <button
            onClick={toggleChat}
            aria-label="Open AI chat"
            aria-pressed={chatOpen}
            className={itemCls(chatOpen)}
          >
            <span className={iconCls(chatOpen)}>
              <Bot className="size-4" aria-hidden="true" />
            </span>
            <span className="hidden md:block truncate">AI Chat</span>
          </button>
        </li>

        {/* Discord link */}
        {discordUrl && (
          <li>
            <a
              href={discordUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Discord"
              className={itemCls()}
            >
              <span className={iconCls()}>
                <DiscordIcon className="size-4 text-[#5865F2]" />
              </span>
              <span className="hidden md:block truncate">Discord</span>
            </a>
          </li>
        )}
      </ul>
    </nav>
  )
}
  const pathname = usePathname()
  const { open: chatOpen, toggle: toggleChat } = useChatbot()
  const items = NAV.filter((item) => !item.feature || features[item.feature])

  const itemCls = (active?: boolean) =>
    cn(
      'group relative flex flex-col items-center gap-1 rounded-md px-3 py-2 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground',
      active && 'text-foreground',
    )

  const iconCls = (active?: boolean) =>
    cn(
      'flex size-9 items-center justify-center rounded-md transition-colors group-hover:bg-accent',
      active && 'bg-brand text-primary-foreground shadow-[0_0_20px_-4px] shadow-primary group-hover:bg-brand',
    )

  return (
    <nav
      aria-label="Main navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-sidebar-border bg-sidebar/95 backdrop-blur md:inset-y-0 md:left-0 md:right-auto md:w-20 md:border-r md:border-t-0"
    >
      <ul className="flex h-16 items-center justify-around md:h-full md:flex-col md:justify-center md:gap-3">
        {items.map(({ href, label, icon: Icon }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                className={itemCls(active)}
              >
                <span className={iconCls(active)}>
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                {label}
              </Link>
            </li>
          )
        })}

        {/* Spacer — pushes Discord + Chat to bottom on desktop */}
        <li className="hidden flex-1 md:block" aria-hidden="true" />

        {/* AI Chat button */}
        <li>
          <button
            onClick={toggleChat}
            aria-label="Open AI chat"
            aria-pressed={chatOpen}
            className={itemCls(chatOpen)}
          >
            <span className={iconCls(chatOpen)}>
              <Bot className="size-4" aria-hidden="true" />
            </span>
            <span className="hidden md:block">AI Chat</span>
          </button>
        </li>

        {/* Discord link */}
        {discordUrl && (
          <li>
            <a
              href={discordUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Join our Discord"
              className={itemCls()}
            >
              <span className={cn(iconCls(), 'group-hover:bg-[#5865F2]/20 group-hover:text-[#7289da]')}>
                <DiscordIcon className="size-4" />
              </span>
              <span className="hidden md:block">Discord</span>
            </a>
          </li>
        )}
      </ul>
    </nav>
  )
}
