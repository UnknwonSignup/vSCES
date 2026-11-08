import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Poppins } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import { getSettings } from '@/lib/settings'
import { getThemeCSS } from '@/lib/site-themes'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: {
    default: 'Reverie SMP — Minecraft Survival Server',
    template: '%s | Reverie SMP',
  },
  description: 'Reverie SMP is a dreamy Minecraft survival server. Join the community, read announcements, browse the forum and meet the staff.',
  icons: {
    icon: '/icon.svg',
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0b0910',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const settings = await getSettings()
  const themeCSS = getThemeCSS(settings.siteTheme)

  return (
    <html lang="en" className={`dark ${poppins.variable} bg-background`}>
      <head>
        {/* Site-wide accent theme — overrides globals.css defaults */}
        <style dangerouslySetInnerHTML={{ __html: themeCSS }} />
      </head>
      <body className="font-sans antialiased">
        {children}
        <Toaster theme="dark" richColors position="bottom-right" />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
