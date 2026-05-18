"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Trash2, Plus } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function NewInvoicePage() {
  const router = useRouter()
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
      alert("Please fill all required fields")
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
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/invoices" className={buttonVariants({ variant: "ghost", size: "icon" })}>
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Create Invoice</h1>
      </div>

      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle>Invoice Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Client (Contact)</Label>
              <Select value={selectedContact} onValueChange={setSelectedContact}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a client..." />
                </SelectTrigger>
                <SelectContent>
                  {contacts.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name} {c.company ? `(${c.company})` : ''}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} required />
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-border/50">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg">Line Items</h3>
              <Button type="button" variant="outline" size="sm" onClick={addLineItem}><Plus className="h-4 w-4 mr-2" /> Add Item</Button>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">Product/Service</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lineItems.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Select value={item.productId} onValueChange={(val) => updateLineItem(index, "productId", val)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select product" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map(p => (
                            <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input type="number" min="1" value={item.quantity} onChange={(e) => updateLineItem(index, "quantity", Number(e.target.value))} />
                    </TableCell>
                    <TableCell>
                      <Input type="number" min="0" step="0.01" value={item.unitPrice} onChange={(e) => updateLineItem(index, "unitPrice", Number(e.target.value))} />
                    </TableCell>
                    <TableCell className="text-right font-medium">
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

          <div className="flex justify-end pt-6 border-t border-border/50">
            <div className="w-64 space-y-3">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Subtotal</span>
                <span>${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Tax (10%)</span>
                <span>${tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t border-border/50 pt-3 text-indigo-400">
                <span>Total</span>
                <span>${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-3 border-t border-border/50 pt-6">
          <Button variant="outline" onClick={(e) => handleSubmit(e, "DRAFT")} disabled={loading}>Save as Draft</Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={(e) => handleSubmit(e, "SENT")} disabled={loading}>Save & Send</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
