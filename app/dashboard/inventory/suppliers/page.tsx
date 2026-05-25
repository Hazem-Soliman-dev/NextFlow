"use client"

import { useState, useEffect } from "react"
import { useLang } from "@/lib/lang-context"
import { Plus, MapPin, Mail, Phone, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

function SupplierForm({ children, supplier, onSuccess }: { children: React.ReactNode, supplier?: any, onSuccess?: () => void }) {
  const { strings, dir } = useLang()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const isEdit = !!supplier

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    
    try {
      const url = isEdit ? `/api/suppliers/${supplier.id}` : "/api/suppliers"
      const method = isEdit ? "PATCH" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          address: formData.get("address"),
        })
      })
      if (res.ok) {
        setOpen(false)
        if (onSuccess) onSuccess()
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" dir={dir}>
        <DialogHeader className="text-start">
          <DialogTitle>{isEdit ? strings.editSupplier : strings.addNewSupplier}</DialogTitle>
          <DialogDescription>
            {isEdit ? strings.editSupplierDesc : strings.addSupplierDesc}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} key={supplier?.id || "new"} className="text-start">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="ltr:text-right rtl:text-left">{strings.nameHeader}</Label>
              <Input id="name" name="name" defaultValue={supplier?.name || ""} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="ltr:text-right rtl:text-left">{strings.emailHeader}</Label>
              <Input id="email" name="email" type="email" defaultValue={supplier?.email || ""} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="ltr:text-right rtl:text-left">{strings.phoneHeader}</Label>
              <Input id="phone" name="phone" defaultValue={supplier?.phone || ""} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="ltr:text-right rtl:text-left">{strings.addressLabel}</Label>
              <Input id="address" name="address" defaultValue={supplier?.address || ""} className="col-span-3" />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              {loading ? strings.saving : strings.saveSupplier}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default function SuppliersPage() {
  const { strings, dir } = useLang()
  const [suppliers, setSuppliers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleDeleteSupplier = async (supplierId: string) => {
    if (!confirm(strings.deleteSupplierConfirm)) return
    try {
      const res = await fetch(`/api/suppliers/${supplierId}`, {
        method: "DELETE"
      })
      if (res.ok) {
        setRefreshKey(k => k + 1)
      } else {
        alert(strings.failedDeleteSupplier)
      }
    } catch (error) {
      console.error(error)
      alert("An error occurred")
    }
  }

  useEffect(() => {
    const fetchSuppliers = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/suppliers`)
        if (res.ok) {
          const data = await res.json()
          setSuppliers(data)
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchSuppliers()
  }, [refreshKey])

  return (
    <div className="space-y-6 text-start" dir={dir}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{strings.suppliersTitle}</h1>
          <p className="text-muted-foreground">{strings.suppliersSub}</p>
        </div>
        <SupplierForm onSuccess={() => setRefreshKey(k => k + 1)}>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
            <Plus className="mr-2 h-4.5 w-4.5 rtl:ml-2 rtl:mr-0" /> {strings.addSupplier}
          </Button>
        </SupplierForm>
      </div>

      <div className="rounded-md border border-border/50 bg-card/50">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-start">{strings.nameHeader}</TableHead>
              <TableHead className="text-start">{strings.contactInfo}</TableHead>
              <TableHead className="hidden md:table-cell text-start">{strings.addressLabel}</TableHead>
              <TableHead className="text-start">{strings.products}</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-[150px]" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-[100px]" /></TableCell>
                  <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-[200px]" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-[50px]" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                </TableRow>
              ))
            ) : suppliers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  {strings.noSuppliers}
                </TableCell>
              </TableRow>
            ) : (
              suppliers.map((supplier) => (
                <TableRow key={supplier.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium text-indigo-500 text-start">{supplier.name}</TableCell>
                  <TableCell className="text-start">
                    <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                      {supplier.email && (
                        <span className="flex items-center gap-1.5 justify-start">
                          <Mail className="h-3.5 w-3.5" /> {supplier.email}
                        </span>
                      )}
                      {supplier.phone && (
                        <span className="flex items-center gap-1.5 justify-start">
                          <Phone className="h-3.5 w-3.5" /> {supplier.phone}
                        </span>
                      )}
                      {!supplier.email && !supplier.phone && <span>-</span>}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground text-start">
                    {supplier.address ? (
                      <span className="flex items-center gap-1.5 justify-start">
                        <MapPin className="h-3.5 w-3.5" /> {supplier.address}
                      </span>
                    ) : "-"}
                  </TableCell>
                  <TableCell className="text-start">
                    <div className="font-semibold">{supplier._count?.products || 0}</div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align={dir === "rtl" ? "start" : "end"}>
                        <SupplierForm supplier={supplier} onSuccess={() => setRefreshKey(k => k + 1)}>
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-start cursor-pointer">
                            {strings.editSupplier}
                          </DropdownMenuItem>
                        </SupplierForm>
                        <DropdownMenuItem className="text-red-500 cursor-pointer text-start" onClick={() => handleDeleteSupplier(supplier.id)}>
                          {strings.deleteText}
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
