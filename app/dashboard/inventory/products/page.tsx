"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, Search, Package as PackageIcon, AlertTriangle, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProductForm } from "@/components/inventory/product-form"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLang } from "@/lib/lang-context"

const CATEGORIES = ["Electronics", "Office Supplies", "Furniture", "Software", "Hardware", "Accessories"]

export default function ProductsPage() {
  const { strings, dir } = useLang()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("all")
  const [refreshKey, setRefreshKey] = useState(0)

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm(strings.deleteProductConfirm)) return
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "DELETE"
      })
      if (res.ok) {
        setRefreshKey(prev => prev + 1)
      } else {
        alert("Failed to delete product. Note: Products already used in Invoices cannot be deleted.")
      }
    } catch (error) {
      console.error(error)
      alert("An error occurred")
    }
  }

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/products?q=${encodeURIComponent(query)}&category=${category}`)
        if (res.ok) {
          const data = await res.json()
          setProducts(data.products)
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    const timer = setTimeout(() => {
      fetchProducts()
    }, 300)

    return () => clearTimeout(timer)
  }, [query, category, refreshKey])

  return (
    <div className="space-y-6" dir={dir}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="text-start">
          <h1 className="text-3xl font-bold tracking-tight">{strings.productsTitle}</h1>
          <p className="text-muted-foreground">{strings.productsSub}</p>
        </div>
        <ProductForm onSuccess={() => setRefreshKey(k => k + 1)}>
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="mr-2 h-4 w-4" /> {strings.addProduct}
          </Button>
        </ProductForm>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center rtl:space-x-reverse">
        <div className="relative flex-1 w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground rtl:left-auto rtl:right-2.5" />
          <Input
            type="search"
            placeholder={strings.searchProducts}
            className="pl-8 rtl:pl-3 rtl:pr-8 text-start"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-[200px]">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder={strings.allCategories} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-start">{strings.allCategories}</SelectItem>
              {CATEGORIES.map(c => (
                <SelectItem key={c} value={c} className="text-start">{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border border-border/50 bg-card/50">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-start">{strings.productHeader}</TableHead>
              <TableHead className="text-start">{strings.skuHeader}</TableHead>
              <TableHead className="hidden md:table-cell text-start">{strings.categoryHeader}</TableHead>
              <TableHead className="text-start">{strings.priceHeader}</TableHead>
              <TableHead className="text-start">{strings.stockHeader}</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-10 w-[200px]" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-[80px]" /></TableCell>
                  <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-[100px]" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-[60px]" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-[60px]" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                </TableRow>
              ))
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  {strings.noProducts}
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => {
                const isLowStock = product.stock <= product.threshold;
                return (
                  <TableRow key={product.id} className="hover:bg-muted/50">
                    <TableCell className="text-start">
                      <Link href={`/dashboard/inventory/products/${product.id}`} className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center border border-border/50 overflow-hidden flex-shrink-0">
                          {product.imageUrl ? (
                            <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                          ) : (
                            <PackageIcon className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <span className="font-medium hover:underline text-indigo-400 text-start">{product.name}</span>
                      </Link>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground text-start">{product.sku}</TableCell>
                    <TableCell className="hidden md:table-cell text-start">
                      <Badge variant="outline" className="font-normal">{product.category}</Badge>
                    </TableCell>
                    <TableCell className="font-medium text-start">${product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                    <TableCell className="text-start">
                      <div className="flex items-center gap-2 justify-start">
                        <span className={`font-semibold ${isLowStock ? 'text-red-500' : ''}`}>
                          {product.stock}
                        </span>
                        {isLowStock && (
                          <span title={`Low stock (Threshold: ${product.threshold})`}>
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          </span>
                        )}
                      </div>
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
                            <Link href={`/dashboard/inventory/products/${product.id}`} className="text-start block w-full">{strings.viewDetails}</Link>
                          </DropdownMenuItem>
                          <ProductForm product={product} onSuccess={() => setRefreshKey(k => k + 1)}>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-start cursor-pointer">
                              {strings.editProduct}
                            </DropdownMenuItem>
                          </ProductForm>
                          <DropdownMenuItem className="text-red-500 cursor-pointer text-start" onClick={() => handleDeleteProduct(product.id)}>
                            {strings.deleteText}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
