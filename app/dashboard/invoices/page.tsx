"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { format, isPast, isToday } from "date-fns"
import { Plus, MoreHorizontal, FileText, CheckCircle2, Clock, AlertCircle } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { generateInvoicePDF } from "@/components/invoices/pdf-generator"

const STATUSES = ["ALL", "DRAFT", "SENT", "PAID", "OVERDUE", "CANCELLED"]

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("ALL")

  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/invoices?status=${statusFilter}`)
        if (res.ok) {
          const data = await res.json()
          setInvoices(data)
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchInvoices()
  }, [statusFilter])

  const getStatusBadge = (status: string, dueDate: string) => {
    // Auto-detect overdue if it's sent and past due
    const isOverdue = status === "SENT" && isPast(new Date(dueDate)) && !isToday(new Date(dueDate));
    const displayStatus = isOverdue ? "OVERDUE" : status;

    switch (displayStatus) {
      case "DRAFT":
        return <Badge variant="secondary" className="bg-slate-500/10 text-slate-400 border-slate-500/20"><FileText className="mr-1 h-3 w-3" /> Draft</Badge>
      case "SENT":
        return <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border-blue-500/20"><Clock className="mr-1 h-3 w-3" /> Sent</Badge>
      case "PAID":
        return <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20"><CheckCircle2 className="mr-1 h-3 w-3" /> Paid</Badge>
      case "OVERDUE":
        return <Badge variant="secondary" className="bg-red-500/10 text-red-400 border-red-500/20"><AlertCircle className="mr-1 h-3 w-3" /> Overdue</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
          <p className="text-muted-foreground">Manage billing and track payments.</p>
        </div>
        <Link
          href="/dashboard/invoices/new"
          className={cn(buttonVariants({ className: "bg-indigo-600 hover:bg-indigo-700 text-white" }))}
        >
          <Plus className="mr-2 h-4 w-4" /> Create Invoice
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-[200px]">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map(s => (
                <SelectItem key={s} value={s}>{s === "ALL" ? "All Statuses" : s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border border-border/50 bg-card/50">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Invoice</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Issued</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-[100px]" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-[150px]" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-[80px]" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-[100px]" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-[100px]" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-[80px] rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                </TableRow>
              ))
            ) : invoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  No invoices found.
                </TableCell>
              </TableRow>
            ) : (
              invoices.map((invoice) => (
                <TableRow key={invoice.id} className="hover:bg-muted/50 cursor-pointer">
                  <TableCell className="font-medium text-foreground">
                    <Link href={`/dashboard/invoices/${invoice.id}`} className="hover:underline text-indigo-400">
                      {invoice.number}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{invoice.contact?.name}</span>
                      {invoice.contact?.company && <span className="text-xs text-muted-foreground">{invoice.contact.company}</span>}
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">${invoice.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{format(new Date(invoice.createdAt), "MMM d, yyyy")}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{format(new Date(invoice.dueDate), "MMM d, yyyy")}</TableCell>
                  <TableCell>
                    {getStatusBadge(invoice.status, invoice.dueDate)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/invoices/${invoice.id}`}>View Invoice</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={async (e) => {
                          e.stopPropagation()
                          try {
                            const res = await fetch(`/api/invoices/${invoice.id}`)
                            if (res.ok) {
                              const data = await res.json()
                              generateInvoicePDF(data)
                            } else {
                              alert("Failed to fetch invoice details")
                            }
                          } catch (error) {
                            console.error(error)
                            alert("Error generating PDF")
                          }
                        }}>
                          Download PDF
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
