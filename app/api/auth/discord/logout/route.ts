import { NextResponse } from 'next/server'
import { clearDiscordSession } from '@/lib/discord-auth'

export async function GET() {
  await clearDiscordSession()
  const siteUrl = process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  return NextResponse.redirect(siteUrl)
}
