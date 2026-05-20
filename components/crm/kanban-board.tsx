"use client"

import { useState } from "react"
import { DndContext, DragOverlay, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors, DragStartEvent, DragEndEvent, useDroppable } from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { DealCard, SortableDealCard } from "@/components/crm/deal-card"

function KanbanColumnContent({ id, children }: { id: string; children: React.ReactNode }) {
  const { setNodeRef } = useDroppable({ id })
  return (
    <div ref={setNodeRef} className="flex-1 p-3 overflow-y-auto min-h-[150px]">
      {children}
    </div>
  )
}

const STAGES = [
  { id: "LEAD", title: "Lead", color: "bg-slate-500/10 border-slate-500/20 text-slate-400" },
  { id: "QUALIFIED", title: "Qualified", color: "bg-blue-500/10 border-blue-500/20 text-blue-400" },
  { id: "PROPOSAL", title: "Proposal", color: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400" },
  { id: "WON", title: "Won", color: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" },
  { id: "LOST", title: "Lost", color: "bg-red-500/10 border-red-500/20 text-red-400" }
]

export default function KanbanBoard({ initialDeals }: { initialDeals: any[] }) {
  const [deals, setDeals] = useState(initialDeals)
  const [activeDeal, setActiveDeal] = useState<any | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const deal = deals.find(d => d.id === active.id)
    setActiveDeal(deal)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveDeal(null)

    if (!over) return

    const activeId = active.id
    const overId = over.id
    
    // Check if dropping over a column or another card
    const isOverColumn = STAGES.some(s => s.id === overId)
    const overDeal = deals.find(d => d.id === overId)
    const newStage = isOverColumn ? overId : overDeal?.stage

    if (!newStage) return

    const activeDeal = deals.find(d => d.id === activeId)
    if (!activeDeal) return

    if (activeDeal.stage !== newStage) {
      // Optimistic update
      setDeals(deals.map(d => d.id === activeId ? { ...d, stage: newStage } : d))
      
      // Persist to API
      try {
        await fetch(`/api/deals/${activeId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stage: newStage })
        })
      } catch (error) {
        console.error("Failed to update deal stage", error)
        // Revert on failure
        setDeals(deals)
      }
    } else if (overDeal && activeId !== overId) {
      // Reorder within the same column
      const oldIndex = deals.findIndex(d => d.id === activeId)
      const newIndex = deals.findIndex(d => d.id === overId)
      setDeals(arrayMove(deals, oldIndex, newIndex))
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex h-full gap-4 pb-4">
        {STAGES.map(stage => {
          const stageDeals = deals.filter(d => d.stage === stage.id)
          const totalValue = stageDeals.reduce((sum, d) => sum + d.value, 0)
          
          return (
            <div key={stage.id} className="flex flex-col min-w-[300px] w-[300px] bg-card/30 rounded-xl border border-border/30 h-full max-h-full">
              <div className="p-4 border-b border-border/30 flex items-center justify-between sticky top-0 bg-card/50 backdrop-blur-md rounded-t-xl z-10">
                <div className="flex items-center gap-2">
                  <div className={`px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider border ${stage.color}`}>
                    {stage.title}
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">{stageDeals.length}</span>
                </div>
                <div className="text-sm font-semibold">${totalValue.toLocaleString()}</div>
              </div>
              
              <KanbanColumnContent id={stage.id}>
                <SortableContext items={stageDeals.map(d => d.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-3 pb-2 h-full">
                    {stageDeals.map(deal => (
                      <SortableDealCard key={deal.id} deal={deal} />
                    ))}
                    {/* Invisible drop target for empty columns */}
                    {stageDeals.length === 0 && (
                      <div className="h-full min-h-[100px] rounded-lg border-2 border-dashed border-border/30" />
                    )}
                  </div>
                </SortableContext>
              </KanbanColumnContent>
            </div>
          )
        })}
      </div>
      <DragOverlay>
        {activeDeal ? <DealCard deal={activeDeal} isDragging /> : null}
      </DragOverlay>
    </DndContext>
  )
}
