"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { format } from "date-fns"
import { useLang } from "@/lib/lang-context"
import { ArrowLeft, Download, Send, CheckCircle2, Printer } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useSession } from "next-auth/react"
import { generateInvoicePDF } from "@/components/invoices/pdf-generator"

export default function InvoiceDetailPage() {
  const { id } = useParams()
  const { data: session } = useSession()
  const { strings, dir } = useLang()
  const [invoice, setInvoice] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const fetchInvoice = useCallback(async () => {
    try {
      const res = await fetch(`/api/invoices/${id}`)
      if (res.ok) {
        const data = await res.json()
        setInvoice(data)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchInvoice()
  }, [fetchInvoice])

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "DRAFT": return strings.statusDraft
      case "SENT": return strings.statusSent
      case "PAID": return strings.statusPaid
      case "OVERDUE": return strings.statusOverdue
      case "CANCELLED": return strings.statusCancelled
      default: return status
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    try {
      const res = await fetch(`/api/invoices/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      })
      if (res.ok) {
        alert(strings.invoiceMarkedAs.replace("{status}", getStatusLabel(newStatus)))
        fetchInvoice()
      } else {
        const data = await res.json()
        alert(data.error || strings.failedUpdateStatus)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleDownloadPDF = () => {
    if (invoice) {
      generateInvoicePDF(invoice)
    }
  }

  if (loading) return <div className="space-y-6"><Skeleton className="h-8 w-64" /><Skeleton className="h-96 w-full" /></div>
  if (!invoice) return <div className="text-start p-6">{strings.invoiceNotFound}</div>

  const userRole = (session?.user as any)?.role
  const dueDays = Math.ceil((new Date(invoice.dueDate).getTime() - new Date(invoice.createdAt).getTime()) / (1000 * 3600 * 24))

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10 text-start" dir={dir}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/invoices" className={buttonVariants({ variant: "ghost", size: "icon" })}>
            <ArrowLeft className="h-4 w-4 ag-icon-arrow" />
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">{strings.invoiceNumberTitle} {invoice.number}</h1>
          <Badge variant="outline" className="text-sm px-3 py-1 bg-background">
            {getStatusLabel(invoice.status)}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          {invoice.status === "DRAFT" && (
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => handleStatusChange("SENT")}>
              <Send className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" /> {strings.markSent}
            </Button>
          )}
          {invoice.status === "SENT" && (userRole === "ADMIN" || userRole === "ACCOUNTANT") && (
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => handleStatusChange("PAID")}>
              <CheckCircle2 className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" /> {strings.markPaid}
            </Button>
          )}
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" /> {strings.print}
          </Button>
          <Button variant="outline" onClick={handleDownloadPDF}>
            <Download className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" /> {strings.pdf}
          </Button>
        </div>
      </div>

      <Card className="border-border/50 bg-card/50 print:bg-white print:text-black print:border-none print:shadow-none">
        <CardContent className="p-8 sm:p-12">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-border/50 pb-8 mb-8 print:border-gray-200">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/20 text-indigo-500 flex items-center justify-center text-xl print:text-indigo-600 print:bg-indigo-50">
                  ⚡
                </div>
                <h2 className="text-2xl font-bold tracking-tight print:text-black">Nexflow Inc.</h2>
              </div>
              <div className="text-sm text-muted-foreground print:text-gray-600 space-y-1">
                <p>123 Business Avenue</p>
                <p>Suite 100, Tech City</p>
                <p>contact@nexflow.demo</p>
              </div>
            </div>
            <div className="text-end rtl:text-left">
              <h1 className="text-4xl font-bold tracking-tighter text-muted-foreground/30 print:text-gray-300 mb-4">{strings.invoiceNumberTitle.toUpperCase()}</h1>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium text-foreground print:text-black">{strings.invoiceNumHeader}:</span> {invoice.number}</p>
                <p><span className="font-medium text-foreground print:text-black">{strings.issuedHeader}:</span> {format(new Date(invoice.createdAt), "MMM d, yyyy")}</p>
                <p><span className="font-medium text-foreground print:text-black">{strings.dueDateHeader}:</span> {format(new Date(invoice.dueDate), "MMM d, yyyy")}</p>
              </div>
            </div>
          </div>

          {/* Bill To */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 print:text-gray-500">{strings.billTo}</h3>
            <div className="text-sm space-y-1">
              <p className="font-bold text-lg text-foreground print:text-black">{invoice.contact?.name}</p>
              {invoice.contact?.company && <p>{invoice.contact.company}</p>}
              {invoice.contact?.email && <p>{invoice.contact.email}</p>}
            </div>
          </div>

          {/* Line Items */}
          <div className="mb-8 overflow-x-auto">
            <table className="w-full text-sm min-w-[500px]">
              <thead>
                <tr className="border-b border-border/50 print:border-gray-200">
                  <th className="text-start font-semibold text-muted-foreground print:text-gray-500 pb-3">{strings.itemDescriptionHeader}</th>
                  <th className="text-center font-semibold text-muted-foreground print:text-gray-500 pb-3 w-24">{strings.qtyHeader}</th>
                  <th className="text-end font-semibold text-muted-foreground print:text-gray-500 pb-3 w-32">{strings.unitPriceHeader}</th>
                  <th className="text-end font-semibold text-muted-foreground print:text-gray-500 pb-3 w-32">{strings.amountHeader}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20 print:divide-gray-100">
                {invoice.lineItems?.map((item: any) => (
                  <tr key={item.id}>
                    <td className="py-4 text-start">
                      <p className="font-medium text-foreground print:text-black">{item.product?.name || item.description}</p>
                      {item.product?.sku && <p className="text-xs text-muted-foreground print:text-gray-500 mt-0.5">{strings.skuHeader}: {item.product.sku}</p>}
                    </td>
                    <td className="py-4 text-center">{item.quantity}</td>
                    <td className="py-4 text-end">${item.unitPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td className="py-4 text-end font-medium text-foreground print:text-black">${item.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end rtl:justify-start">
            <div className="w-72 space-y-3">
              <div className="flex justify-between text-sm text-muted-foreground print:text-gray-600">
                <span>{strings.subtotalLabel}</span>
                <span>${invoice.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground print:text-gray-600">
                <span>{strings.taxLabel}</span>
                <span>${invoice.taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-xl font-bold border-t border-border/50 pt-4 text-indigo-400 print:border-gray-200 print:text-black">
                <span>{strings.totalDueLabel}</span>
                <span>${invoice.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
          
          {/* Footer Notes */}
          <div className="mt-16 pt-8 border-t border-border/50 text-sm text-muted-foreground text-center print:border-gray-200 print:text-gray-500">
            <p>{strings.thankYouNotes}</p>
            <p className="mt-1">{strings.paymentDueWithin.replace("{days}", String(dueDays))}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
