"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, KanbanSquare, Package, Truck, FileText } from "lucide-react"
import { useSession } from "next-auth/react"
import { useLang } from "@/lib/lang-context"

const MOBILE_NAV_ITEMS = [
  { id: "dashboard", href: "/dashboard", icon: LayoutDashboard, labelKey: "dashboard", roles: ["ADMIN", "MANAGER", "SALES_REP", "WAREHOUSE", "ACCOUNTANT"] },
  { id: "contacts", href: "/dashboard/crm/contacts", icon: Users, labelKey: "contacts", roles: ["ADMIN", "MANAGER", "SALES_REP"] },
  { id: "deals", href: "/dashboard/crm/deals", icon: KanbanSquare, labelKey: "deals", roles: ["ADMIN", "MANAGER", "SALES_REP"] },
  { id: "products", href: "/dashboard/inventory/products", icon: Package, labelKey: "products", roles: ["ADMIN", "WAREHOUSE"] },
  { id: "suppliers", href: "/dashboard/inventory/suppliers", icon: Truck, labelKey: "suppliers", roles: ["ADMIN"] }, // Only Admin gets both on footer, warehouse gets Products
  { id: "invoices", href: "/dashboard/invoices", icon: FileText, labelKey: "invoices", roles: ["ADMIN", "MANAGER", "ACCOUNTANT"] },
]

export function MobileFooterNav() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const { strings } = useLang()
  
  const userRole = (session?.user as any)?.role || "ADMIN"
  
  // Filter items visible to user role, limit to maximum 5 items to prevent cramming
  const visibleItems = MOBILE_NAV_ITEMS.filter(item => item.roles.includes(userRole)).slice(0, 5)

  return (
    <nav 
      className="ag-footer-nav shadow-lg" 
      role="navigation" 
      aria-label={strings.welcome}
    >
      {visibleItems.map((item) => {
        const isActive = item.href === "/dashboard"
          ? pathname === item.href
          : pathname === item.href || pathname.startsWith(`${item.href}/`)

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "ag-footer-btn transition-all duration-150 active:scale-95",
              isActive ? "active text-indigo-500 font-semibold" : "text-muted-foreground"
            )}
            aria-current={isActive ? "page" : undefined}
          >
            <item.icon className="h-5 w-5 mb-0.5" strokeWidth={isActive ? 2.2 : 1.8} />
            <span className="text-[9px] font-medium tracking-tight">
              {(strings as any)[item.labelKey]}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
