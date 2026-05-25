import { Sidebar } from "@/components/layout/sidebar"
import { Topbar } from "@/components/layout/topbar"
import { MobileFooterNav } from "@/components/layout/mobile-footer-nav"
import { SessionProvider } from "next-auth/react"
import { auth } from "@/lib/auth"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <SessionProvider session={session}>
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar className="hidden sm:flex w-64 flex-col border-r border-border/50 bg-card/50" />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Topbar />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-[calc(76px+env(safe-area-inset-bottom))] sm:pb-6">
            {children}
          </main>
          <MobileFooterNav />
        </div>
      </div>
    </SessionProvider>
  )
}
