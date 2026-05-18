"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { format } from "date-fns"
import { ArrowLeft, Package as PackageIcon, Truck, Hash, AlertTriangle, Activity } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { StockAdjustment } from "@/components/inventory/stock-adjustment"

export default function ProductDetailPage() {
  const { id } = useParams()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const fetchProduct = useCallback(async () => {
    try {
      const res = await fetch(`/api/products/${id}`)
      if (res.ok) {
        const data = await res.json()
        setProduct(data)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchProduct()
  }, [fetchProduct])

  if (loading) return <div className="space-y-6"><Skeleton className="h-8 w-64" /><Skeleton className="h-64 w-full" /></div>
  if (!product) return <div>Product not found</div>

  const isLowStock = product.stock <= product.threshold

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/inventory/products" className={buttonVariants({ variant: "ghost", size: "icon" })}>
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Info Card */}
        <Card className="lg:col-span-1 border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="aspect-square rounded-lg border border-border/50 overflow-hidden bg-muted flex items-center justify-center">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
              ) : (
                <PackageIcon className="h-16 w-16 text-muted-foreground/50" />
              )}
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-border/50">
                <span className="text-sm text-muted-foreground flex items-center gap-2"><Hash className="h-4 w-4" /> SKU</span>
                <span className="font-mono text-sm">{product.sku}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-border/50">
                <span className="text-sm text-muted-foreground flex items-center gap-2"><PackageIcon className="h-4 w-4" /> Category</span>
                <Badge variant="outline">{product.category}</Badge>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-border/50">
                <span className="text-sm text-muted-foreground">Price</span>
                <span className="font-bold text-lg text-indigo-400">${product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-border/50">
                <span className="text-sm text-muted-foreground">Supplier</span>
                <span className="text-sm flex items-center gap-1">
                  <Truck className="h-3 w-3 text-muted-foreground" />
                  {product.supplier?.name || "N/A"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stock & Movements */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="border-border/50 bg-card/50">
              <CardContent className="p-6">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-muted-foreground">Current Stock</span>
                  <div className="flex items-center gap-3">
                    <span className={`text-4xl font-bold tracking-tight ${isLowStock ? 'text-red-500' : 'text-foreground'}`}>
                      {product.stock}
                    </span>
                    {isLowStock && (
                      <Badge variant="destructive" className="flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" /> Low Stock
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground mt-2">Threshold: {product.threshold} units</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50">
              <CardContent className="p-6 flex flex-col justify-center h-full">
                <StockAdjustment productId={product.id} currentStock={product.stock} onSuccess={fetchProduct} />
              </CardContent>
            </Card>
          </div>

          <Card className="border-border/50 bg-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" /> Movement History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {product.stockMovements?.length === 0 ? (
                <p className="text-sm text-muted-foreground">No stock movements recorded.</p>
              ) : (
                <div className="space-y-4">
                  {product.stockMovements?.map((movement: any) => (
                    <div key={movement.id} className="flex items-center justify-between border-b border-border/40 pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center gap-4">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs ${movement.type === 'IN' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                          {movement.type === 'IN' ? '+' : '-'}{movement.quantity}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{movement.reason || (movement.type === 'IN' ? 'Stock Received' : 'Stock Deducted')}</p>
                          <p className="text-xs text-muted-foreground">{movement.createdBy?.name}</p>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(movement.createdAt), "MMM d, h:mm a")}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
