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
        <Tabs defaultValue="general" className="gap-6">
          <TabsList className="flex h-auto w-full flex-wrap justify-start">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="homepage">Homepage &amp; Layout</TabsTrigger>
            <TabsTrigger value="features">Sections</TabsTrigger>
            <TabsTrigger value="socials">Socials</TabsTrigger>
            <TabsTrigger value="content">Rules, Vote &amp; Store</TabsTrigger>
            <TabsTrigger value="announcements">Announcements</TabsTrigger>
            <TabsTrigger value="forum">Forum</TabsTrigger>
            <TabsTrigger value="staff">Staff</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="tickets">Tickets</TabsTrigger>
            <TabsTrigger value="logo">Logo Maker</TabsTrigger>
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
