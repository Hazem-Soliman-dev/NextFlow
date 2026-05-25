"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import KanbanBoard from "@/components/crm/kanban-board"
import { Skeleton } from "@/components/ui/skeleton"
import { useSession } from "next-auth/react"
import { DealForm } from "@/components/crm/deal-form"
import { useLang } from "@/lib/lang-context"

export default function DealsPage() {
  const { strings, dir } = useLang()
  const { data: session } = useSession()
  const [deals, setDeals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const res = await fetch(`/api/deals`)
        if (res.ok) {
          const data = await res.json()
          setDeals(data)
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchDeals()
  }, [refreshKey])

  return (
    <div className="h-[calc(100vh-7.5rem)] md:h-[calc(100vh-8.5rem)] lg:h-[calc(100vh-9.5rem)] flex flex-col space-y-6" dir={dir}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-shrink-0">
        <div className="text-start">
          <h1 className="text-3xl font-bold tracking-tight">{strings.dealsTitle}</h1>
          <p className="text-muted-foreground">
            {session?.user && (session.user as any).role === "SALES_REP" 
              ? strings.dealsSubSales 
              : strings.dealsSubTeam}
          </p>
        </div>
        <DealForm onSuccess={() => setRefreshKey(prev => prev + 1)}>
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="mr-2 h-4 w-4" /> {strings.addDeal}
          </Button>
        </DealForm>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
        {loading ? (
          <div className="flex gap-4 h-full">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="min-w-[300px] bg-card/30 rounded-xl border border-border/30 p-4 h-full flex flex-col gap-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-32 w-full rounded-lg" />
                <Skeleton className="h-32 w-full rounded-lg" />
              </div>
            ))}
          </div>
        ) : (
          <KanbanBoard key={refreshKey} initialDeals={deals} onRefresh={() => setRefreshKey(prev => prev + 1)} />
        )}
      </div>
    </div>
  )
}
