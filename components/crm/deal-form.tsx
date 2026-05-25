"use client"

import React, { useState, useEffect } from "react"
import { useLang } from "@/lib/lang-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const STAGES = [
  { id: "LEAD", key: "stageLead" },
  { id: "QUALIFIED", key: "stageQualified" },
  { id: "PROPOSAL", key: "stageProposal" },
  { id: "WON", key: "stageWon" },
  { id: "LOST", key: "stageLost" }
] as const;

export function DealForm({ children, deal, onSuccess }: { children: React.ReactNode, deal?: any, onSuccess?: () => void }) {
  const { strings, dir } = useLang()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [contacts, setContacts] = useState<any[]>([])
  
  // Controlled fields
  const [title, setTitle] = useState("")
  const [value, setValue] = useState("")
  const [stage, setStage] = useState("LEAD")
  const [contactId, setContactId] = useState("")

  const isEdit = !!deal
  
  // Initialize values when deal or open state changes
  useEffect(() => {
    if (open && deal) {
      setTitle(deal.title)
      setValue(String(deal.value))
      setStage(deal.stage)
      setContactId(deal.contactId)
    } else if (open && !deal) {
      setTitle("")
      setValue("")
      setStage("LEAD")
      setContactId("")
    }
  }, [open, deal])

  // Fetch contacts for the select dropdown when open changes to true
  useEffect(() => {
    if (open) {
      const fetchContacts = async () => {
        try {
          const res = await fetch("/api/contacts?limit=100")
          if (res.ok) {
            const data = await res.json()
            setContacts(data.contacts || [])
          }
        } catch (error) {
          console.error("Error fetching contacts", error)
        }
      }
      fetchContacts()
    }
  }, [open])

  const handleDelete = async () => {
    if (!confirm(strings.deleteDealConfirm)) return
    
    setLoading(true)
    try {
      const res = await fetch(`/api/deals/${deal.id}`, {
        method: "DELETE"
      })
      if (res.ok) {
        setOpen(false)
        if (onSuccess) onSuccess()
      } else {
        alert("Failed to delete deal")
      }
    } catch (error) {
      console.error(error)
      alert("An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !value.trim() || !contactId) {
      alert(strings.fillRequiredFields)
      return
    }

    setLoading(true)
    try {
      const url = isEdit ? `/api/deals/${deal.id}` : "/api/deals"
      const method = isEdit ? "PATCH" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          value: Number(value),
          stage,
          contactId
        })
      })
      if (res.ok) {
        if (!isEdit) {
          // Reset form on create
          setTitle("")
          setValue("")
          setStage("LEAD")
          setContactId("")
        }
        setOpen(false)
        if (onSuccess) onSuccess()
      } else {
        const errorData = await res.json()
        alert(errorData.error || "Failed to save deal")
      }
    } catch (error) {
      console.error("Deal submission error:", error)
      alert("An error occurred while saving the deal")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" dir={dir}>
        <DialogHeader className="text-start">
          <DialogTitle>{isEdit ? strings.editContact : strings.addDeal}</DialogTitle>
          <DialogDescription>
            {isEdit ? strings.editDealDesc : strings.addDealDesc}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2 text-start">
          <div className="space-y-1.5">
            <Label htmlFor="deal-title">{strings.dealTitleLabel}</Label>
            <Input 
              id="deal-title" 
              placeholder={strings.dealTitlePlaceholder} 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="deal-value">{strings.valueLabel}</Label>
              <Input 
                id="deal-value" 
                type="number" 
                min="0"
                placeholder={strings.valuePlaceholder} 
                value={value}
                onChange={(e) => setValue(e.target.value)}
                required 
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="deal-stage">{strings.pipelineStageLabel}</Label>
              <Select value={stage} onValueChange={setStage}>
                <SelectTrigger id="deal-stage">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STAGES.map(s => <SelectItem key={s.id} value={s.id}>{(strings as any)[s.key]}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="deal-contact">{strings.contactClientLabel}</Label>
            <Select value={contactId} onValueChange={setContactId}>
              <SelectTrigger id="deal-contact">
                <SelectValue placeholder={strings.selectContactPlaceholder} />
              </SelectTrigger>
              <SelectContent>
                {contacts.length === 0 ? (
                  <SelectItem value="none" disabled>{strings.noContactsFound}</SelectItem>
                ) : (
                  contacts.map(c => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name} {c.company ? `(${c.company})` : ""}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="pt-2 gap-2 sm:gap-0 text-start">
            {isEdit && (
              <Button type="button" variant="destructive" onClick={handleDelete} disabled={loading} className="w-full sm:w-auto">
                {strings.deleteDeal}
              </Button>
            )}
            <Button type="submit" disabled={loading} className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white ltr:ml-auto rtl:mr-auto">
              {loading ? strings.saving : strings.saveDeal}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
