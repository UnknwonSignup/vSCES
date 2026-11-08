import { NextRequest, NextResponse } from 'next/server'
import { createDiscordSession } from '@/lib/discord-auth'

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')
  const siteUrl = process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  const clientId = process.env.DISCORD_CLIENT_ID
  const clientSecret = process.env.DISCORD_CLIENT_SECRET

  if (!code || !clientId || !clientSecret) {
    return NextResponse.redirect(`${siteUrl}/?discord_error=missing_config`)
  }

  try {
    const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        code,
        redirect_uri: `${siteUrl}/api/auth/discord/callback`,
      }),
    })

    if (!tokenRes.ok) {
      const err = await tokenRes.text()
      console.error('[discord-oauth] token exchange error:', err)
      return NextResponse.redirect(`${siteUrl}/?discord_error=token_failed`)
    }

    const { access_token } = await tokenRes.json()

    const userRes = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${access_token}` },
    })

    if (!userRes.ok) {
      console.error('[discord-oauth] user fetch error')
      return NextResponse.redirect(`${siteUrl}/?discord_error=user_failed`)
    }

    const user = await userRes.json()
    await createDiscordSession({
      id: user.id,
      username: user.global_name ?? user.username,
      avatar: user.avatar ?? null,
    })

    return NextResponse.redirect(siteUrl)
  } catch (error) {
    console.error('[discord-oauth] unexpected error:', error)
    return NextResponse.redirect(`${siteUrl}/?discord_error=unknown`)
  }
}
