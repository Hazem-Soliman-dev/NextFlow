"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { Plus, Search, Building, Mail, Phone, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { ContactForm } from "@/components/crm/contact-form"
import { useLang } from "@/lib/lang-context"

export default function ContactsPage() {
  const { strings, dir } = useLang()
  const [contacts, setContacts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")
  const [refreshKey, setRefreshKey] = useState(0)

  const handleDeleteContact = async (contactId: string) => {
    if (!confirm(strings.deleteConfirm)) return
    
    try {
      const res = await fetch(`/api/contacts/${contactId}`, {
        method: "DELETE"
      })
      if (res.ok) {
        setRefreshKey(prev => prev + 1)
      } else {
        alert("Failed to delete contact")
      }
    } catch (error) {
      console.error(error)
      alert("An error occurred")
    }
  }

  useEffect(() => {
    const fetchContacts = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/contacts?q=${encodeURIComponent(query)}`)
        if (res.ok) {
          const data = await res.json()
          setContacts(data.contacts)
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    const timer = setTimeout(() => {
      fetchContacts()
    }, 300) // debounce

    return () => clearTimeout(timer)
  }, [query, refreshKey])

  return (
    <div className="space-y-6" dir={dir}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="text-start">
          <h1 className="text-3xl font-bold tracking-tight">{strings.contactsTitle}</h1>
          <p className="text-muted-foreground">{strings.contactsSub}</p>
        </div>
        <ContactForm onSuccess={() => setRefreshKey(prev => prev + 1)}>
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="mr-2 h-4 w-4" /> {strings.addContact}
          </Button>
        </ContactForm>
      </div>

      <div className="flex items-center space-x-2 rtl:space-x-reverse">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground rtl:left-auto rtl:right-2.5" />
          <Input
            type="search"
            placeholder={strings.searchContacts}
            className="pl-8 rtl:pl-3 rtl:pr-8 text-start"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border border-border/50 bg-card/50">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-start">{strings.nameHeader}</TableHead>
              <TableHead className="text-start">{strings.companyHeader}</TableHead>
              <TableHead className="hidden md:table-cell text-start">{strings.tagsHeader}</TableHead>
              <TableHead className="hidden lg:table-cell text-start">{strings.addedHeader}</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-[150px]" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-[100px]" /></TableCell>
                  <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-[100px]" /></TableCell>
                  <TableCell className="hidden lg:table-cell"><Skeleton className="h-5 w-[80px]" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8 rounded-md" /></TableCell>
                </TableRow>
              ))
            ) : contacts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  {strings.noContacts}
                </TableCell>
              </TableRow>
            ) : (
              contacts.map((contact) => (
                <TableRow key={contact.id} className="hover:bg-muted/50 cursor-pointer">
                  <TableCell className="text-start">
                    <Link href={`/dashboard/crm/contacts/${contact.id}`} className="flex flex-col">
                      <span className="font-medium text-foreground">{contact.name}</span>
                      <div className="flex items-center text-xs text-muted-foreground mt-1 gap-2">
                        {contact.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {contact.email}</span>}
                        {contact.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {contact.phone}</span>}
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell className="text-start">
                    {contact.company && (
                      <div className="flex items-center gap-1.5 text-sm">
                        <Building className="h-3.5 w-3.5 text-muted-foreground" />
                        {contact.company}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-start">
                    <div className="flex flex-wrap gap-1">
                      {contact.tags.map((tag: string) => (
                        <Badge key={tag} variant="secondary" className="text-xs bg-indigo-500/10 text-indigo-400 border-indigo-500/20">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-sm text-muted-foreground text-start">
                    {format(new Date(contact.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align={dir === "rtl" ? "start" : "end"}>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/crm/contacts/${contact.id}`} className="text-start block w-full">{strings.viewDetails}</Link>
                        </DropdownMenuItem>
                        <ContactForm contact={contact} onSuccess={() => setRefreshKey(prev => prev + 1)}>
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-start cursor-pointer">
                            {strings.editContact}
                          </DropdownMenuItem>
                        </ContactForm>
                        <DropdownMenuItem className="text-red-500 cursor-pointer text-start" onClick={() => handleDeleteContact(contact.id)}>
                          {strings.deleteText}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
