import { VALID_THEMES, type SiteTheme } from './site-themes'

export type FeatureKey =
  | 'announcements'
  | 'forum'
  | 'forumReplies'
  | 'staff'
  | 'store'
  | 'vote'
  | 'rules'
  | 'serverWidget'
  | 'discordWidget'
  | 'onlineStaffWidget'
  | 'socialsWidget'
  | 'particles'
  | 'tickets'

export const FEATURE_LABELS: Record<FeatureKey, { label: string; description: string }> = {
  announcements: { label: 'Announcements', description: 'News feed on the home page.' },
  forum: { label: 'Forum', description: 'The /forum section and its nav link.' },
  forumReplies: { label: 'Forum replies', description: 'Let visitors reply to unlocked topics.' },
  staff: { label: 'Staff page', description: 'The /staff page and its nav link.' },
  store: { label: 'Store page', description: 'The /store page and its nav link.' },
  vote: { label: 'Vote page', description: 'The /vote page and its nav link.' },
  rules: { label: 'Rules page', description: 'The /rules page and its nav link.' },
  serverWidget: { label: 'Server IP widget', description: 'Hero widget with IP and live player count.' },
  discordWidget: { label: 'Discord widget', description: 'Hero widget with Discord invite and online count.' },
  onlineStaffWidget: { label: 'Online staff widget', description: 'Sidebar card listing online staff.' },
  socialsWidget: { label: 'Socials widget', description: 'Sidebar card with social links.' },
  particles: { label: 'Floating particles', description: 'Animated purple particles in the hero.' },
  tickets: { label: 'Support Tickets', description: 'The /tickets page and its nav link.' },
}

export type SocialKey = 'discord' | 'youtube' | 'tiktok' | 'twitter' | 'instagram' | 'twitch'

export type LinkItem = { name: string; url: string }
export type RuleItem = { title: string; body: string }
export type StorePackage = { name: string; price: string; description: string; url: string }

export type SiteSettings = {
  serverName: string
  tagline: string
  serverIp: string
  discordInvite: string
  discordServerId: string
  storeUrl: string
  footerText: string
  siteTheme: SiteTheme
  banner: { enabled: boolean; text: string; link: string }
  socials: Record<SocialKey, string>
  features: Record<FeatureKey, boolean>
  voteLinks: LinkItem[]
  rules: RuleItem[]
  storePackages: StorePackage[]
}

export const DEFAULT_SETTINGS: SiteSettings = {
  serverName: 'Reverie SMP',
  tagline: 'A dreamy survival experience. Build, explore and make memories with friends.',
  serverIp: 'play.reveriesmp.net',
  discordInvite: 'https://discord.gg/reverie',
  discordServerId: '',
  storeUrl: '',
  footerText: 'Reverie SMP is not affiliated with Mojang AB or Microsoft.',
  siteTheme: 'purple',
  banner: { enabled: false, text: 'Season 1 is now live! Join today.', link: '' },
  socials: { discord: 'https://discord.gg/reverie', youtube: '', tiktok: '', twitter: '', instagram: '', twitch: '' },
  features: {
    announcements: true,
    forum: true,
    forumReplies: true,
    staff: true,
    store: true,
    vote: true,
    rules: true,
    serverWidget: true,
    discordWidget: true,
    onlineStaffWidget: true,
    socialsWidget: true,
    particles: true,
    tickets: true,
  },
  voteLinks: [
    { name: 'Minecraft Server List', url: 'https://minecraft-server-list.com' },
    { name: 'Planet Minecraft', url: 'https://www.planetminecraft.com' },
  ],
  rules: [
    { title: 'Be respectful', body: 'Treat every player and staff member with kindness. No harassment, hate speech or discrimination.' },
    { title: 'No cheating', body: 'Hacked clients, x-ray and unfair modifications are strictly forbidden.' },
    { title: 'No griefing', body: 'Do not destroy or steal from builds that are not yours.' },
  ],
  storePackages: [
    { name: 'Dreamer Rank', price: '$4.99', description: 'Colored name, /hat, 2 extra homes.', url: '' },
    { name: 'Lucid Rank', price: '$9.99', description: 'Everything in Dreamer plus /fly in spawn and 5 extra homes.', url: '' },
    { name: 'Reverie Rank', price: '$19.99', description: 'All perks, custom tag and priority queue.', url: '' },
  ],
}

const str = (value: unknown, fallback: string, max = 2000) =>
  typeof value === 'string' ? value.slice(0, max) : fallback
const bool = (value: unknown, fallback: boolean) => (typeof value === 'boolean' ? value : fallback)
const arr = <T,>(value: unknown, map: (item: Record<string, unknown>) => T, max = 50): T[] | null =>
  Array.isArray(value)
    ? value
        .filter((item): item is Record<string, unknown> => typeof item === 'object' && item !== null)
        .slice(0, max)
        .map(map)
    : null

export function normalizeSettings(input: unknown): SiteSettings {
  const raw = (typeof input === 'object' && input !== null ? input : {}) as Record<string, unknown>
  const d = DEFAULT_SETTINGS
  const banner = (raw.banner ?? {}) as Record<string, unknown>
  const socials = (raw.socials ?? {}) as Record<string, unknown>
  const features = (raw.features ?? {}) as Record<string, unknown>
  const rawTheme = raw.siteTheme ?? (raw as Record<string,unknown>).ipButtonTheme // migrate old key
  const theme = VALID_THEMES.includes(rawTheme as SiteTheme) ? (rawTheme as SiteTheme) : d.siteTheme

  return {
    serverName: str(raw.serverName, d.serverName, 80),
    tagline: str(raw.tagline, d.tagline, 300),
    serverIp: str(raw.serverIp, d.serverIp, 120),
    discordInvite: str(raw.discordInvite, d.discordInvite, 300),
    discordServerId: str(raw.discordServerId, d.discordServerId, 40).replace(/\D/g, ''),
    storeUrl: str(raw.storeUrl, d.storeUrl, 300),
    footerText: str(raw.footerText, d.footerText, 300),
    siteTheme: theme,
    banner: {
      enabled: bool(banner.enabled, d.banner.enabled),
      text: str(banner.text, d.banner.text, 200),
      link: str(banner.link, d.banner.link, 300),
    },
    socials: Object.fromEntries(
      (Object.keys(d.socials) as SocialKey[]).map((key) => [key, str(socials[key], d.socials[key], 300)]),
    ) as Record<SocialKey, string>,
    features: Object.fromEntries(
      (Object.keys(d.features) as FeatureKey[]).map((key) => [key, bool(features[key], d.features[key])]),
    ) as Record<FeatureKey, boolean>,
    voteLinks: arr(raw.voteLinks, (i) => ({ name: str(i.name, '', 80), url: str(i.url, '', 300) })) ?? d.voteLinks,
    rules: arr(raw.rules, (i) => ({ title: str(i.title, '', 120), body: str(i.body, '', 1000) })) ?? d.rules,
    storePackages:
      arr(raw.storePackages, (i) => ({
        name: str(i.name, '', 80),
        price: str(i.price, '', 20),
        description: str(i.description, '', 300),
        url: str(i.url, '', 300),
      })) ?? d.storePackages,
  }
}

export function safeUrl(url: string) {
  return /^https?:\/\//i.test(url) ? url : ''
}
