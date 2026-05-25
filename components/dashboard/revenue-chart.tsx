"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { useLang } from "@/lib/lang-context"

export function RevenueChart({ invoices }: { invoices: any[] }) {
  const { lang, strings } = useLang()

  // Aggregate revenue by month for the last 6 months
  const data = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date()
    d.setMonth(d.getMonth() - (5 - i))
    return {
      name: d.toLocaleDateString(lang === "en" ? "en-US" : "ar-EG", { month: "short" }),
      monthIndex: d.getMonth(),
      year: d.getFullYear(),
      revenue: 0
    }
  })

  invoices.forEach(inv => {
    if (inv.status === "PAID") {
      const invDate = new Date(inv.createdAt)
      const dataPoint = data.find(d => d.monthIndex === invDate.getMonth() && d.year === invDate.getFullYear())
      if (dataPoint) {
        dataPoint.revenue += inv.total
      }
    }
  })

  return (
    <Card className="border-border/50 bg-card/40">
      <CardHeader>
        <CardTitle className="text-lg">{strings.revenueTrend}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.4} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'var(--muted-foreground)' }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tickFormatter={(value) => `$${value >= 1000 ? (value / 1000) + 'k' : value}`}
                tick={{ fill: 'var(--muted-foreground)' }}
                dx={-10}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border border-border/50 bg-background/95 p-3 shadow-xl backdrop-blur-sm">
                        <p className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">{label}</p>
                        <p className="text-indigo-400 font-bold text-lg mt-1">${payload[0].value?.toLocaleString()}</p>
                      </div>
                    )
                  }
                  return null;
                }}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#818cf8" 
                strokeWidth={3}
                dot={{ r: 4, fill: "#818cf8", strokeWidth: 0 }}
                activeDot={{ r: 6, fill: "#818cf8", stroke: "#e0e7ff", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
