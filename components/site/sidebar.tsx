'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, MessagesSquare, ScrollText, ShoppingCart, ThumbsUp, Ticket, Users, Bot } from 'lucide-react'
import type { FeatureKey } from '@/lib/settings-shared'
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
}: {
  features: Record<FeatureKey, boolean>
  discordUrl?: string | null
}) {
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
