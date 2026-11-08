'use client'

import { Shield, Sparkles, Coins, Swords, Compass, Smartphone } from 'lucide-react'

const FEATURES = [
  {
    icon: Shield,
    title: 'Grief-Free Land Claims',
    description: 'Claim your territory effortlessly with a golden shovel. Trust friends, configure permissions, and build your dream base with 100% protection.',
    tag: 'Anti-Grief',
    gradient: 'from-emerald-500/20 to-teal-500/5',
    borderHover: 'hover:border-emerald-500/40',
    iconColor: 'text-emerald-400',
    badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  },
  {
    icon: Coins,
    title: 'Player-Driven Economy',
    description: 'Create player chest shops, trade in the /ah Auction House, and earn currency through jobs, mining, and farming. Zero pay-to-win mechanics.',
    tag: 'Economy',
    gradient: 'from-amber-500/20 to-yellow-500/5',
    borderHover: 'hover:border-amber-500/40',
    iconColor: 'text-amber-400',
    badgeColor: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  },
  {
    icon: Sparkles,
    title: 'Custom Enchantments',
    description: 'Discover over 50+ unique, balanced custom enchants. Combine enchants, forge legendary tools, and stand out in both PvE dungeons and PvP battles.',
    tag: 'Enchants',
    gradient: 'from-purple-500/20 to-pink-500/5',
    borderHover: 'hover:border-purple-500/40',
    iconColor: 'text-purple-400',
    badgeColor: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  },
  {
    icon: Swords,
    title: 'Dungeons & World Bosses',
    description: 'Team up with fellow players to conquer instanced dungeons, defeat custom world bosses, and earn exclusive cosmetic rewards and rare crate keys.',
    tag: 'PvE & Bosses',
    gradient: 'from-red-500/20 to-rose-500/5',
    borderHover: 'hover:border-red-500/40',
    iconColor: 'text-red-400',
    badgeColor: 'bg-red-500/15 text-red-400 border-red-500/30',
  },
  {
    icon: Compass,
    title: 'Skills & Progression',
    description: 'Level up your mcMMO-style stats through everyday actions. Master woodcutting, fishing, archery, and mining to unlock passive abilities.',
    tag: 'Skills',
    gradient: 'from-blue-500/20 to-indigo-500/5',
    borderHover: 'hover:border-blue-500/40',
    iconColor: 'text-blue-400',
    badgeColor: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  },
  {
    icon: Smartphone,
    title: 'Java & Bedrock Crossplay',
    description: 'Play anywhere, anytime! Full crossplay support allows PC (Java) and Mobile, Console, or Windows 10 (Bedrock) players to explore together seamlessly.',
    tag: 'Crossplay',
    gradient: 'from-cyan-500/20 to-sky-500/5',
    borderHover: 'hover:border-cyan-500/40',
    iconColor: 'text-cyan-400',
    badgeColor: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
  },
]

export function FeaturesShowcase() {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-border bg-card/60 p-6 sm:p-8 backdrop-blur-sm shadow-md">
      {/* Background ambient radial light */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-1/4 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
      />

      <div className="relative mb-6 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="size-3.5" />
            <span>Why Play On Reverie?</span>
          </div>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Crafted for the Ultimate SMP Experience
          </h2>
        </div>
        <p className="max-w-xs text-xs text-muted-foreground sm:text-right">
          Hand-crafted features designed to keep survival fresh, balanced, and engaging.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((item) => {
          const Icon = item.icon
          return (
            <div
              key={item.title}
              className={`group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-gradient-to-b ${item.gradient} p-5 transition-all duration-300 ${item.borderHover} hover:-translate-y-1 hover:shadow-lg`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className={`flex size-10 items-center justify-center rounded-xl bg-background/80 shadow-sm border border-border ${item.iconColor} transition-transform group-hover:scale-110`}>
                    <Icon className="size-5" />
                  </div>
                  <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-wide ${item.badgeColor}`}>
                    {item.tag}
                  </span>
                </div>

                <h3 className="mt-4 text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-4 flex items-center gap-1 text-[11px] font-medium text-primary/80 opacity-0 transition-opacity group-hover:opacity-100">
                <span>Learn more in Discord</span>
                <span>&rarr;</span>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
