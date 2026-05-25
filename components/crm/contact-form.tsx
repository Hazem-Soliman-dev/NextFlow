"use client"

import { useState } from "react"
import { useLang } from "@/lib/lang-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

export function ContactForm({ children, contact, onSuccess }: { children: React.ReactNode, contact?: any, onSuccess?: () => void }) {
  const { strings, dir } = useLang()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const isEdit = !!contact

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    
    try {
      const url = isEdit ? `/api/contacts/${contact.id}` : "/api/contacts"
      const method = isEdit ? "PATCH" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          company: formData.get("company"),
          phone: formData.get("phone"),
          tags: formData.get("tags") ? String(formData.get("tags")).split(",").map(t => t.trim()).filter(Boolean) : []
        })
      })
      if (res.ok) {
        setOpen(false)
        if (onSuccess) onSuccess()
      }
    } catch (error) {
      console.error(error)
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
          <DialogTitle>{isEdit ? strings.editContact : strings.addContact}</DialogTitle>
          <DialogDescription>
            {isEdit ? strings.editContactDesc : strings.addContactDesc}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} key={contact?.id || "new"}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="ltr:text-right rtl:text-left">{strings.nameHeader}</Label>
              <Input id="name" name="name" defaultValue={contact?.name || ""} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="ltr:text-right rtl:text-left">{strings.emailHeader}</Label>
              <Input id="email" name="email" type="email" defaultValue={contact?.email || ""} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="company" className="ltr:text-right rtl:text-left">{strings.companyHeader}</Label>
              <Input id="company" name="company" defaultValue={contact?.company || ""} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="ltr:text-right rtl:text-left">{strings.phoneHeader}</Label>
              <Input id="phone" name="phone" defaultValue={contact?.phone || ""} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tags" className="ltr:text-right rtl:text-left">{strings.tagsHeader}</Label>
              <Input id="tags" name="tags" placeholder={strings.tagsPlaceholder} defaultValue={contact?.tags?.join(", ") || ""} className="col-span-3" />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              {loading ? strings.saving : strings.saveContact}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
