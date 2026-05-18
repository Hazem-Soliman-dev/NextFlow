"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { format } from "date-fns"
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

  const handleStatusChange = async (newStatus: string) => {
    try {
      const res = await fetch(`/api/invoices/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      })
      if (res.ok) {
        // Mock notification natively without toast library for now
        alert(`Invoice marked as ${newStatus}`)
        fetchInvoice()
      } else {
        const data = await res.json()
        alert(data.error || "Failed to update status")
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
  if (!invoice) return <div>Invoice not found</div>

  const userRole = (session?.user as any)?.role

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/invoices" className={buttonVariants({ variant: "ghost", size: "icon" })}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Invoice {invoice.number}</h1>
          <Badge variant="outline" className="text-sm px-3 py-1 bg-background">
            {invoice.status}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          {invoice.status === "DRAFT" && (
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => handleStatusChange("SENT")}>
              <Send className="mr-2 h-4 w-4" /> Mark Sent
            </Button>
          )}
          {invoice.status === "SENT" && (userRole === "ADMIN" || userRole === "ACCOUNTANT") && (
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => handleStatusChange("PAID")}>
              <CheckCircle2 className="mr-2 h-4 w-4" /> Mark Paid
            </Button>
          )}
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" /> Print
          </Button>
          <Button variant="outline" onClick={handleDownloadPDF}>
            <Download className="mr-2 h-4 w-4" /> PDF
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
            <div className="text-right">
              <h1 className="text-4xl font-bold tracking-tighter text-muted-foreground/30 print:text-gray-300 mb-4">INVOICE</h1>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium text-foreground print:text-black">Invoice No:</span> {invoice.number}</p>
                <p><span className="font-medium text-foreground print:text-black">Issue Date:</span> {format(new Date(invoice.createdAt), "MMM d, yyyy")}</p>
                <p><span className="font-medium text-foreground print:text-black">Due Date:</span> {format(new Date(invoice.dueDate), "MMM d, yyyy")}</p>
              </div>
            </div>
          </div>

          {/* Bill To */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 print:text-gray-500">Bill To</h3>
            <div className="text-sm space-y-1">
              <p className="font-bold text-lg text-foreground print:text-black">{invoice.contact?.name}</p>
              {invoice.contact?.company && <p>{invoice.contact.company}</p>}
              {invoice.contact?.email && <p>{invoice.contact.email}</p>}
            </div>
          </div>

          {/* Line Items */}
          <div className="mb-8">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 print:border-gray-200">
                  <th className="text-left font-semibold text-muted-foreground print:text-gray-500 pb-3">Item Description</th>
                  <th className="text-center font-semibold text-muted-foreground print:text-gray-500 pb-3 w-24">Qty</th>
                  <th className="text-right font-semibold text-muted-foreground print:text-gray-500 pb-3 w-32">Unit Price</th>
                  <th className="text-right font-semibold text-muted-foreground print:text-gray-500 pb-3 w-32">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20 print:divide-gray-100">
                {invoice.lineItems?.map((item: any) => (
                  <tr key={item.id}>
                    <td className="py-4">
                      <p className="font-medium text-foreground print:text-black">{item.product?.name || item.description}</p>
                      {item.product?.sku && <p className="text-xs text-muted-foreground print:text-gray-500 mt-0.5">SKU: {item.product.sku}</p>}
                    </td>
                    <td className="py-4 text-center">{item.quantity}</td>
                    <td className="py-4 text-right">${item.unitPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td className="py-4 text-right font-medium text-foreground print:text-black">${item.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-72 space-y-3">
              <div className="flex justify-between text-sm text-muted-foreground print:text-gray-600">
                <span>Subtotal</span>
                <span>${invoice.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground print:text-gray-600">
                <span>Tax (10%)</span>
                <span>${invoice.taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-xl font-bold border-t border-border/50 pt-4 text-indigo-400 print:border-gray-200 print:text-black">
                <span>Total Due</span>
                <span>${invoice.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
          
          {/* Footer Notes */}
          <div className="mt-16 pt-8 border-t border-border/50 text-sm text-muted-foreground text-center print:border-gray-200 print:text-gray-500">
            <p>Thank you for your business!</p>
            <p className="mt-1">Payment is due within {Math.ceil((new Date(invoice.dueDate).getTime() - new Date(invoice.createdAt).getTime()) / (1000 * 3600 * 24))} days.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
