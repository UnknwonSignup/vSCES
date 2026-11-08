import type { Metadata } from 'next'
import Image from 'next/image'
import { AdminDashboard } from '@/components/admin/admin-dashboard'
import { LoginForm } from '@/components/admin/login-form'
import { getSession, isAdminConfigured } from '@/lib/admin-auth'
import { getAdminData } from '@/lib/queries'
import { getSettings } from '@/lib/settings'

export const metadata: Metadata = {
  title: 'Admin Panel',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default async function AdminPanelPage() {
  if (!isAdminConfigured()) {
    return (
      <AdminShell>
        <div className="rounded-lg border border-border bg-card p-6 text-center">
          <h1 className="text-lg font-semibold">Admin panel not configured</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Add <code className="rounded bg-secondary px-1.5 py-0.5 text-foreground">ADMIN_PASSWORD</code> to your{' '}
            <code className="rounded bg-secondary px-1.5 py-0.5 text-foreground">.env</code> file and restart the server.
          </p>
        </div>
      </AdminShell>
    )
  }

  const session = await getSession()

  if (!session) {
    return (
      <AdminShell>
        <LoginForm />
      </AdminShell>
    )
  }

  const [settings, data] = await Promise.all([getSettings(), getAdminData()])
  return <AdminDashboard settings={settings} data={data} session={session} />
}

function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-8 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.18),transparent_60%)] px-4">
      <Image src="/images/reverie-logo.png" alt="Reverie SMP" width={1322} height={493} className="h-auto w-56" priority />
      <div className="w-full max-w-sm">{children}</div>
    </main>
  )
}
