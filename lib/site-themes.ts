/**
 * Site-wide accent themes — each defines the full set of CSS custom properties
 * that override the default purple palette injected in globals.css.
 * Applied as a <style> tag in the root layout from the saved setting.
 */

export type SiteTheme =
  | 'purple'
  | 'emerald'
  | 'ocean'
  | 'crimson'
  | 'orange'
  | 'pink'
  | 'gold'
  | 'midnight'

export const SITE_THEME_LABELS: Record<SiteTheme, string> = {
  purple:   'Reverie Purple',
  emerald:  'Emerald Forest',
  ocean:    'Deep Ocean',
  crimson:  'Crimson',
  orange:   'Sunset Orange',
  pink:     'Hot Pink',
  gold:     'Golden',
  midnight: 'Midnight Blue',
}

type ThemeVars = {
  primary: string
  primaryForeground: string
  ring: string
  brandFrom: string
  brandTo: string
  background: string
  foreground: string
  card: string
  cardForeground: string
  popover: string
  border: string
  input: string
  secondary: string
  accent: string
  muted: string
  mutedForeground: string
  sidebar: string
  sidebarBorder: string
}

const THEMES: Record<SiteTheme, ThemeVars> = {
  purple: {
    primary: '#a855f7',
    primaryForeground: '#ffffff',
    ring: '#a855f7',
    brandFrom: '#c026d3',
    brandTo: '#6d28d9',
    background: '#0b0910',
    foreground: '#ece8f3',
    card: '#14111b',
    cardForeground: '#ece8f3',
    popover: '#17131f',
    border: '#2a2238',
    input: '#2a2238',
    secondary: '#1d1828',
    accent: '#241d33',
    muted: '#1d1828',
    mutedForeground: '#9a93a8',
    sidebar: '#0f0c15',
    sidebarBorder: '#2a2238',
  },
  emerald: {
    primary: '#10b981',
    primaryForeground: '#ffffff',
    ring: '#10b981',
    brandFrom: '#059669',
    brandTo: '#047857',
    background: '#090e0d',
    foreground: '#e8f3f0',
    card: '#101a17',
    cardForeground: '#e8f3f0',
    popover: '#131f1c',
    border: '#1e3330',
    input: '#1e3330',
    secondary: '#172622',
    accent: '#1c302c',
    muted: '#172622',
    mutedForeground: '#8faba5',
    sidebar: '#0b1412',
    sidebarBorder: '#1e3330',
  },
  ocean: {
    primary: '#3b82f6',
    primaryForeground: '#ffffff',
    ring: '#3b82f6',
    brandFrom: '#1d4ed8',
    brandTo: '#1e40af',
    background: '#090b10',
    foreground: '#e8edf5',
    card: '#10141e',
    cardForeground: '#e8edf5',
    popover: '#131821',
    border: '#1e2a40',
    input: '#1e2a40',
    secondary: '#162035',
    accent: '#1c2840',
    muted: '#162035',
    mutedForeground: '#8898b0',
    sidebar: '#0b0f18',
    sidebarBorder: '#1e2a40',
  },
  crimson: {
    primary: '#ef4444',
    primaryForeground: '#ffffff',
    ring: '#ef4444',
    brandFrom: '#b91c1c',
    brandTo: '#991b1b',
    background: '#0f0909',
    foreground: '#f3e8e8',
    card: '#1b1010',
    cardForeground: '#f3e8e8',
    popover: '#1f1212',
    border: '#3a1e1e',
    input: '#3a1e1e',
    secondary: '#2c1616',
    accent: '#331c1c',
    muted: '#2c1616',
    mutedForeground: '#a88f8f',
    sidebar: '#100b0b',
    sidebarBorder: '#3a1e1e',
  },
  orange: {
    primary: '#f97316',
    primaryForeground: '#ffffff',
    ring: '#f97316',
    brandFrom: '#ea580c',
    brandTo: '#c2410c',
    background: '#0f0c09',
    foreground: '#f5eee8',
    card: '#1c1610',
    cardForeground: '#f5eee8',
    popover: '#201a13',
    border: '#3d2e1e',
    input: '#3d2e1e',
    secondary: '#2e2216',
    accent: '#352918',
    muted: '#2e2216',
    mutedForeground: '#a89b8a',
    sidebar: '#110f0a',
    sidebarBorder: '#3d2e1e',
  },
  pink: {
    primary: '#ec4899',
    primaryForeground: '#ffffff',
    ring: '#ec4899',
    brandFrom: '#be185d',
    brandTo: '#9d174d',
    background: '#0f0910',
    foreground: '#f3e8f1',
    card: '#1b1018',
    cardForeground: '#f3e8f1',
    popover: '#1f131c',
    border: '#3a1e34',
    input: '#3a1e34',
    secondary: '#2c1628',
    accent: '#331c30',
    muted: '#2c1628',
    mutedForeground: '#a88fa2',
    sidebar: '#100b0f',
    sidebarBorder: '#3a1e34',
  },
  gold: {
    primary: '#f59e0b',
    primaryForeground: '#0f0c02',
    ring: '#f59e0b',
    brandFrom: '#d97706',
    brandTo: '#b45309',
    background: '#0f0e08',
    foreground: '#f5f0e0',
    card: '#1c1a10',
    cardForeground: '#f5f0e0',
    popover: '#201e13',
    border: '#3d3820',
    input: '#3d3820',
    secondary: '#2e2c16',
    accent: '#35321a',
    muted: '#2e2c16',
    mutedForeground: '#a8a27e',
    sidebar: '#111009',
    sidebarBorder: '#3d3820',
  },
  midnight: {
    primary: '#818cf8',
    primaryForeground: '#ffffff',
    ring: '#818cf8',
    brandFrom: '#4f46e5',
    brandTo: '#3730a3',
    background: '#08080f',
    foreground: '#e8e8f5',
    card: '#10101c',
    cardForeground: '#e8e8f5',
    popover: '#131320',
    border: '#1e1e38',
    input: '#1e1e38',
    secondary: '#16162c',
    accent: '#1c1c35',
    muted: '#16162c',
    mutedForeground: '#8888a8',
    sidebar: '#0c0c14',
    sidebarBorder: '#1e1e38',
  },
}

