"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Package } from "lucide-react"

import { useLang } from "@/lib/lang-context"

export function StockAlertsWidget({ products }: { products: any[] }) {
  const { strings } = useLang()
  const lowStockProducts = products.filter(p => p.stock <= p.threshold).slice(0, 5)

  return (
    <Card className="border-border/50 bg-card/40">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          {strings.lowStockAlerts}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {lowStockProducts.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">{strings.stockHealthy}</p>
        ) : (
          <div className="space-y-4">
            {lowStockProducts.map(product => (
              <div key={product.id} className="flex items-center justify-between p-3 rounded-lg border border-border/40 bg-background/50 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="text-start">
                    <p className="font-semibold text-sm leading-tight">{product.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{strings.threshold}: {product.threshold}</p>
                  </div>
                </div>
                <div className="text-right ml-4 rtl:mr-4 rtl:ml-0">
                  <span className="font-bold text-red-500">{product.stock}</span>
                  <span className="text-xs text-muted-foreground ml-1 rtl:mr-1 rtl:ml-0">{strings.left}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
