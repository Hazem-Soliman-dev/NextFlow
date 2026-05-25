"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Building, User, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DealForm } from "@/components/crm/deal-form"

export function DealCard({ deal, isDragging = false, onRefresh }: { deal: any, isDragging?: boolean, onRefresh?: () => void }) {
  const isWon = deal.stage === "WON"
  const isLost = deal.stage === "LOST"
  
  let borderColor = "border-border/50"
  if (isWon) borderColor = "border-emerald-500/40 bg-emerald-500/5"
  if (isLost) borderColor = "border-red-500/40 bg-red-500/5"

  return (
    <Card className={`relative group ${borderColor} ${isDragging ? 'opacity-80 shadow-lg scale-105 rotate-2 cursor-grabbing' : 'hover:border-indigo-500/30 transition-colors shadow-sm'}`}>
      <CardContent className="p-4 flex flex-col gap-3">
        <div className="flex justify-between items-start gap-2">
          <h4 className="font-semibold text-sm leading-tight text-foreground/90">{deal.title}</h4>
          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
            <div className="text-sm font-bold text-indigo-400 whitespace-nowrap bg-indigo-500/10 px-2 py-0.5 rounded-md">
              ${deal.value.toLocaleString()}
            </div>
            {!isDragging && onRefresh && (
              <div 
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
              >
                <DealForm deal={deal} onSuccess={onRefresh}>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground">
                    <Pencil className="h-3 w-3" />
                  </Button>
                </DealForm>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-col gap-1.5 text-xs text-muted-foreground">
          {deal.contact?.name && (
            <div className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" />
              <span className="truncate">{deal.contact.name}</span>
            </div>
          )}
          {deal.contact?.company && (
            <div className="flex items-center gap-1.5">
              <Building className="h-3.5 w-3.5" />
              <span className="truncate">{deal.contact.company}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-1 pt-3 border-t border-border/40">
          <div className="flex -space-x-2">
            <Avatar className="h-6 w-6 border-2 border-background">
              <AvatarImage src={deal.assignedTo?.avatarUrl || ''} />
              <AvatarFallback className="text-[10px]">{deal.assignedTo?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
          <div className="text-[10px] uppercase font-medium text-muted-foreground/60 tracking-wider">
            {new Date(deal.createdAt).toLocaleDateString()}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function SortableDealCard({ deal, onRefresh }: { deal: any, onRefresh?: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: deal.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="cursor-grab relative group">
      <DealCard deal={deal} onRefresh={onRefresh} />
    </div>
  )
}
