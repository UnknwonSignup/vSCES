'use client'

import { useState } from 'react'
import { Check, Copy, Monitor, Smartphone, Terminal, HelpCircle, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import type { HowToJoinSettings } from '@/lib/settings-shared'

export function HowToJoin({
  serverIp,
  howToJoin,
  serverName = 'Reverie SMP',
}: {
  serverIp?: string
  howToJoin?: HowToJoinSettings
  serverName?: string
}) {
  const [activeTab, setActiveTab] = useState<'java' | 'bedrock'>('java')
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const javaIp = howToJoin?.javaIp || serverIp || 'play.reveriesmp.net'
  const bedrockIp = howToJoin?.bedrockIp || serverIp || 'play.reveriesmp.net'
  const bedrockPort = howToJoin?.bedrockPort || '19132'
  const javaVersion = howToJoin?.javaVersion || '1.20 - 1.21.x'
  const bedrockVersion = howToJoin?.bedrockVersion || 'Latest'

  const copyToClipboard = async (text: string, key: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedKey(key)
      toast.success(`${label} copied to clipboard!`, {
        description: text,
      })
      setTimeout(() => setCopiedKey(null), 2000)
    } catch {
      toast.error('Failed to copy', { description: text })
    }
  }

  return (
    <section className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Connection Guide</span>
          </div>
          <h2 className="mt-1 text-xl font-bold text-foreground sm:text-2xl">
            How to Join the Server
          </h2>
        </div>

        {/* Platform Selector Tabs */}
        <div className="flex rounded-xl bg-secondary/80 p-1 border border-border">
          <button
            type="button"
            onClick={() => setActiveTab('java')}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
              activeTab === 'java'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Monitor className="size-3.5" />
            <span>Java (PC)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('bedrock')}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
              activeTab === 'bedrock'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Smartphone className="size-3.5" />
            <span>Bedrock (Mobile / Console)</span>
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {/* Step-by-Step Instructions */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {activeTab === 'java' ? 'Java Edition Steps' : 'Bedrock Edition Steps'}
          </h3>

          {activeTab === 'java' ? (
            <ol className="flex flex-col gap-2.5 text-xs text-muted-foreground">
              <li className="flex items-start gap-2.5 rounded-lg border border-border/60 bg-secondary/30 p-2.5">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/15 font-bold text-primary text-[10px]">1</span>
                <span>Launch Minecraft: Java Edition (Recommended versions: <strong className="text-foreground">{javaVersion}</strong>).</span>
              </li>
              <li className="flex items-start gap-2.5 rounded-lg border border-border/60 bg-secondary/30 p-2.5">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/15 font-bold text-primary text-[10px]">2</span>
                <span>Click <strong className="text-foreground">Multiplayer</strong> &rarr; <strong className="text-foreground">Add Server</strong>.</span>
              </li>
              <li className="flex items-start gap-2.5 rounded-lg border border-border/60 bg-secondary/30 p-2.5">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/15 font-bold text-primary text-[10px]">3</span>
                <span>Enter Server Name as <strong className="text-foreground">{serverName}</strong> and paste the IP below.</span>
              </li>
              <li className="flex items-start gap-2.5 rounded-lg border border-border/60 bg-secondary/30 p-2.5">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/15 font-bold text-primary text-[10px]">4</span>
                <span>Click <strong className="text-foreground">Done</strong> and double-click the server to start playing!</span>
              </li>
            </ol>
          ) : (
            <ol className="flex flex-col gap-2.5 text-xs text-muted-foreground">
              <li className="flex items-start gap-2.5 rounded-lg border border-border/60 bg-secondary/30 p-2.5">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/15 font-bold text-primary text-[10px]">1</span>
                <span>Open Minecraft on iOS, Android, Windows 10, Xbox, Switch, or PlayStation.</span>
              </li>
              <li className="flex items-start gap-2.5 rounded-lg border border-border/60 bg-secondary/30 p-2.5">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/15 font-bold text-primary text-[10px]">2</span>
                <span>Click <strong className="text-foreground">Play</strong> &rarr; navigate to the <strong className="text-foreground">Servers</strong> tab &rarr; scroll down &amp; click <strong className="text-foreground">Add Server</strong>.</span>
              </li>
              <li className="flex items-start gap-2.5 rounded-lg border border-border/60 bg-secondary/30 p-2.5">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/15 font-bold text-primary text-[10px]">3</span>
                <span>Enter the Server Address and Port (<strong className="text-foreground">19132</strong>) shown on the right.</span>
              </li>
              <li className="flex items-start gap-2.5 rounded-lg border border-border/60 bg-secondary/30 p-2.5">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/15 font-bold text-primary text-[10px]">4</span>
                <span>Press <strong className="text-foreground">Save</strong> and tap to join!</span>
              </li>
            </ol>
          )}
        </div>

        {/* Server IP Copy Box */}
        <div className="flex flex-col justify-between rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card p-5 shadow-inner">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-primary">
                {activeTab === 'java' ? 'Java Server IP' : 'Bedrock Server Details'}
              </span>
              <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                Online 24/7
              </span>
            </div>

            {/* IP Box */}
            <div className="mt-3 space-y-3">
              <div>
                <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                  Server Address
                </label>
                <div className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2.5 shadow-sm font-mono text-sm font-bold text-foreground">
                  <span className="truncate">{activeTab === 'java' ? javaIp : bedrockIp}</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(activeTab === 'java' ? javaIp : bedrockIp, 'ip', 'Server IP')}
                    className="ml-2 flex items-center gap-1.5 rounded-md bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground shadow-sm transition-transform active:scale-95"
                  >
                    {copiedKey === 'ip' ? (
                      <>
                        <Check className="size-3.5" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="size-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {activeTab === 'bedrock' && (
                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                    Bedrock Port
                  </label>
                  <div className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2 shadow-sm font-mono text-xs font-bold text-foreground">
                    <span>{bedrockPort}</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(bedrockPort, 'port', 'Port')}
                      className="ml-2 flex items-center gap-1 rounded-md bg-secondary border border-border px-2 py-0.5 text-[11px] font-semibold text-muted-foreground hover:text-foreground active:scale-95"
                    >
                      {copiedKey === 'port' ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
                      <span>{copiedKey === 'port' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3 text-[11px] text-muted-foreground">
            <span>✨ No whitelist &bull; Join instantly</span>
            <span className="font-semibold text-primary">Free to Play</span>
          </div>
        </div>
      </div>
    </section>
  )
}
