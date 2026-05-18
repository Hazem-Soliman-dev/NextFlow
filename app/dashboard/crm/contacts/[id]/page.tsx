"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams } from "next/navigation"
import { format } from "date-fns"
import { Building, Mail, Phone, Clock, ArrowLeft, Tag, User, Plus } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ContactDetailPage() {
  const { id } = useParams()
  const [contact, setContact] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  // Note/Call log state
  const [noteOpen, setNoteOpen] = useState(false)
  const [noteType, setNoteType] = useState<"NOTE" | "CALL">("NOTE")
  const [noteContent, setNoteContent] = useState("")
  const [submittingNote, setSubmittingNote] = useState(false)

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!noteContent.trim()) return
    
    setSubmittingNote(true)
    try {
      const res = await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: noteType,
          content: noteContent,
          contactId: id
        })
      })
      if (res.ok) {
        setNoteContent("")
        setNoteOpen(false)
        fetchContact()
      } else {
        alert("Failed to save activity note")
      }
    } catch (error) {
      console.error(error)
      alert("An error occurred")
    } finally {
      setSubmittingNote(false)
    }
  }

  const fetchContact = useCallback(async () => {
    try {
      const res = await fetch(`/api/contacts/${id}`)
      if (res.ok) {
        const data = await res.json()
        setContact(data)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchContact()
  }, [fetchContact])

  if (loading) {
    return <div className="space-y-6"><Skeleton className="h-8 w-64" /><Skeleton className="h-64 w-full" /></div>
  }

  if (!contact) {
    return <div>Contact not found</div>
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/crm/contacts"
          className={buttonVariants({ variant: "ghost", size: "icon" })}
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">{contact.name}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Contact Info Card */}
        <Card className="md:col-span-1 border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle>Contact Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {contact.company && (
              <div className="flex items-center gap-3 text-sm">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span>{contact.company}</span>
              </div>
            )}
            {contact.email && (
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href={`mailto:${contact.email}`} className="text-indigo-500 hover:underline">{contact.email}</a>
              </div>
            )}
            {contact.phone && (
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a href={`tel:${contact.phone}`} className="text-indigo-500 hover:underline">{contact.phone}</a>
              </div>
            )}
            
            {contact.tags && contact.tags.length > 0 && (
              <>
                <Separator className="my-4" />
                <div className="space-y-2">
                  <div className="text-xs font-medium text-muted-foreground uppercase flex items-center gap-2">
                    <Tag className="h-3 w-3" /> Tags
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {contact.tags.map((tag: string) => (
                      <Badge key={tag} variant="secondary" className="bg-indigo-500/10 text-indigo-500 border-indigo-500/20">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}

            {contact.notes && (
              <>
                <Separator className="my-4" />
                <div className="space-y-2">
                  <div className="text-xs font-medium text-muted-foreground uppercase">Notes</div>
                  <p className="text-sm text-foreground/80 whitespace-pre-wrap">{contact.notes}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Main Content Area */}
        <div className="md:col-span-2 space-y-6">
          {/* Active Deals */}
          <Card className="border-border/50 bg-card/50">
            <CardHeader>
              <CardTitle>Deals ({contact.deals?.length || 0})</CardTitle>
            </CardHeader>
            <CardContent>
              {contact.deals?.length === 0 ? (
                <p className="text-sm text-muted-foreground">No deals associated with this contact.</p>
              ) : (
                <div className="space-y-3">
                  {contact.deals?.map((deal: any) => (
                    <div key={deal.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-background hover:bg-muted/50 transition-colors">
                      <div>
                        <Link href="/dashboard/crm/deals" className="font-medium text-indigo-500 hover:underline">{deal.title}</Link>
                        <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px] uppercase h-5">{deal.stage}</Badge>
                          <span className="flex items-center gap-1"><User className="h-3 w-3" /> {deal.assignedTo?.name}</span>
                        </div>
                      </div>
                      <div className="font-semibold text-right">
                        ${deal.value.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Activity Timeline */}
          <Card className="border-border/50 bg-card/50">
            <CardHeader className="flex flex-row justify-between items-center pb-2">
              <CardTitle>Activity Log</CardTitle>
              <Dialog open={noteOpen} onOpenChange={setNoteOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8">
                    <Plus className="mr-1.5 h-3.5 w-3.5" /> Add Note
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Log Activity</DialogTitle>
                    <DialogDescription>
                      Record a customer call or leave a note on this contact.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddNote} className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="activity-type">Activity Type</Label>
                      <Select value={noteType} onValueChange={(val) => setNoteType(val as "NOTE" | "CALL")}>
                        <SelectTrigger id="activity-type">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NOTE">Note</SelectItem>
                          <SelectItem value="CALL">Call</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="activity-content">Content</Label>
                      <textarea
                        id="activity-content"
                        placeholder="Write down the details of the call or note..."
                        value={noteContent}
                        onChange={(e) => setNoteContent(e.target.value)}
                        required
                        rows={4}
                        className="flex w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px] text-foreground"
                      />
                    </div>
                    <DialogFooter className="pt-2">
                      <Button type="submit" disabled={submittingNote}>
                        {submittingNote ? "Saving..." : "Save Activity"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="relative border-l border-border/50 ml-3 mt-4 space-y-6 pb-4">
                {contact.activities?.map((activity: any) => (
                  <div key={activity.id} className="relative pl-6">
                    <div className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-indigo-500 ring-4 ring-background" />
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{activity.type === 'CALL' ? 'Logged a call' : 'Left a note'}</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {format(new Date(activity.createdAt), "MMM d, h:mm a")}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground/90 bg-muted/30 p-3 rounded-md border border-border/30 mt-1">
                        {activity.content}
                      </p>
                      <div className="text-xs font-medium text-muted-foreground mt-1.5 flex items-center gap-1.5">
                        <User className="h-3 w-3" /> {activity.user?.name}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
