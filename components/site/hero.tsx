import Image from 'next/image'
import Link from 'next/link'
import { Server } from 'lucide-react'
import { getDiscordStatus, getServerStatus } from '@/lib/live-status'
import { safeUrl, type SiteSettings } from '@/lib/settings-shared'
import { CopyIp } from './copy-ip'
import { Particles } from './particles'

function DiscordLogoIcon({ className }: { className?: string }) {
  return (
    <svg className={className ?? 'size-5'} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  )
}

const THEME_HUE: Record<string, string> = {
  purple: '0deg',
  emerald: '120deg',
  ocean: '220deg',
  crimson: '355deg',
  orange: '30deg',
  pink: '300deg',
  gold: '45deg',
  midnight: '240deg',
}

export async function Hero({ settings }: { settings: SiteSettings }) {
  const { features } = settings
  const [server, discord] = await Promise.all([
    features.serverWidget ? getServerStatus(settings.serverIp) : null,
    features.discordWidget ? getDiscordStatus(settings.discordServerId) : null,
  ])
  const inviteUrl = safeUrl(discord?.invite ?? settings.discordInvite)
  const inviteLabel = inviteUrl.replace(/^https?:\/\//, '')
  const hue = THEME_HUE[settings.siteTheme] ?? '0deg'

  return (
    <header className="relative isolate overflow-hidden border-b border-border">
      <Image
        src="/images/hero-bg.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover opacity-40"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/40 via-background/60 to-background" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,color-mix(in_srgb,var(--primary)_25%,transparent),transparent_65%)]" />
      {features.particles && <Particles />}

      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 py-14 md:py-20 lg:flex-row lg:justify-between">
        {features.serverWidget ? (
          <CopyIp
            ip={settings.serverIp}
            className="group order-2 flex items-center gap-3 rounded-md text-left lg:order-1"
          >
            <span
              className="flex size-11 items-center justify-center overflow-hidden rounded-md transition-transform group-hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, var(--brand-from), var(--primary) 50%, var(--brand-to))',
                boxShadow: '0 8px 24px -4px color-mix(in srgb, var(--primary) 45%, transparent)',
              }}
            >
              <Server className="size-5 text-white" aria-hidden="true" />
            </span>
            <span className="flex flex-col">
              <span className="text-sm font-bold uppercase tracking-wide text-foreground">{settings.serverIp}</span>
              <span className="text-xs text-muted-foreground">
                {server?.online ? (
                  <>
                    <span className="font-semibold text-primary">{server.players.toLocaleString()}</span> players online
                  </>
                ) : (
                  'Click to copy IP'
                )}
              </span>
            </span>
          </CopyIp>
        ) : (
          <span className="hidden lg:order-1 lg:block lg:w-48" />
        )}

        <Link href="/" className="order-1 lg:order-2 group">
          <Image
            src="/images/reverie-logo.png"
            alt={settings.serverName}
            width={1322}
            height={493}
            priority
            className="h-auto w-72 transition-all duration-300 group-hover:scale-[1.04] md:w-[26rem]"
            style={{
              filter: `hue-rotate(${hue}) drop-shadow(0 10px 30px color-mix(in srgb, var(--primary) 45%, transparent))`,
            }}
          />
        </Link>

        {features.discordWidget && inviteUrl ? (
          <a
            href={inviteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group order-3 flex items-center gap-3 rounded-md lg:flex-row-reverse lg:text-right"
          >
            <span
              className="flex size-11 items-center justify-center rounded-md transition-transform group-hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, var(--brand-from), var(--primary) 50%, var(--brand-to))',
                boxShadow: '0 8px 24px -4px color-mix(in srgb, var(--primary) 45%, transparent)',
              }}
            >
              <DiscordLogoIcon className="size-5 text-white" />
            </span>
            <span className="flex flex-col">
              <span className="text-sm font-bold uppercase tracking-wide text-foreground">{inviteLabel}</span>
              <span className="text-xs text-muted-foreground">
                {discord ? (
                  <>
                    <span className="font-semibold text-primary">{discord.online.toLocaleString()}</span> users online
                  </>
                ) : (
                  'Join our Discord'
                )}
              </span>
            </span>
          </a>
        ) : (
          <span className="hidden lg:order-3 lg:block lg:w-48" />
        )}
      </div>
    </header>
  )
}
