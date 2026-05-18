"use client"

import React, { useState } from "react"
import { useSession } from "next-auth/react"
import { ArrowDown, ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function StockAdjustment({ productId, currentStock, onSuccess }: { productId: string, currentStock: number, onSuccess: () => void }) {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [type, setType] = useState<"IN" | "OUT">("IN")
  const [quantity, setQuantity] = useState("")
  const [reason, setReason] = useState("")
  const [error, setError] = useState("")

  const userRole = (session?.user as any)?.role

  // Only Admin or Warehouse can adjust stock
  if (userRole !== "ADMIN" && userRole !== "WAREHOUSE") {
    return (
      <div className="flex flex-col items-center justify-center text-center p-4">
        <p className="text-sm text-muted-foreground">You do not have permission to adjust stock manually.</p>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const qtyNum = Number(quantity)
    if (qtyNum <= 0) {
      setError("Quantity must be greater than 0")
      setLoading(false)
      return
    }

    if (type === "OUT" && qtyNum > currentStock) {
      setError("Cannot deduct more than current stock")
      setLoading(false)
      return
    }

    try {
      const res = await fetch("/api/stock-movements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          type,
          quantity: qtyNum,
          reason
        })
      })

      if (res.ok) {
        setQuantity("")
        setReason("")
        onSuccess()
      } else {
        const data = await res.json()
        setError(data.error || "Failed to adjust stock")
      }
    } catch {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <h3 className="font-semibold text-lg">Adjust Stock</h3>
        <p className="text-sm text-muted-foreground">Record incoming stock or manual deductions.</p>
      </div>

      {error && <div className="text-sm font-medium text-red-500 bg-red-500/10 p-2 rounded">{error}</div>}

      <div className="flex gap-4">
        <div className="flex-1 space-y-1">
          <Label>Type</Label>
          <Select value={type} onValueChange={(val) => setType(val as "IN" | "OUT")}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="IN"><span className="flex items-center gap-2"><ArrowUp className="h-4 w-4 text-emerald-500" /> Stock In</span></SelectItem>
              <SelectItem value="OUT"><span className="flex items-center gap-2"><ArrowDown className="h-4 w-4 text-amber-500" /> Stock Out</span></SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 space-y-1">
          <Label>Quantity</Label>
          <Input 
            type="number" 
            min="1" 
            value={quantity} 
            onChange={(e) => setQuantity(e.target.value)} 
            required 
          />
        </div>
      </div>

      <div className="space-y-1">
        <Label>Reason (Optional)</Label>
        <Input 
          placeholder="e.g. Received new shipment, Damaged item..." 
          value={reason} 
          onChange={(e) => setReason(e.target.value)} 
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Processing..." : "Confirm Adjustment"}
      </Button>
    </form>
  )
}
