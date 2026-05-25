"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useLang } from "@/lib/lang-context"
import { ArrowLeft, Trash2, Plus } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function NewInvoicePage() {
  const router = useRouter()
  const { strings, dir } = useLang()
  const [contacts, setContacts] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  
  const [selectedContact, setSelectedContact] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [lineItems, setLineItems] = useState([{ productId: "", description: "", quantity: 1, unitPrice: 0 }])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch("/api/contacts").then(res => res.json()),
      fetch("/api/products").then(res => res.json())
    ]).then(([contactsData, productsData]) => {
      setContacts(contactsData.contacts || [])
      setProducts(productsData.products || [])
    })
  }, [])

  // Derived calculations
  const subtotal = lineItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
  const taxRate = 0.10 // 10% tax for demo
  const tax = subtotal * taxRate
  const total = subtotal + tax

  const addLineItem = () => {
    setLineItems([...lineItems, { productId: "", description: "", quantity: 1, unitPrice: 0 }])
  }

  const updateLineItem = (index: number, field: string, value: any) => {
    const newItems = [...lineItems]
    
    // Auto-fill price when product is selected
    if (field === "productId") {
      const product = products.find(p => p.id === value)
      if (product) {
        newItems[index].unitPrice = product.price
        newItems[index].description = product.name
      }
    }
    
    (newItems[index] as any)[field] = value
    setLineItems(newItems)
  }

  const removeLineItem = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent, status: "DRAFT" | "SENT") => {
    e.preventDefault()
    if (!selectedContact || !dueDate || lineItems.some(i => !i.productId)) {
      alert(strings.fillRequiredFields)
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactId: selectedContact,
          dueDate,
          status,
          subtotal,
          tax,
          total,
          lineItems
        })
      })

      if (res.ok) {
        const invoice = await res.json()
        router.push(`/dashboard/invoices/${invoice.id}`)
      }
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10 text-start" dir={dir}>
      <div className="flex items-center gap-4">
        <Link href="/dashboard/invoices" className={buttonVariants({ variant: "ghost", size: "icon" })}>
          <ArrowLeft className="h-4 w-4 ag-icon-arrow" />
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">{strings.createInvoiceTitle}</h1>
      </div>

      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle>{strings.invoiceDetailsTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>{strings.clientContactLabel}</Label>
              <Select value={selectedContact} onValueChange={setSelectedContact}>
                <SelectTrigger>
                  <SelectValue placeholder={strings.selectClientPlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  {contacts.map(c => (
                    <SelectItem key={c.id} value={c.id} className="text-start">{c.name} {c.company ? `(${c.company})` : ''}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{strings.dueDateHeader}</Label>
              <Input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="text-start" required />
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-border/50">
            <div className="flex justify-between items-center rtl:space-x-reverse">
              <h3 className="font-semibold text-lg">{strings.lineItemsTitle}</h3>
              <Button type="button" variant="outline" size="sm" onClick={addLineItem}>
                <Plus className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" /> {strings.addItem}
              </Button>
            </div>
            
            <div className="overflow-x-auto">
              <Table className="min-w-[600px]">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40%] text-start">{strings.productServiceHeader}</TableHead>
                    <TableHead className="text-start">{strings.qtyHeader}</TableHead>
                    <TableHead className="text-start">{strings.unitPriceHeader}</TableHead>
                    <TableHead className="text-end">{strings.amountHeader}</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lineItems.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Select value={item.productId} onValueChange={(val) => updateLineItem(index, "productId", val)}>
                          <SelectTrigger>
                            <SelectValue placeholder={strings.selectProductPlaceholder} />
                          </SelectTrigger>
                          <SelectContent>
                            {products.map(p => (
                              <SelectItem key={p.id} value={p.id} className="text-start">{p.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input type="number" min="1" value={item.quantity} onChange={(e) => updateLineItem(index, "quantity", Number(e.target.value))} className="text-start" />
                      </TableCell>
                      <TableCell>
                        <Input type="number" min="0" step="0.01" value={item.unitPrice} onChange={(e) => updateLineItem(index, "unitPrice", Number(e.target.value))} className="text-start" />
                      </TableCell>
                      <TableCell className="text-end font-medium">
                        ${(item.quantity * item.unitPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell>
                        <Button type="button" variant="ghost" size="icon" className="text-red-500" onClick={() => removeLineItem(index)} disabled={lineItems.length === 1}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="flex justify-end rtl:justify-start pt-6 border-t border-border/50">
            <div className="w-64 space-y-3">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{strings.subtotalLabel}</span>
                <span>${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{strings.taxLabel}</span>
                <span>${tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t border-border/50 pt-3 text-indigo-400">
                <span>{strings.totalDueLabel}</span>
                <span>${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-3 border-t border-border/50 pt-6 rtl:flex-row-reverse">
          <Button variant="outline" onClick={(e) => handleSubmit(e, "DRAFT")} disabled={loading}>{strings.saveAsDraft}</Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={(e) => handleSubmit(e, "SENT")} disabled={loading}>{strings.saveAndSend}</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
