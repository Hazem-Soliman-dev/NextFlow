"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, KanbanSquare, Package, Truck, FileText } from "lucide-react"
import { useSession } from "next-auth/react"
import { useLang } from "@/lib/lang-context"

const NAV_ITEMS = [
  { key: "dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["ADMIN", "MANAGER", "SALES_REP", "WAREHOUSE", "ACCOUNTANT"] },
  { key: "contacts", href: "/dashboard/crm/contacts", icon: Users, roles: ["ADMIN", "MANAGER", "SALES_REP"] },
  { key: "deals", href: "/dashboard/crm/deals", icon: KanbanSquare, roles: ["ADMIN", "MANAGER", "SALES_REP"] },
  { key: "products", href: "/dashboard/inventory/products", icon: Package, roles: ["ADMIN", "WAREHOUSE"] },
  { key: "suppliers", href: "/dashboard/inventory/suppliers", icon: Truck, roles: ["ADMIN", "WAREHOUSE"] },
  { key: "invoices", href: "/dashboard/invoices", icon: FileText, roles: ["ADMIN", "MANAGER", "ACCOUNTANT"] },
] as const

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const { strings } = useLang()
  const userRole = (session?.user as any)?.role || "ADMIN"

  const visibleItems = NAV_ITEMS.filter(item => item.roles.includes(userRole))

  return (
    <aside className={cn("pb-12", className)}>
      <div className="space-y-4 py-4 h-full flex flex-col">
        <div className="px-6 py-2 mb-4 flex items-center gap-2">
          <h2 className="text-xl font-bold tracking-tight">{strings.appName}</h2>
        </div>
        <div className="flex-1 px-3 space-y-1">
          {visibleItems.map((item) => {
            const isActive = item.href === "/dashboard"
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-indigo-500/10 text-indigo-500"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{(strings as any)[item.key]}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </aside>
  )
}
