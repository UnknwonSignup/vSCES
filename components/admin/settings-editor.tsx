'use client'

import { useState, useTransition } from 'react'
import { Plus, Save, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { saveSettingsAction } from '@/app/actions/admin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { TabsContent } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import {
  FEATURE_LABELS,
  type FeatureKey,
  type SiteSettings,
  type SocialKey,
} from '@/lib/settings-shared'
import { SITE_THEME_LABELS, getThemeGradient, VALID_THEMES, type SiteTheme } from '@/lib/site-themes'
import { Card, Field } from './admin-ui'

const SOCIAL_LABELS: Record<SocialKey, string> = {
  discord: 'Discord',
  youtube: 'YouTube',
  tiktok: 'TikTok',
  twitter: 'X / Twitter',
  instagram: 'Instagram',
  twitch: 'Twitch',
}

export function SettingsEditor({ settings }: { settings: SiteSettings }) {
  const [s, setS] = useState(settings)
  const [pending, startTransition] = useTransition()

  const set = <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) =>
    setS((prev) => ({ ...prev, [key]: value }))

  const save = () =>
    startTransition(async () => {
      const res = await saveSettingsAction(JSON.stringify(s))
      if (res?.ok) toast.success(res.message)
      else toast.error(res?.message ?? 'Failed to save')
    })

  const saveBar = (
    <div className="flex justify-end">
      <Button onClick={save} disabled={pending} className="bg-brand text-primary-foreground hover:opacity-90">
        <Save className="size-4" aria-hidden="true" />
        {pending ? 'Saving…' : 'Save changes'}
      </Button>
    </div>
  )

  return (
    <>
      {/* ── GENERAL ── */}
      <TabsContent value="general" className="flex flex-col gap-6">
        <Card title="Server details" description="Shown in the hero, footer and widgets.">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Server name" id="serverName" value={s.serverName} onChange={(e) => set('serverName', e.target.value)} />
            <Field
              label="Server IP"
              id="serverIp"
              value={s.serverIp}
              onChange={(e) => set('serverIp', e.target.value)}
              hint="Used for the copy-IP button and live player count."
            />
            <Field label="Discord invite URL" id="discordInvite" value={s.discordInvite} onChange={(e) => set('discordInvite', e.target.value)} />
            <Field
              label="Discord server ID"
              id="discordServerId"
              value={s.discordServerId}
              onChange={(e) => set('discordServerId', e.target.value)}
              hint="Optional. Enable Server Widget in Discord settings for live online count."
            />
            <Field label="Store URL" id="storeUrl" value={s.storeUrl} onChange={(e) => set('storeUrl', e.target.value)} hint="e.g. your Tebex store." />
            <Field label="Footer text" id="footerText" value={s.footerText} onChange={(e) => set('footerText', e.target.value)} />
            <div className="md:col-span-2">
              <Field label="Tagline" id="tagline" textarea rows={2} value={s.tagline} onChange={(e) => set('tagline', e.target.value)} />
            </div>
          </div>
        </Card>

        <Card title="Site theme" description="Changes the accent color across the entire website — buttons, links, nav highlights, widgets, everything.">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {(VALID_THEMES as SiteTheme[]).map((key) => {
              const gradient = getThemeGradient(key)
              const active = s.siteTheme === key
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => set('siteTheme', key)}
                  className={`group flex flex-col items-center gap-2 rounded-lg border-2 p-3 transition-all ${
                    active
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-secondary/40 hover:border-primary/50'
                  }`}
                >
                  <span
                    className="flex h-8 w-full rounded-md shadow-md"
                    style={{ background: gradient }}
                  />
                  <span className="text-center text-[11px] font-medium leading-tight">{SITE_THEME_LABELS[key]}</span>
                  {active && (
                    <span className="text-[10px] text-primary font-semibold">Active</span>
                  )}
                </button>
              )
            })}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Theme takes effect after saving. A full page reload may be needed to see it applied everywhere.
          </p>
        </Card>

        <Card title="Top banner" description="A highlighted strip at the very top of every page.">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Switch
                id="bannerEnabled"
                checked={s.banner.enabled}
                onCheckedChange={(v) => set('banner', { ...s.banner, enabled: v })}
              />
              <Label htmlFor="bannerEnabled">Show banner</Label>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Banner text" id="bannerText" value={s.banner.text} onChange={(e) => set('banner', { ...s.banner, text: e.target.value })} />
              <Field label="Banner link (optional)" id="bannerLink" value={s.banner.link} onChange={(e) => set('banner', { ...s.banner, link: e.target.value })} />
            </div>
          </div>
        </Card>
        {saveBar}
      </TabsContent>

      {/* ── HOMEPAGE & LAYOUT ── */}
      <TabsContent value="homepage" className="flex flex-col gap-6">
        <Card
          title="Navigation & Layout Style"
          description="Choose how visitors navigate your website: left vertical dock or modern top header bar."
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => set('navigationStyle', 'sidebar')}
              className={`flex flex-col gap-2 rounded-xl border-2 p-4 text-left transition-all ${
                s.navigationStyle === 'sidebar'
                  ? 'border-primary bg-primary/10 shadow-md'
                  : 'border-border bg-secondary/30 hover:border-primary/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-foreground">🧭 Left Sidebar Dock</span>
                {s.navigationStyle === 'sidebar' && (
                  <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-bold text-primary">
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Vertical side navigation on desktop with glowing icons, floating logo, and mobile bottom bar.
              </p>
            </button>

            <button
              type="button"
              onClick={() => set('navigationStyle', 'topbar')}
              className={`flex flex-col gap-2 rounded-xl border-2 p-4 text-left transition-all ${
                s.navigationStyle === 'topbar'
                  ? 'border-primary bg-primary/10 shadow-md'
                  : 'border-border bg-secondary/30 hover:border-primary/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-foreground">🔝 Top Header Bar</span>
                {s.navigationStyle === 'topbar' && (
                  <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-bold text-primary">
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Clean, full-width glassmorphic header bar at the top with logo, nav links, Discord, and AI chat.
              </p>
            </button>
          </div>
        </Card>

        {/* Connection Guide (Java & Bedrock) */}
        <Card
          title="Connection Guide ('How to Join')"
          description="Enable or disable platforms (like turning off Bedrock if you are Java-only), and configure server connection details."
        >
          <div className="flex flex-col gap-5">
            {/* Master and Platform Toggles */}
            <div className="grid gap-3 sm:grid-cols-3 rounded-xl border border-border/70 bg-secondary/30 p-4">
              <div className="flex items-center justify-between sm:flex-col sm:items-start gap-2">
                <div>
                  <span className="text-xs font-bold text-foreground">Connection Guide</span>
                  <p className="text-[11px] text-muted-foreground">Show guide on homepage</p>
                </div>
                <Switch
                  checked={s.howToJoin?.enabled !== false && s.features.howToJoin !== false}
                  onCheckedChange={(val) => {
                    set('howToJoin', { ...(s.howToJoin ?? DEFAULT_SETTINGS.howToJoin), enabled: val })
                    set('features', { ...s.features, howToJoin: val })
                  }}
                />
              </div>

              <div className="flex items-center justify-between sm:flex-col sm:items-start gap-2 border-t sm:border-t-0 sm:border-l border-border/60 pt-2 sm:pt-0 sm:pl-4">
                <div>
                  <span className="text-xs font-bold text-foreground">Java Edition (PC)</span>
                  <p className="text-[11px] text-muted-foreground">Show Java IP & steps</p>
                </div>
                <Switch
                  checked={s.howToJoin?.showJava !== false}
                  onCheckedChange={(val) =>
                    set('howToJoin', { ...(s.howToJoin ?? DEFAULT_SETTINGS.howToJoin), showJava: val })
                  }
                />
              </div>

              <div className="flex items-center justify-between sm:flex-col sm:items-start gap-2 border-t sm:border-t-0 sm:border-l border-border/60 pt-2 sm:pt-0 sm:pl-4">
                <div>
                  <span className="text-xs font-bold text-foreground">Bedrock (Mobile/Console)</span>
                  <p className="text-[11px] text-muted-foreground">Show Bedrock IP & port</p>
                </div>
                <Switch
                  checked={s.howToJoin?.showBedrock !== false}
                  onCheckedChange={(val) =>
                    set('howToJoin', { ...(s.howToJoin ?? DEFAULT_SETTINGS.howToJoin), showBedrock: val })
                  }
                />
              </div>
            </div>

            {/* IP and Port Inputs */}
            <div className="grid gap-4 md:grid-cols-2">
              <Field
                label="Java Server IP"
                id="guideJavaIp"
                value={s.howToJoin?.javaIp ?? s.serverIp}
                onChange={(e) =>
                  set('howToJoin', {
                    ...(s.howToJoin ?? DEFAULT_SETTINGS.howToJoin),
                    javaIp: e.target.value,
                  })
                }
                hint="IP copied by PC / Java players"
              />
              <Field
                label="Recommended Java Version"
                id="guideJavaVer"
                value={s.howToJoin?.javaVersion ?? '1.20 - 1.21.x'}
                onChange={(e) =>
                  set('howToJoin', {
                    ...(s.howToJoin ?? DEFAULT_SETTINGS.howToJoin),
                    javaVersion: e.target.value,
                  })
                }
                hint="e.g. 1.20 - 1.21.x"
              />
              <Field
                label="Bedrock Server IP"
                id="guideBedrockIp"
                value={s.howToJoin?.bedrockIp ?? s.serverIp}
                onChange={(e) =>
                  set('howToJoin', {
                    ...(s.howToJoin ?? DEFAULT_SETTINGS.howToJoin),
                    bedrockIp: e.target.value,
                  })
                }
                hint="IP for Mobile / Console / Win10"
              />
              <Field
                label="Bedrock Port"
                id="guideBedrockPort"
                value={s.howToJoin?.bedrockPort ?? '19132'}
                onChange={(e) =>
                  set('howToJoin', {
                    ...(s.howToJoin ?? DEFAULT_SETTINGS.howToJoin),
                    bedrockPort: e.target.value,
                  })
                }
                hint="Default is 19132"
              />
            </div>
          </div>
        </Card>

        {/* Server Highlights Badges (Image 3) */}
        <Card
          title="Server Highlights Ribbon (Badges)"
          description="Highlight badges shown directly below the hero section. Toggle individual badges on/off, delete them, or add custom ones."
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between rounded-xl border border-border/70 bg-secondary/30 p-3">
              <div>
                <span className="text-xs font-bold text-foreground">Highlights Ribbon</span>
                <p className="text-[11px] text-muted-foreground">Show or hide the entire badges section on the homepage</p>
              </div>
              <Switch
                checked={s.features.highlightBadges !== false}
                onCheckedChange={(val) => set('features', { ...s.features, highlightBadges: val })}
              />
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {(s.highlightBadges ?? []).map((badge, idx) => (
                <div
                  key={badge.id || idx}
                  className={`flex flex-col gap-3 rounded-xl border p-4 transition-all ${
                    badge.enabled !== false
                      ? 'border-border/80 bg-secondary/40'
                      : 'border-border/40 bg-secondary/15 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-border/50 pb-2">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={badge.enabled !== false}
                        onCheckedChange={(val) => {
                          const next = [...(s.highlightBadges ?? [])]
                          next[idx] = { ...next[idx], enabled: val }
                          set('highlightBadges', next)
                        }}
                      />
                      <span className="text-xs font-bold text-foreground">
                        Badge #{idx + 1} {badge.enabled === false && <span className="text-muted-foreground font-normal">(Hidden)</span>}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={badge.color}
                        onChange={(e) => {
                          const next = [...(s.highlightBadges ?? [])]
                          next[idx] = { ...next[idx], color: e.target.value }
                          set('highlightBadges', next)
                        }}
                        className="rounded border border-border bg-card px-2 py-1 text-xs"
                      >
                        <option value="purple">Purple</option>
                        <option value="emerald">Emerald</option>
                        <option value="blue">Blue</option>
                        <option value="amber">Amber</option>
                        <option value="rose">Rose</option>
                        <option value="cyan">Cyan</option>
                      </select>

                      <select
                        value={badge.icon}
                        onChange={(e) => {
                          const next = [...(s.highlightBadges ?? [])]
                          next[idx] = { ...next[idx], icon: e.target.value }
                          set('highlightBadges', next)
                        }}
                        className="rounded border border-border bg-card px-2 py-1 text-xs"
                      >
                        <option value="sparkles">Sparkles</option>
                        <option value="shield">Shield</option>
                        <option value="users">Users</option>
                        <option value="trophy">Trophy</option>
                        <option value="swords">Swords</option>
                        <option value="coins">Coins</option>
                        <option value="compass">Compass</option>
                        <option value="star">Star</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => {
                          const next = (s.highlightBadges ?? []).filter((_, i) => i !== idx)
                          set('highlightBadges', next)
                        }}
                        title="Delete badge"
                        className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Field
                      label="Title"
                      id={`badge-label-${idx}`}
                      value={badge.label}
                      onChange={(e) => {
                        const next = [...(s.highlightBadges ?? [])]
                        next[idx] = { ...next[idx], label: e.target.value }
                        set('highlightBadges', next)
                      }}
                    />
                    <Field
                      label="Description"
                      id={`badge-desc-${idx}`}
                      value={badge.desc}
                      onChange={(e) => {
                        const next = [...(s.highlightBadges ?? [])]
                        next[idx] = { ...next[idx], desc: e.target.value }
                        set('highlightBadges', next)
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const next = [
                  ...(s.highlightBadges ?? []),
                  {
                    id: 'badge-' + Date.now(),
                    label: 'New Highlight',
                    desc: 'Short perk description',
                    icon: 'sparkles',
                    color: 'purple',
                    enabled: true,
                  },
                ]
                set('highlightBadges', next)
              }}
              className="w-full sm:w-auto self-start mt-1 gap-1.5"
            >
              <Plus className="size-4" /> Add New Badge
            </Button>
          </div>
        </Card>

        {/* Why Play Feature Cards */}
        <Card
          title="Why Play Feature Cards"
          description="Feature showcase cards displayed on the homepage. Toggle individual cards on/off, delete them, or add new ones."
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between rounded-xl border border-border/70 bg-secondary/30 p-3">
              <div>
                <span className="text-xs font-bold text-foreground">Why Play Showcase</span>
                <p className="text-[11px] text-muted-foreground">Show or hide the entire showcase section on the homepage</p>
              </div>
              <Switch
                checked={s.features.featuresList !== false}
                onCheckedChange={(val) => set('features', { ...s.features, featuresList: val })}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {(s.featuresList ?? []).map((feat, idx) => (
                <div
                  key={feat.id || idx}
                  className={`flex flex-col gap-3 rounded-xl border p-4 transition-all ${
                    feat.enabled !== false
                      ? 'border-border/80 bg-secondary/40'
                      : 'border-border/40 bg-secondary/15 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-border/50 pb-2">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={feat.enabled !== false}
                        onCheckedChange={(val) => {
                          const next = [...(s.featuresList ?? [])]
                          next[idx] = { ...next[idx], enabled: val }
                          set('featuresList', next)
                        }}
                      />
                      <span className="text-xs font-bold text-foreground">
                        Feature #{idx + 1} {feat.enabled === false && <span className="text-muted-foreground font-normal">(Hidden)</span>}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={feat.color}
                        onChange={(e) => {
                          const next = [...(s.featuresList ?? [])]
                          next[idx] = { ...next[idx], color: e.target.value }
                          set('featuresList', next)
                        }}
                        className="rounded border border-border bg-card px-2 py-1 text-xs"
                      >
                        <option value="emerald">Emerald</option>
                        <option value="amber">Amber</option>
                        <option value="purple">Purple</option>
                        <option value="rose">Rose</option>
                        <option value="blue">Blue</option>
                        <option value="cyan">Cyan</option>
                      </select>

                      <select
                        value={feat.icon}
                        onChange={(e) => {
                          const next = [...(s.featuresList ?? [])]
                          next[idx] = { ...next[idx], icon: e.target.value }
                          set('featuresList', next)
                        }}
                        className="rounded border border-border bg-card px-2 py-1 text-xs"
                      >
                        <option value="shield">Shield</option>
                        <option value="coins">Coins</option>
                        <option value="sparkles">Sparkles</option>
                        <option value="swords">Swords</option>
                        <option value="compass">Compass</option>
                        <option value="smartphone">Smartphone</option>
                        <option value="users">Users</option>
                        <option value="trophy">Trophy</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => {
                          const next = (s.featuresList ?? []).filter((_, i) => i !== idx)
                          set('featuresList', next)
                        }}
                        title="Delete feature card"
                        className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-2">
                        <Field
                          label="Card Title"
                          id={`feat-title-${idx}`}
                          value={feat.title}
                          onChange={(e) => {
                            const next = [...(s.featuresList ?? [])]
                            next[idx] = { ...next[idx], title: e.target.value }
                            set('featuresList', next)
                          }}
                        />
                      </div>
                      <div>
                        <Field
                          label="Tag / Pill"
                          id={`feat-tag-${idx}`}
                          value={feat.tag}
                          onChange={(e) => {
                            const next = [...(s.featuresList ?? [])]
                            next[idx] = { ...next[idx], tag: e.target.value }
                            set('featuresList', next)
                          }}
                        />
                      </div>
                    </div>
                    <Field
                      label="Description"
                      id={`feat-desc-${idx}`}
                      textarea
                      rows={2}
                      value={feat.description}
                      onChange={(e) => {
                        const next = [...(s.featuresList ?? [])]
                        next[idx] = { ...next[idx], description: e.target.value }
                        set('featuresList', next)
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const next = [
                  ...(s.featuresList ?? []),
                  {
                    id: 'feat-' + Date.now(),
                    title: 'New Feature',
                    tag: 'Feature',
                    description: 'Description of this server feature.',
                    icon: 'sparkles',
                    color: 'purple',
                    enabled: true,
                  },
                ]
                set('featuresList', next)
              }}
              className="w-full sm:w-auto self-start mt-1 gap-1.5"
            >
              <Plus className="size-4" /> Add Feature Card
            </Button>
          </div>
        </Card>

        {saveBar}
      </TabsContent>

      {/* ── SECTIONS / FEATURES ── */}
      <TabsContent value="features" className="flex flex-col gap-6">
        <Card title="Website sections" description="Toggle parts of the website on or off. Disabled pages return 404 and are hidden from navigation.">
          <ul className="grid gap-3 md:grid-cols-2">
            {(Object.keys(FEATURE_LABELS) as FeatureKey[]).map((key) => (
              <li key={key} className="flex items-start justify-between gap-4 rounded-md border border-border bg-secondary/40 p-4">
                <div>
                  <Label htmlFor={`f-${key}`} className="font-medium">
                    {FEATURE_LABELS[key].label}
                  </Label>
                  <p className="mt-1 text-xs text-muted-foreground">{FEATURE_LABELS[key].description}</p>
                </div>
                <Switch
                  id={`f-${key}`}
                  checked={s.features[key]}
                  onCheckedChange={(v) => set('features', { ...s.features, [key]: v })}
                />
              </li>
            ))}
          </ul>
        </Card>
        {saveBar}
      </TabsContent>

      {/* ── SOCIALS ── */}
      <TabsContent value="socials" className="flex flex-col gap-6">
        <Card title="Social links" description="Leave a field empty to hide it. Links must start with https://">
          <div className="grid gap-4 md:grid-cols-2">
            {(Object.keys(SOCIAL_LABELS) as SocialKey[]).map((key) => (
              <Field
                key={key}
                label={SOCIAL_LABELS[key]}
                id={`social-${key}`}
                type="url"
                placeholder="https://"
                value={s.socials[key]}
                onChange={(e) => set('socials', { ...s.socials, [key]: e.target.value })}
              />
            ))}
          </div>
        </Card>
        {saveBar}
      </TabsContent>

      {/* ── CONTENT ── */}
      <TabsContent value="content" className="flex flex-col gap-6">
        <ListEditor
          title="Rules"
          items={s.rules}
          onChange={(rules) => set('rules', rules)}
          empty={{ title: '', body: '' }}
          render={(item, update) => (
            <>
              <Input aria-label="Rule title" placeholder="Rule title" value={item.title} onChange={(e) => update({ ...item, title: e.target.value })} />
              <Textarea aria-label="Rule description" placeholder="Description" rows={2} value={item.body} onChange={(e) => update({ ...item, body: e.target.value })} />
            </>
          )}
        />
        <ListEditor
          title="Vote sites"
          items={s.voteLinks}
          onChange={(voteLinks) => set('voteLinks', voteLinks)}
          empty={{ name: '', url: '' }}
          render={(item, update) => (
            <div className="grid gap-2 md:grid-cols-2">
              <Input aria-label="Site name" placeholder="Site name" value={item.name} onChange={(e) => update({ ...item, name: e.target.value })} />
              <Input aria-label="Vote URL" placeholder="https://" value={item.url} onChange={(e) => update({ ...item, url: e.target.value })} />
            </div>
          )}
        />
        <ListEditor
          title="Store packages"
          items={s.storePackages}
          onChange={(storePackages) => set('storePackages', storePackages)}
          empty={{ name: '', price: '', description: '', url: '' }}
          render={(item, update) => (
            <div className="grid gap-2 md:grid-cols-2">
              <Input aria-label="Package name" placeholder="Package name" value={item.name} onChange={(e) => update({ ...item, name: e.target.value })} />
              <Input aria-label="Price" placeholder="$9.99" value={item.price} onChange={(e) => update({ ...item, price: e.target.value })} />
              <Input aria-label="Package URL" placeholder="Buy link (optional)" value={item.url} onChange={(e) => update({ ...item, url: e.target.value })} />
              <Input aria-label="Description" placeholder="Description" value={item.description} onChange={(e) => update({ ...item, description: e.target.value })} />
            </div>
          )}
        />
        {saveBar}
      </TabsContent>
    </>
  )
}

function ListEditor<T>({
  title,
  items,
  onChange,
  empty,
  render,
}: {
  title: string
  items: T[]
  onChange: (items: T[]) => void
  empty: T
  render: (item: T, update: (item: T) => void) => React.ReactNode
}) {
  return (
    <Card title={title}>
      <ul className="flex flex-col gap-3">
        {items.map((item, i) => (
          <li key={i} className="flex gap-3 rounded-md border border-border bg-secondary/40 p-3">
            <div className="flex flex-1 flex-col gap-2">
              {render(item, (next) => onChange(items.map((it, j) => (j === i ? next : it))))}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={`Remove item ${i + 1}`}
              onClick={() => onChange(items.filter((_, j) => j !== i))}
            >
              <Trash2 className="size-4 text-destructive" aria-hidden="true" />
            </Button>
          </li>
        ))}
      </ul>
      <Button type="button" variant="outline" size="sm" className="mt-3" onClick={() => onChange([...items, empty])}>
        <Plus className="size-4" /> Add
      </Button>
    </Card>
  )
}
