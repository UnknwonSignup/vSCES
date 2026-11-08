import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, LifeBuoy, ShieldCheck } from 'lucide-react'
import { getSettings } from '@/lib/settings'
import { safeUrl } from '@/lib/settings-shared'
import { getDiscordSession } from '@/lib/discord-auth'
import { DiscordConnect } from '@/components/site/discord-connect'
import { Chatbot } from '@/components/site/chatbot'
import { ChatbotProvider } from '@/components/site/chatbot-context'

export const dynamic = 'force-dynamic'

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg className={className ?? 'size-4'} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  )
}

export default async function TicketsLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings()
  const discordSession = await getDiscordSession()
  const discordUrl = safeUrl(settings.socials.discord)

  return (
    <ChatbotProvider>
      <div className="relative min-h-dvh bg-background text-foreground flex flex-col selection:bg-primary/20 selection:text-primary">
        {/* Subtle background ambient mesh */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
        >
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-96 w-[700px] rounded-full bg-gradient-to-b from-primary/15 via-primary/5 to-transparent blur-3xl opacity-70" />
          <div className="absolute top-1/3 -left-48 h-80 w-80 rounded-full bg-brand/10 blur-3xl opacity-50" />
          <div className="absolute bottom-10 -right-48 h-80 w-80 rounded-full bg-primary/10 blur-3xl opacity-40" />
        </div>

        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/85 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
            {/* Top Left: Back button + Portal Logo */}
            <div className="flex items-center gap-3 sm:gap-4">
              <Link
                href="/"
                className="group inline-flex items-center gap-2 rounded-full border border-border/80 bg-secondary/60 px-3.5 py-1.5 text-xs font-semibold text-foreground/80 shadow-sm backdrop-blur transition-all duration-200 hover:border-primary/50 hover:bg-secondary hover:text-foreground hover:scale-[1.02] active:scale-95"
                title="Return to main website"
              >
                <ArrowLeft className="size-3.5 text-muted-foreground transition-transform group-hover:-translate-x-0.5 group-hover:text-primary" />
                <span>Back to Website</span>
              </Link>

              <span className="hidden h-5 w-px bg-border sm:block" aria-hidden="true" />

              <Link href="/" className="hidden items-center gap-2.5 transition-opacity hover:opacity-85 sm:flex">
                <Image
                  src={settings.logoUrl || '/images/reverie-logo.png'}
                  alt={settings.serverName}
                  width={1322}
                  height={493}
                  unoptimized={Boolean(settings.logoUrl?.startsWith('data:'))}
                  className="h-7 w-auto drop-shadow-sm"
                  priority
                />
                <span className="inline-flex items-center gap-1 rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                  <LifeBuoy className="size-3" /> Support Desk
                </span>
              </Link>
            </div>

            {/* Top Right: Discord Community link & Auth Connect */}
            <div className="flex items-center gap-3">
              {discordUrl && (
                <a
                  href={discordUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden items-center gap-1.5 rounded-full border border-border/60 bg-secondary/40 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all duration-200 hover:border-[#5865F2]/50 hover:bg-[#5865F2]/10 hover:text-[#5865F2] md:inline-flex"
                >
                  <DiscordIcon className="size-3.5 text-[#5865F2]" />
                  <span>Join Discord</span>
                </a>
              )}
              <DiscordConnect session={discordSession} />
            </div>
          </div>
        </header>

        {/* Dedicated Support Page Body */}
        <main className="flex-1 py-8 sm:py-12">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            {children}
          </div>
        </main>

        {/* Minimal Support Portal Footer */}
        <footer className="mt-auto border-t border-border/60 bg-card/40 py-6 text-center text-xs text-muted-foreground backdrop-blur-sm">
          <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-3 px-4 sm:flex-row sm:px-6">
            <p className="flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-primary" />
              <span>{settings.serverName} Official Support Portal</span>
            </p>
            <div className="flex items-center gap-4">
              <Link href="/" className="hover:text-foreground transition-colors">
                Main Website
              </Link>
              {discordUrl && (
                <a href={discordUrl} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                  Discord Server
                </a>
              )}
              <Link href="/rules" className="hover:text-foreground transition-colors">
                Server Rules
              </Link>
            </div>
          </div>
        </footer>

        {/* Chatbot accessible via bottom floating button on support page */}
        <Chatbot />
      </div>
    </ChatbotProvider>
  )
}
