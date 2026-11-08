import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink, LogOut , Ticket } from 'lucide-react'
import { logoutAction } from '@/app/actions/admin'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { getAdminData } from '@/lib/queries'
import type { SessionInfo } from '@/lib/admin-auth'
import type { SiteSettings } from '@/lib/settings-shared'
import { AnnouncementsManager } from './announcements-manager'
import { ForumManager } from './forum-manager'
import { SettingsEditor } from './settings-editor'
import { StaffManager } from './staff-manager'
import { TicketsManager } from './tickets-manager'
import { UsersManager } from './users-manager'
import { LogoMaker } from './logo-maker'

type AdminData = Awaited<ReturnType<typeof getAdminData>>

export function AdminDashboard({
  settings,
  data,
  session,
}: {
  settings: SiteSettings
  data: AdminData
  session: SessionInfo
}) {
  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-3">
            <Image src="/images/reverie-logo.png" alt="Reverie SMP" width={1322} height={493} className="h-8 w-auto" />
            <span className="rounded bg-primary/15 px-2 py-0.5 text-xs font-semibold text-primary">Admin</span>
            {session && (
              <span className="hidden text-xs text-muted-foreground sm:block">
                {session.username}
                {session.isOwner && (
                  <span className="ml-1.5 rounded bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-amber-400">Owner</span>
                )}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              View site <ExternalLink className="size-3.5" aria-hidden="true" />
            </Link>
            <form action={logoutAction}>
              <Button type="submit" variant="outline" size="sm">
                <LogOut className="size-3.5" aria-hidden="true" /> Log out
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <Tabs defaultValue="homepage" className="gap-6">
          <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 p-1.5 bg-secondary/30 rounded-xl border border-border/60">
            <TabsTrigger value="homepage" className="gap-1.5 py-1.5 px-3 text-xs font-semibold">
              🏠 Homepage
            </TabsTrigger>
            <TabsTrigger value="general" className="gap-1.5 py-1.5 px-3 text-xs font-semibold">
              🎨 Theme &amp; Details
            </TabsTrigger>
            <TabsTrigger value="logo" className="gap-1.5 py-1.5 px-3 text-xs font-semibold">
              💎 3D Logo Maker
            </TabsTrigger>
            <TabsTrigger value="content" className="gap-1.5 py-1.5 px-3 text-xs font-semibold">
              📜 Rules &amp; Store
            </TabsTrigger>
            <TabsTrigger value="features" className="gap-1.5 py-1.5 px-3 text-xs font-semibold">
              ⚙️ Sections
            </TabsTrigger>
            <TabsTrigger value="socials" className="gap-1.5 py-1.5 px-3 text-xs font-semibold">
              🌐 Socials
            </TabsTrigger>
            <TabsTrigger value="announcements" className="gap-1.5 py-1.5 px-3 text-xs font-semibold">
              📣 Announcements
            </TabsTrigger>
            <TabsTrigger value="forum" className="gap-1.5 py-1.5 px-3 text-xs font-semibold">
              💬 Forum
            </TabsTrigger>
            <TabsTrigger value="staff" className="gap-1.5 py-1.5 px-3 text-xs font-semibold">
              🛡️ Staff
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-1.5 py-1.5 px-3 text-xs font-semibold">
              👤 Users
            </TabsTrigger>
            <TabsTrigger value="tickets" className="gap-1.5 py-1.5 px-3 text-xs font-semibold">
              🎫 Tickets
            </TabsTrigger>
          </TabsList>

          <SettingsEditor settings={settings} />

          <TabsContent value="announcements">
            <AnnouncementsManager announcements={data.announcements} />
          </TabsContent>
          <TabsContent value="forum">
            <ForumManager categories={data.categories} topics={data.topics} replies={data.replies} />
          </TabsContent>
          <TabsContent value="staff">
            <StaffManager staff={data.staff} />
          </TabsContent>
          <TabsContent value="users">
            <UsersManager
              users={data.adminUsers}
              currentUsername={session?.username ?? ''}
              isOwner={session?.isOwner ?? false}
            />
          </TabsContent>
          <TabsContent value="tickets">
            <TicketsManager tickets={data.tickets ?? []} />
          </TabsContent>
          <TabsContent value="logo">
            <LogoMaker />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
