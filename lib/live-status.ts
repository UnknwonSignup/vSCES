import 'server-only'

export type ServerStatus = { online: boolean; players: number; max: number }
export type DiscordStatus = { online: number; invite: string | null } | null

export async function getServerStatus(ip: string): Promise<ServerStatus> {
  if (!ip) return { online: false, players: 0, max: 0 }
  try {
    const res = await fetch(`https://api.mcsrvstat.us/3/${encodeURIComponent(ip)}`, {
      next: { revalidate: 60 },
      headers: { 'User-Agent': 'ReverieSMP-Website' },
      signal: AbortSignal.timeout(4000),
    })
    if (!res.ok) throw new Error(String(res.status))
    const data = await res.json()
    return {
      online: Boolean(data.online),
      players: Number(data.players?.online ?? 0),
      max: Number(data.players?.max ?? 0),
    }
  } catch {
    return { online: false, players: 0, max: 0 }
  }
}

export async function getDiscordStatus(serverId: string): Promise<DiscordStatus> {
  if (!serverId) return null
  try {
    const res = await fetch(`https://discord.com/api/guilds/${serverId}/widget.json`, {
      next: { revalidate: 120 },
      signal: AbortSignal.timeout(4000),
    })
    if (!res.ok) return null
    const data = await res.json()
    return { online: Number(data.presence_count ?? 0), invite: data.instant_invite ?? null }
  } catch {
    return null
  }
}
