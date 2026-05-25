"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { format, isPast, isToday } from "date-fns"
import { useLang } from "@/lib/lang-context"
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
  const { strings, dir } = useLang()
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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "ALL": return strings.allStatuses
      case "DRAFT": return strings.statusDraft
      case "SENT": return strings.statusSent
      case "PAID": return strings.statusPaid
      case "OVERDUE": return strings.statusOverdue
      case "CANCELLED": return strings.statusCancelled
      default: return status
    }
  }

  const getStatusBadge = (status: string, dueDate: string) => {
    // Auto-detect overdue if it's sent and past due
    const isOverdue = status === "SENT" && isPast(new Date(dueDate)) && !isToday(new Date(dueDate));
    const displayStatus = isOverdue ? "OVERDUE" : status;

    const iconClass = cn("h-3 w-3", dir === "rtl" ? "ml-1" : "mr-1")

    switch (displayStatus) {
      case "DRAFT":
        return <Badge variant="secondary" className="bg-slate-500/10 text-slate-400 border-slate-500/20"><FileText className={iconClass} /> {strings.statusDraft}</Badge>
      case "SENT":
        return <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border-blue-500/20"><Clock className={iconClass} /> {strings.statusSent}</Badge>
      case "PAID":
        return <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20"><CheckCircle2 className={iconClass} /> {strings.statusPaid}</Badge>
      case "OVERDUE":
        return <Badge variant="secondary" className="bg-red-500/10 text-red-400 border-red-500/20"><AlertCircle className={iconClass} /> {strings.statusOverdue}</Badge>
      case "CANCELLED":
        return <Badge variant="secondary" className="bg-slate-500/10 text-slate-400 border-slate-500/20"><AlertCircle className={iconClass} /> {strings.statusCancelled}</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6 text-start" dir={dir}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{strings.invoicesTitle}</h1>
          <p className="text-muted-foreground">{strings.invoicesSub}</p>
        </div>
        <Link
          href="/dashboard/invoices/new"
          className={cn(buttonVariants({ className: "bg-indigo-600 hover:bg-indigo-700 text-white" }))}
        >
          <Plus className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" /> {strings.createInvoice}
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-[200px]">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder={strings.filterByStatusPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map(s => (
                <SelectItem key={s} value={s} className="text-start">{getStatusLabel(s)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border border-border/50 bg-card/50">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-start">{strings.invoiceHeader}</TableHead>
              <TableHead className="text-start">{strings.clientHeader}</TableHead>
              <TableHead className="text-start">{strings.amountHeader}</TableHead>
              <TableHead className="text-start">{strings.issuedHeader}</TableHead>
              <TableHead className="text-start">{strings.dueDateHeader}</TableHead>
              <TableHead className="text-start">{strings.statusHeader}</TableHead>
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
                  {strings.noInvoices}
                </TableCell>
              </TableRow>
            ) : (
              invoices.map((invoice) => (
                <TableRow key={invoice.id} className="hover:bg-muted/50 cursor-pointer">
                  <TableCell className="font-medium text-foreground text-start">
                    <Link href={`/dashboard/invoices/${invoice.id}`} className="hover:underline text-indigo-400">
                      {invoice.number}
                    </Link>
                  </TableCell>
                  <TableCell className="text-start">
                    <div className="flex flex-col">
                      <span className="font-medium">{invoice.contact?.name}</span>
                      {invoice.contact?.company && <span className="text-xs text-muted-foreground">{invoice.contact.company}</span>}
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold text-start">${invoice.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                  <TableCell className="text-sm text-muted-foreground text-start">{format(new Date(invoice.createdAt), "MMM d, yyyy")}</TableCell>
                  <TableCell className="text-sm text-muted-foreground text-start">{format(new Date(invoice.dueDate), "MMM d, yyyy")}</TableCell>
                  <TableCell className="text-start">
                    {getStatusBadge(invoice.status, invoice.dueDate)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align={dir === "rtl" ? "start" : "end"}>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/invoices/${invoice.id}`} className="text-start block w-full">{strings.viewInvoice}</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-start cursor-pointer" onClick={async (e) => {
                          e.stopPropagation()
                          try {
                            const res = await fetch(`/api/invoices/${invoice.id}`)
                            if (res.ok) {
                              const data = await res.json()
                              generateInvoicePDF(data)
                            } else {
                              alert(strings.failedFetchInvoice)
                            }
                          } catch (error) {
                            console.error(error)
                            alert(strings.errorGeneratingPdf)
                          }
                        }}>
                          {strings.downloadPdf}
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
