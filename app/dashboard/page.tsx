import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Users, DollarSign, Package, KanbanSquare, FileText, ArrowRight } from "lucide-react"
import { DealFunnel } from "@/components/dashboard/deal-funnel"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { StockAlertsWidget } from "@/components/dashboard/stock-alerts"

export const revalidate = 0 // Disable cache for fresh dashboard metrics

export default async function DashboardPage() {
  // Query database metrics sequentially to avoid connection spikes and handshakes overloading Neon
  const contactsCount = await prisma.contact.count()
  const deals = await prisma.deal.findMany({
    include: {
      contact: true,
      assignedTo: true,
    }
  })
  const invoices = await prisma.invoice.findMany()
  const recentActivities = await prisma.activity.findMany({
    take: 5,
    orderBy: {
      createdAt: "desc"
    },
    include: {
      contact: true,
      user: true,
    }
  })
  const products = await prisma.product.findMany()

  // Aggregate metrics in-memory to optimize database connections
  const productsCount = products.length
  const lowStockCount = products.filter(p => p.stock <= p.threshold).length

  // Aggregate deal pipeline statistics
  const totalPipelineValue = deals.reduce((sum: number, deal: { value: any }) => sum + deal.value, 0)
  const wonDealsValue = deals.filter((d: { stage: string }) => d.stage === "WON").reduce((sum: number, d: { value: any }) => sum + d.value, 0)
  
  // Aggregate invoice revenue statistics
  const totalRevenue = invoices.filter((i: { status: string }) => i.status === "PAID").reduce((sum: number, inv: { total: any }) => sum + inv.total, 0)
  const pendingInvoicesAmount = invoices.filter((i: { status: string }) => i.status === "SENT").reduce((sum: number, inv: { total: any }) => sum + inv.total, 0)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/75">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Nexflow role-based operations control center.</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/50 bg-card/40 backdrop-blur-sm shadow-sm hover:border-indigo-500/20 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Won Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-400">${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <p className="text-xs text-muted-foreground mt-1">
              +${pendingInvoicesAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })} pending in sent invoices
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/40 backdrop-blur-sm shadow-sm hover:border-indigo-500/20 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Deals Pipeline</CardTitle>
            <KanbanSquare className="h-4 w-4 text-indigo-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-400">${totalPipelineValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
            <p className="text-xs text-muted-foreground mt-1">
              ${wonDealsValue.toLocaleString(undefined, { maximumFractionDigits: 0 })} secured in won deals
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/40 backdrop-blur-sm shadow-sm hover:border-indigo-500/20 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Contacts</CardTitle>
            <Users className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">{contactsCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Customers, leads & company profiles active
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/40 backdrop-blur-sm shadow-sm hover:border-indigo-500/20 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Products Catalog</CardTitle>
            <Package className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-400">{productsCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {lowStockCount > 0 ? (
                <span className="text-destructive font-medium">{lowStockCount} items at or below low-stock mark</span>
              ) : (
                "All items sufficiently stocked in warehouse"
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Widgets Area */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        
        {/* Recent Deals */}
        <Card className="md:col-span-4 border-border/50 bg-card/30 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Active Deals Pipeline</CardTitle>
              <CardDescription>Track latest deals and status progress.</CardDescription>
            </div>
            <Link href="/dashboard/crm/deals" className="text-xs font-semibold text-indigo-500 hover:text-indigo-400 flex items-center gap-1">
              Pipeline View <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {deals.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">No deals in pipeline yet.</p>
              ) : (
                deals.slice(0, 5).map((deal: any) => (
                  <div key={deal.id} className="flex items-center justify-between p-3.5 rounded-lg border border-border/40 bg-zinc-950/40 hover:bg-zinc-900/40 transition-colors">
                    <div className="min-w-0">
                      <p className="font-semibold text-sm truncate">{deal.title}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <span className="px-1.5 py-0.5 rounded border border-indigo-500/20 bg-indigo-500/5 text-indigo-500 text-[10px] uppercase font-bold">
                          {deal.stage}
                        </span>
                        <span className="truncate">Client: {deal.contact.name}</span>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="font-bold text-sm text-indigo-400">${deal.value.toLocaleString()}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{deal.assignedTo.name}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card className="md:col-span-3 border-border/50 bg-card/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Real-time customer interaction updates.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 ml-1 relative border-l border-border/40 pl-4 py-2">
              {recentActivities.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-left ml-[-1rem]">No recent actions recorded.</p>
              ) : (
                recentActivities.map((activity: any) => (
                  <div key={activity.id} className="relative">
                    {/* Activity Indicator Node */}
                    <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-indigo-500 ring-4 ring-zinc-950" />
                    <div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-foreground/90">
                          {activity.type === "CALL" ? "Logged Call" : "Saved Note"}
                        </span>
                        <span className="text-muted-foreground text-[10px]">
                          {new Date(activity.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground bg-zinc-950/50 border border-border/20 p-2.5 rounded-md mt-1.5 leading-relaxed">
                        {activity.content}
                      </p>
                      <p className="text-[10px] text-indigo-400/80 font-medium mt-1">
                        By {activity.user.name} • Contact: {activity.contact.name}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Analytics Charts Area */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <DealFunnel deals={deals} />
        </div>
        <div className="lg:col-span-1">
          <RevenueChart invoices={invoices} />
        </div>
        <div className="lg:col-span-1">
          <StockAlertsWidget products={products} />
        </div>
      </div>

      {/* Quick Launchpad Grid */}
      <div className="space-y-4">
        <h3 className="font-bold text-lg tracking-tight">Quick Actions</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <Link href="/dashboard/crm/contacts" className="group flex items-center justify-between p-4 rounded-xl border border-border/50 bg-indigo-500/5 hover:bg-indigo-500/10 hover:border-indigo-500/30 transition-all">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500/10 text-indigo-500 rounded-lg group-hover:scale-110 transition-transform">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-sm">Customer Database</p>
                <p className="text-xs text-muted-foreground mt-0.5">Manage details and tags</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
          </Link>

          <Link href="/dashboard/crm/deals" className="group flex items-center justify-between p-4 rounded-xl border border-border/50 bg-indigo-500/5 hover:bg-indigo-500/10 hover:border-indigo-500/30 transition-all">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500/10 text-indigo-500 rounded-lg group-hover:scale-110 transition-transform">
                <KanbanSquare className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-sm">Deals & Pipelines</p>
                <p className="text-xs text-muted-foreground mt-0.5">Drag-and-drop workflow</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
          </Link>

          <Link href="/dashboard/invoices" className="group flex items-center justify-between p-4 rounded-xl border border-border/50 bg-indigo-500/5 hover:bg-indigo-500/10 hover:border-indigo-500/30 transition-all">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500/10 text-indigo-500 rounded-lg group-hover:scale-110 transition-transform">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-sm">Invoice Manager</p>
                <p className="text-xs text-muted-foreground mt-0.5">Billing & bookkeeping</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
          </Link>
        </div>
      </div>
    </div>
  )
}
