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
  | 'highlightBadges'
  | 'howToJoin'
  | 'featuresList'

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
  highlightBadges: { label: 'Homepage Highlights Ribbon', description: 'The 4 highlight badges beneath the hero.' },
  howToJoin: { label: 'Connection Guide', description: 'The How to Join section with IP copy buttons.' },
  featuresList: { label: 'Features Showcase', description: 'The "Why Play" features grid.' },
}

export type SocialKey = 'discord' | 'youtube' | 'tiktok' | 'twitter' | 'instagram' | 'twitch'

export type LinkItem = { name: string; url: string }
export type RuleItem = { title: string; body: string }
export type StorePackage = { name: string; price: string; description: string; url: string }

export type HighlightBadge = {
  id?: string
  label: string
  desc: string
  icon: string
  color: string
  enabled?: boolean
}

export type FeatureCard = {
  id?: string
  title: string
  description: string
  tag: string
  icon: string
  color: string
  enabled?: boolean
}

export type HowToJoinSettings = {
  enabled?: boolean
  showJava?: boolean
  showBedrock?: boolean
  javaIp: string
  bedrockIp: string
  bedrockPort: string
  javaVersion: string
  bedrockVersion: string
}

export type NavigationStyle = 'sidebar' | 'topbar'

export type SiteSettings = {
  serverName: string
  tagline: string
  serverIp: string
  discordInvite: string
  discordServerId: string
  storeUrl: string
  footerText: string
  logoUrl?: string
  siteTheme: SiteTheme
  navigationStyle: NavigationStyle
  banner: { enabled: boolean; text: string; link: string }
  socials: Record<SocialKey, string>
  features: Record<FeatureKey, boolean>
  voteLinks: LinkItem[]
  rules: RuleItem[]
  storePackages: StorePackage[]
  highlightBadges: HighlightBadge[]
  howToJoin: HowToJoinSettings
  featuresList: FeatureCard[]
}

export const DEFAULT_SETTINGS: SiteSettings = {
  serverName: 'Reverie SMP',
  tagline: 'A dreamy survival experience. Build, explore and make memories with friends.',
  serverIp: 'play.reveriesmp.net',
  discordInvite: 'https://discord.gg/reverie',
  discordServerId: '',
  storeUrl: '',
  footerText: 'Reverie SMP is not affiliated with Mojang AB or Microsoft.',
  logoUrl: '',
  siteTheme: 'purple',
  navigationStyle: 'sidebar',
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
    highlightBadges: true,
    howToJoin: true,
    featuresList: true,
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
  highlightBadges: [
    { id: 'badge-1', label: 'Vanilla+ Survival SMP', desc: 'Enhanced mechanics & claims', icon: 'sparkles', color: 'purple', enabled: true },
    { id: 'badge-2', label: '100% Grief Protected', desc: 'Build safely with shovel claims', icon: 'shield', color: 'emerald', enabled: true },
    { id: 'badge-3', label: 'Active Community', desc: 'Friendly staff & active Discord', icon: 'users', color: 'blue', enabled: true },
    { id: 'badge-4', label: 'Vote & Earn Rewards', desc: 'Daily keys, cash & perks', icon: 'trophy', color: 'amber', enabled: true },
  ],
  howToJoin: {
    enabled: true,
    showJava: true,
    showBedrock: true,
    javaIp: 'play.reveriesmp.net',
    bedrockIp: 'play.reveriesmp.net',
    bedrockPort: '19132',
    javaVersion: '1.20 - 1.21.x',
    bedrockVersion: 'Latest',
  },
  featuresList: [
    {
      id: 'feat-1',
      title: 'Grief-Free Land Claims',
      description: 'Claim your territory effortlessly with a golden shovel. Trust friends, configure permissions, and build your dream base with 100% protection.',
      tag: 'Anti-Grief',
      icon: 'shield',
      color: 'emerald',
      enabled: true,
    },
    {
      id: 'feat-2',
      title: 'Player-Driven Economy',
      description: 'Create player chest shops, trade in the /ah Auction House, and earn currency through jobs, mining, and farming. Zero pay-to-win mechanics.',
      tag: 'Economy',
      icon: 'coins',
      color: 'amber',
      enabled: true,
    },
    {
      id: 'feat-3',
      title: 'Custom Enchantments',
      description: 'Discover over 50+ unique, balanced custom enchants. Combine enchants, forge legendary tools, and stand out in both PvE dungeons and PvP battles.',
      tag: 'Enchants',
      icon: 'sparkles',
      color: 'purple',
      enabled: true,
    },
    {
      id: 'feat-4',
      title: 'Dungeons & World Bosses',
      description: 'Team up with fellow players to conquer instanced dungeons, defeat custom world bosses, and earn exclusive cosmetic rewards and rare crate keys.',
      tag: 'PvE & Bosses',
      icon: 'swords',
      color: 'rose',
      enabled: true,
    },
    {
      id: 'feat-5',
      title: 'Skills & Progression',
      description: 'Level up your mcMMO-style stats through everyday actions. Master woodcutting, fishing, archery, and mining to unlock passive abilities.',
      tag: 'Skills',
      icon: 'compass',
      color: 'blue',
      enabled: true,
    },
    {
      id: 'feat-6',
      title: 'Java & Bedrock Crossplay',
      description: 'Play anywhere, anytime! Full crossplay support allows PC (Java) and Mobile, Console, or Windows 10 (Bedrock) players to explore together seamlessly.',
      tag: 'Crossplay',
      icon: 'smartphone',
      color: 'cyan',
      enabled: true,
    },
  ],
}