export const VALID_THEMES = Object.keys(THEMES) as SiteTheme[]

export function getThemeCSS(theme: SiteTheme): string {
  const t = THEMES[theme] ?? THEMES.purple
  return `:root {
    --primary: ${t.primary};
    --primary-foreground: ${t.primaryForeground};
    --ring: ${t.ring};
    --brand-from: ${t.brandFrom};
    --brand-to: ${t.brandTo};
    --background: ${t.background};
    --foreground: ${t.foreground};
    --card: ${t.card};
    --card-foreground: ${t.cardForeground};
    --popover: ${t.popover};
    --popover-foreground: ${t.cardForeground};
    --border: ${t.border};
    --input: ${t.input};
    --secondary: ${t.secondary};
    --secondary-foreground: ${t.foreground};
    --accent: ${t.accent};
    --accent-foreground: ${t.foreground};
    --muted: ${t.muted};
    --muted-foreground: ${t.mutedForeground};
    --sidebar: ${t.sidebar};
    --sidebar-foreground: ${t.foreground};
    --sidebar-border: ${t.sidebarBorder};
    --sidebar-primary: ${t.primary};
    --sidebar-primary-foreground: ${t.primaryForeground};
    --sidebar-accent: ${t.accent};
    --sidebar-accent-foreground: ${t.foreground};
    --sidebar-ring: ${t.ring};
    --chart-1: ${t.primary};
    --chart-2: ${t.brandFrom};
    --chart-3: ${t.brandTo};
  }`
}

/** Returns a 3-stop gradient string for use in inline styles / previews */
export function getThemeGradient(theme: SiteTheme): string {
  const t = THEMES[theme] ?? THEMES.purple
  return `linear-gradient(135deg, ${t.brandFrom}, ${t.primary} 50%, ${t.brandTo})`
}
