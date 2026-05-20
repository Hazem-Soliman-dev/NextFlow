"use client"

import { signIn } from "next-auth/react"
import { Card, CardContent } from "@/components/ui/card"

const ROLES = [
  { id: "ADMIN", title: "Admin", desc: "Full access to all modules and settings.", color: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20" },
  { id: "MANAGER", title: "Manager", desc: "View all deals, team performance, and invoices.", color: "bg-sky-500/10 text-sky-500 border-sky-500/20" },
  { id: "SALES_REP", title: "Sales Rep", desc: "Manage own contacts and deals pipeline.", color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
  { id: "WAREHOUSE", title: "Warehouse", desc: "Manage inventory and stock movements.", color: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  { id: "ACCOUNTANT", title: "Accountant", desc: "Manage invoices and view revenue.", color: "bg-red-500/10 text-red-500 border-red-500/20" },
];

export default function LoginPage() {
  const handleLogin = (role: string) => {
    signIn("credentials", { role, callbackUrl: "/dashboard" })
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-500/10 rounded-xl mb-4">
            <span className="text-2xl">⚡</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome to Nexflow</h1>
          <p className="text-muted-foreground">Select a role below to jump into the demo. No password required.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ROLES.map((r) => (
            <Card
              key={r.id}
              className={`cursor-pointer transition-all hover:scale-[1.02] hover:shadow-md border border-border/50 ${r.id === 'ADMIN' ? 'lg:col-span-3 md:col-span-2' : ''}`}
              onClick={() => handleLogin(r.id)}
            >
              <CardContent className="p-6 flex flex-col items-start gap-4">
                <div>
                  <h3 className="font-semibold text-lg">{r.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{r.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
