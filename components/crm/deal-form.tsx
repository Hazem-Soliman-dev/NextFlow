"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const STAGES = [
  { id: "LEAD", title: "Lead" },
  { id: "QUALIFIED", title: "Qualified" },
  { id: "PROPOSAL", title: "Proposal" },
  { id: "WON", title: "Won" },
  { id: "LOST", title: "Lost" }
]

export function DealForm({ children, onSuccess }: { children: React.ReactNode, onSuccess?: () => void }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [contacts, setContacts] = useState<any[]>([])
  
  // Controlled fields
  const [title, setTitle] = useState("")
  const [value, setValue] = useState("")
  const [stage, setStage] = useState("LEAD")
  const [contactId, setContactId] = useState("")

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !value.trim() || !contactId) {
      alert("Please fill all required fields")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/deals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          value: Number(value),
          stage,
          contactId
        })
      })
      if (res.ok) {
        // Reset form
        setTitle("")
        setValue("")
        setStage("LEAD")
        setContactId("")
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Deal</DialogTitle>
          <DialogDescription>
            Create a new deal in your pipeline and link it to a client.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="deal-title">Deal Title</Label>
            <Input 
              id="deal-title" 
              placeholder="e.g. Acme Enterprise Agreement" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="deal-value">Value ($)</Label>
              <Input 
                id="deal-value" 
                type="number" 
                min="0"
                placeholder="5000"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                required 
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="deal-stage">Pipeline Stage</Label>
              <Select value={stage} onValueChange={setStage}>
                <SelectTrigger id="deal-stage">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STAGES.map(s => <SelectItem key={s.id} value={s.id}>{s.title}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="deal-contact">Contact Client</Label>
            <Select value={contactId} onValueChange={setContactId}>
              <SelectTrigger id="deal-contact">
                <SelectValue placeholder="Select contact client..." />
              </SelectTrigger>
              <SelectContent>
                {contacts.length === 0 ? (
                  <SelectItem value="none" disabled>No contacts found</SelectItem>
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
          <DialogFooter className="pt-2">
            <Button type="submit" disabled={loading} className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white">
              {loading ? "Saving..." : "Save Deal"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
