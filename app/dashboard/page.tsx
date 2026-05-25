import { prisma } from "@/lib/prisma"
import { DashboardClient } from "@/components/dashboard/dashboard-client"

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
    <DashboardClient
      contactsCount={contactsCount}
      deals={deals}
      products={products}
      recentActivities={recentActivities}
      invoices={invoices}
      totalRevenue={totalRevenue}
      pendingInvoicesAmount={pendingInvoicesAmount}
      totalPipelineValue={totalPipelineValue}
      wonDealsValue={wonDealsValue}
      productsCount={productsCount}
      lowStockCount={lowStockCount}
    />
  )
}
