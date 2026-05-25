"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { useLang } from "@/lib/lang-context"

export function DealFunnel({ deals }: { deals: any[] }) {
  const { strings } = useLang()
  // Aggregate deals by stage
  const stages = ["LEAD", "QUALIFIED", "PROPOSAL", "WON"]
  const colors = {
    "LEAD": "#94a3b8", // slate-400
    "QUALIFIED": "#60a5fa", // blue-400
    "PROPOSAL": "#818cf8", // indigo-400
    "WON": "#34d399", // emerald-400
  }

  const data = stages.map(stage => {
    const stageDeals = deals.filter(d => d.stage === stage)
    return {
      name: stage.charAt(0) + stage.slice(1).toLowerCase(),
      stageKey: stage,
      value: stageDeals.reduce((sum, d) => sum + d.value, 0),
      count: stageDeals.length
    }
  })

  return (
    <Card className="border-border/50 bg-card/40">
      <CardHeader>
        <CardTitle className="text-lg">{strings.funnelTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} width={80} />
              <Tooltip
                cursor={{ fill: "rgba(255,255,255,0.05)" }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-lg border border-border/50 bg-background/95 p-3 shadow-xl backdrop-blur-sm">
                        <p className="font-semibold">{data.name}</p>
                        <p className="text-indigo-400 font-bold mt-1">${data.value.toLocaleString()}</p>
                        <p className="text-muted-foreground text-xs">{data.count} {strings.dealsCountLabel}</p>
                      </div>
                    )
                  }
                  return null;
                }}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={(colors as any)[entry.stageKey]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
