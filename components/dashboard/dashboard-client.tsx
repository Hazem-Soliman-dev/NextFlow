"use client"

import Link from "next/link"
import { useLang } from "@/lib/lang-context"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { HScrollContainer } from "@/components/ui/hscroll-container"
import { Users, DollarSign, Package, KanbanSquare, FileText, ArrowRight } from "lucide-react"
import { DealFunnel } from "./deal-funnel"
import { RevenueChart } from "./revenue-chart"
import { StockAlertsWidget } from "./stock-alerts"

interface DashboardClientProps {
  contactsCount: number
  deals: any[]
  products: any[]
  recentActivities: any[]
  invoices: any[]
  totalRevenue: number
  pendingInvoicesAmount: number
  totalPipelineValue: number
  wonDealsValue: number
  productsCount: number
  lowStockCount: number
}

export function DashboardClient({
  contactsCount,
  deals,
  products,
  recentActivities,
  invoices,
  totalRevenue,
  pendingInvoicesAmount,
  totalPipelineValue,
  wonDealsValue,
  productsCount,
  lowStockCount,
}: DashboardClientProps) {
  const { strings, dir } = useLang()

  return (
    <div className="space-y-8" dir={dir}>
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/75">
          {strings.dashboard}
        </h1>
        <p className="text-muted-foreground mt-1">{strings.dashboardSub}</p>
      </div>

      {/* KPI Cards Grid - with HScrollContainer for mobile swipe support */}
      <HScrollContainer label={strings.dashboard}>
        {/* KPI 1 */}
        <Card className="min-w-[280px] sm:min-w-0 sm:flex-1 border-border/50 bg-card/40 backdrop-blur-sm shadow-sm hover:border-indigo-500/20 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{strings.wonRevenue}</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-400">
              ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              +${pendingInvoicesAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })} {strings.pendingSent}
            </p>
          </CardContent>
        </Card>

        {/* KPI 2 */}
        <Card className="min-w-[280px] sm:min-w-0 sm:flex-1 border-border/50 bg-card/40 backdrop-blur-sm shadow-sm hover:border-indigo-500/20 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{strings.dealsPipeline}</CardTitle>
            <KanbanSquare className="h-4 w-4 text-indigo-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-400">
              ${totalPipelineValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              ${wonDealsValue.toLocaleString(undefined, { maximumFractionDigits: 0 })} {strings.securedDeals}
            </p>
          </CardContent>
        </Card>

        {/* KPI 3 */}
        <Card className="min-w-[280px] sm:min-w-0 sm:flex-1 border-border/50 bg-card/40 backdrop-blur-sm shadow-sm hover:border-indigo-500/20 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{strings.totalContacts}</CardTitle>
            <Users className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">{contactsCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {strings.activeProfiles}
            </p>
          </CardContent>
        </Card>

        {/* KPI 4 */}
        <Card className="min-w-[280px] sm:min-w-0 sm:flex-1 border-border/50 bg-card/40 backdrop-blur-sm shadow-sm hover:border-indigo-500/20 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{strings.productsCatalog}</CardTitle>
            <Package className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-400">{productsCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {lowStockCount > 0 ? (
                <span className="text-destructive font-medium">{lowStockCount} {strings.lowStockMark}</span>
              ) : (
                strings.allStocked
              )}
            </p>
          </CardContent>
        </Card>
      </HScrollContainer>

      {/* Main Widgets Area */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Deals */}
        <Card className="md:col-span-4 border-border/50 bg-card/30 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{strings.activeDealsPipe}</CardTitle>
              <CardDescription>{strings.trackProgress}</CardDescription>
            </div>
            <Link href="/dashboard/crm/deals" className="text-xs font-semibold text-indigo-500 hover:text-indigo-400 flex items-center gap-1">
              {strings.pipelineView} <ArrowRight className="h-3.5 w-3.5 ag-icon-chevron" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {deals.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">{strings.noDeals}</p>
              ) : (
                deals.slice(0, 5).map((deal: any) => (
                  <div key={deal.id} className="flex items-center justify-between p-3.5 rounded-lg border border-border/40 bg-secondary/40 hover:bg-secondary/60 transition-colors">
                    <div className="min-w-0 text-start">
                      <p className="font-semibold text-sm truncate">{deal.title}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <span className="px-1.5 py-0.5 rounded border border-indigo-500/20 bg-indigo-500/5 text-indigo-500 text-[10px] uppercase font-bold">
                          {deal.stage}
                        </span>
                        <span className="truncate">{strings.contactText}: {deal.contact.name}</span>
                      </div>
                    </div>
                    <div className="text-end ml-4 rtl:mr-4 rtl:ml-0">
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
            <CardTitle>{strings.recentActivities}</CardTitle>
            <CardDescription>{strings.realtimeUpdates}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 relative border-l border-border/40 pl-4 py-2 rtl:border-l-0 rtl:border-r rtl:pl-0 rtl:pr-4">
              {recentActivities.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-left rtl:text-right ml-[-1rem] rtl:mr-[-1rem]">{strings.noActivities}</p>
              ) : (
                recentActivities.map((activity: any) => (
                  <div key={activity.id} className="relative">
                    {/* Activity Indicator Node */}
                    <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-indigo-500 ring-4 ring-background rtl:-left-0 rtl:-right-[21px]" />
                    <div className="text-start">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-foreground/90">
                          {activity.type === "CALL" ? strings.loggedCall : strings.savedNote}
                        </span>
                        <span className="text-muted-foreground text-[10px]">
                          {new Date(activity.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground bg-secondary/30 border border-border/20 p-2.5 rounded-md mt-1.5 leading-relaxed">
                        {activity.content}
                      </p>
                      <p className="text-[10px] text-indigo-400/80 font-medium mt-1">
                        {strings.byUser} {activity.user.name} • {strings.contactText}: {activity.contact.name}
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
        <h3 className="font-bold text-lg tracking-tight text-start">{strings.quickActions}</h3>
        <HScrollContainer label={strings.quickActions}>
          <Link href="/dashboard/crm/contacts" className="group flex min-w-[280px] sm:min-w-0 sm:flex-1 items-center justify-between p-4 rounded-xl border border-border/50 bg-indigo-500/5 hover:bg-indigo-500/10 hover:border-indigo-500/30 transition-all">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500/10 text-indigo-500 rounded-lg group-hover:scale-110 transition-transform">
                <Users className="h-5 w-5" />
              </div>
              <div className="text-start">
                <p className="font-semibold text-sm">{strings.customerDb}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{strings.manageTags}</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-indigo-400 group-hover:translate-x-1 transition-all ag-icon-arrow" />
          </Link>

          <Link href="/dashboard/crm/deals" className="group flex min-w-[280px] sm:min-w-0 sm:flex-1 items-center justify-between p-4 rounded-xl border border-border/50 bg-indigo-500/5 hover:bg-indigo-500/10 hover:border-indigo-500/30 transition-all">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500/10 text-indigo-500 rounded-lg group-hover:scale-110 transition-transform">
                <KanbanSquare className="h-5 w-5" />
              </div>
              <div className="text-start">
                <p className="font-semibold text-sm">{strings.dealsAndPipes}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{strings.dragDropWorkflow}</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-indigo-400 group-hover:translate-x-1 transition-all ag-icon-arrow" />
          </Link>

          <Link href="/dashboard/invoices" className="group flex min-w-[280px] sm:min-w-0 sm:flex-1 items-center justify-between p-4 rounded-xl border border-border/50 bg-indigo-500/5 hover:bg-indigo-500/10 hover:border-indigo-500/30 transition-all">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500/10 text-indigo-500 rounded-lg group-hover:scale-110 transition-transform">
                <FileText className="h-5 w-5" />
              </div>
              <div className="text-start">
                <p className="font-semibold text-sm">{strings.invoiceManager}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{strings.billingBookkeeping}</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-indigo-400 group-hover:translate-x-1 transition-all ag-icon-arrow" />
          </Link>
        </HScrollContainer>
      </div>
    </div>
  )
}
