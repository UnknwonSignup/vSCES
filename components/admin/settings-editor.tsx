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
