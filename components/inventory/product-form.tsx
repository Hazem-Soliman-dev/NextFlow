"use client"

import { useState, useEffect } from "react"
import { useLang } from "@/lib/lang-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const CATEGORIES = ["Electronics", "Office Supplies", "Furniture", "Software", "Hardware", "Accessories"]

export function ProductForm({ children, product, onSuccess }: { children: React.ReactNode, product?: any, onSuccess?: () => void }) {
  const { strings, dir } = useLang()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [category, setCategory] = useState(CATEGORIES[0])
  const [suppliers, setSuppliers] = useState<any[]>([])
  const [supplierId, setSupplierId] = useState<string>("none")

  const isEdit = !!product

  useEffect(() => {
    if (open) {
      const fetchSuppliers = async () => {
        try {
          const res = await fetch("/api/suppliers")
          if (res.ok) {
            const data = await res.json()
            setSuppliers(data || [])
          }
        } catch (error) {
          console.error("Error fetching suppliers", error)
        }
      }
      fetchSuppliers()

      if (product) {
        setCategory(product.category)
        setSupplierId(product.supplierId || "none")
      } else {
        setCategory(CATEGORIES[0])
        setSupplierId("none")
      }
    }
  }, [open, product])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    
    try {
      const url = isEdit ? `/api/products/${product.id}` : "/api/products"
      const method = isEdit ? "PATCH" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          sku: formData.get("sku"),
          category: category,
          price: Number(formData.get("price")),
          stock: isEdit ? undefined : Number(formData.get("stock")),
          threshold: Number(formData.get("threshold")),
          imageUrl: formData.get("imageUrl"),
          supplierId: supplierId === "none" ? null : supplierId,
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
      <DialogContent className="sm:max-w-[500px]" dir={dir}>
        <DialogHeader className="text-start">
          <DialogTitle>{isEdit ? strings.editProduct : strings.addProduct}</DialogTitle>
          <DialogDescription>
            {isEdit ? strings.editProductDesc : strings.addProductDesc}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} key={product?.id || "new"} className="text-start">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="ltr:text-right rtl:text-left">{strings.nameHeader}</Label>
              <Input id="name" name="name" defaultValue={product?.name || ""} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sku" className="ltr:text-right rtl:text-left">{strings.skuHeader}</Label>
              <Input id="sku" name="sku" defaultValue={product?.sku || ""} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="ltr:text-right rtl:text-left">{strings.categoryHeader}</Label>
              <div className="col-span-3">
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder={strings.categoryHeader} />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="ltr:text-right rtl:text-left">{strings.priceLabel}</Label>
              <Input id="price" name="price" type="number" step="0.01" defaultValue={product?.price !== undefined ? product.price : ""} className="col-span-3" required />
            </div>
            {!isEdit && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="stock" className="ltr:text-right rtl:text-left">{strings.initialStockLabel}</Label>
                <Input id="stock" name="stock" type="number" className="col-span-3" required />
              </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="threshold" className="ltr:text-right rtl:text-left">{strings.alertThresholdLabel}</Label>
              <Input id="threshold" name="threshold" type="number" defaultValue={product?.threshold !== undefined ? product.threshold : "10"} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="imageUrl" className="ltr:text-right rtl:text-left">{strings.imageUrlLabel}</Label>
              <Input id="imageUrl" name="imageUrl" defaultValue={product?.imageUrl || ""} placeholder="https://..." className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="supplier" className="ltr:text-right rtl:text-left">{strings.supplierLabel}</Label>
              <div className="col-span-3">
                <Select value={supplierId} onValueChange={setSupplierId}>
                  <SelectTrigger>
                    <SelectValue placeholder={strings.selectSupplierPlaceholder} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">{strings.noSupplierOption}</SelectItem>
                    {suppliers.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              {loading ? strings.saving : strings.saveProduct}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
