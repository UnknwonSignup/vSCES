import Link from 'next/link'
import { Megaphone } from 'lucide-react'
import { Hero } from '@/components/site/hero'
import { Sidebar } from '@/components/site/sidebar'
import { getSettings } from '@/lib/settings'
import { safeUrl } from '@/lib/settings-shared'
import { getDiscordSession } from '@/lib/discord-auth'
import { DiscordConnect } from '@/components/site/discord-connect'
import { Chatbot } from '@/components/site/chatbot'
import { ChatbotProvider } from '@/components/site/chatbot-context'
import { cn } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings()
  const bannerLink = safeUrl(settings.banner.link)
  const discordUrl = safeUrl(settings.socials.discord)
  const discordSession = await getDiscordSession()
  const isTopbar = settings.navigationStyle === 'topbar'

  return (
    <ChatbotProvider>
      <div className={cn("min-h-dvh pb-16 md:pb-0", !isTopbar && "md:pl-20")}>
        <Sidebar
          features={settings.features}
          discordUrl={discordUrl}
          mode={settings.navigationStyle}
          serverName={settings.serverName}
        />
        {settings.banner.enabled && settings.banner.text && (
          <div className="bg-brand px-4 py-2 text-center text-sm font-medium text-primary-foreground">
            <Megaphone className="mr-2 inline size-4 align-[-3px]" aria-hidden="true" />
            {bannerLink ? (
              <a href={bannerLink} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                {settings.banner.text}
              </a>
            ) : (
              settings.banner.text
            )}
          </div>
        )}
        <div className="relative">
          <div className="absolute right-4 top-3 z-20">
            <DiscordConnect session={discordSession} />
          </div>
          <Hero settings={settings} />
        </div>
        <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>
        <footer className="border-t border-border">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row">
            <p>
              {'© '}
              {new Date().getFullYear()} <span className="text-brand font-semibold">{settings.serverName}</span>. All rights
              reserved.
            </p>
            <p>{settings.footerText}</p>
            <Link href="/" className="sr-only">
              Home
            </Link>
          </div>
        </footer>
        <Chatbot />
      </div>
    </ChatbotProvider>
  )
}