const str = (value: unknown, fallback: string, max = 2000) =>
  typeof value === 'string' ? value.slice(0, max) : fallback
const bool = (value: unknown, fallback: boolean) => (typeof value === 'boolean' ? value : fallback)
const arr = <T,>(value: unknown, map: (item: Record<string, unknown>, index: number) => T, max = 50): T[] | null =>
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
  const rawHowToJoin = (raw.howToJoin ?? {}) as Record<string, unknown>

  return {
    serverName: str(raw.serverName, d.serverName, 80),
    tagline: str(raw.tagline, d.tagline, 300),
    serverIp: str(raw.serverIp, d.serverIp, 120),
    discordInvite: str(raw.discordInvite, d.discordInvite, 300),
    discordServerId: str(raw.discordServerId, d.discordServerId, 40).replace(/\D/g, ''),
    storeUrl: str(raw.storeUrl, d.storeUrl, 300),
    footerText: str(raw.footerText, d.footerText, 300),
    logoUrl: typeof raw.logoUrl === 'string' ? raw.logoUrl : d.logoUrl,
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
    navigationStyle: (raw.navigationStyle === 'topbar' ? 'topbar' : 'sidebar') as NavigationStyle,
    highlightBadges:
      arr(raw.highlightBadges, (i, idx) => ({
        id: str(i.id, `badge-${idx + 1}`, 50),
        label: str(i.label, '', 80),
        desc: str(i.desc, '', 160),
        icon: str(i.icon, 'sparkles', 40),
        color: str(i.color, 'purple', 40),
        enabled: bool(i.enabled, true),
      })) ?? d.highlightBadges,
    howToJoin: {
      enabled: bool(rawHowToJoin.enabled, d.howToJoin.enabled ?? true),
      showJava: bool(rawHowToJoin.showJava, d.howToJoin.showJava ?? true),
      showBedrock: bool(rawHowToJoin.showBedrock, d.howToJoin.showBedrock ?? true),
      javaIp: str(rawHowToJoin.javaIp, d.howToJoin.javaIp, 120),
      bedrockIp: str(rawHowToJoin.bedrockIp, d.howToJoin.bedrockIp, 120),
      bedrockPort: str(rawHowToJoin.bedrockPort, d.howToJoin.bedrockPort, 10),
      javaVersion: str(rawHowToJoin.javaVersion, d.howToJoin.javaVersion, 40),
      bedrockVersion: str(rawHowToJoin.bedrockVersion, d.howToJoin.bedrockVersion, 40),
    },
    featuresList:
      arr(raw.featuresList, (i, idx) => ({
        id: str(i.id, `feat-${idx + 1}`, 50),
        title: str(i.title, '', 100),
        description: str(i.description, '', 300),
        tag: str(i.tag, '', 40),
        icon: str(i.icon, 'sparkles', 40),
        color: str(i.color, 'purple', 40),
        enabled: bool(i.enabled, true),
      })) ?? d.featuresList,
  }
}
        icon: str(i.icon, 'sparkles', 40),
        color: str(i.color, 'purple', 40),
      })) ?? d.featuresList,
  }
}

export function safeUrl(url: string) {
  return /^https?:\/\//i.test(url) ? url : ''
}
