import Link from "next/link"
import { ArrowRight, CheckCircle2, Shield, Zap, Package, FileText, KanbanSquare, Layers, Database, Lock } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white shadow-lg shadow-indigo-600/20">
              N
            </div>
            <span className="text-xl font-bold tracking-tight">Nexflow</span>
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
            <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
            <Link href="#roles" className="hover:text-foreground transition-colors">Role Access</Link>
            <Link href="#tech-stack" className="hover:text-foreground transition-colors">Tech Stack</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium hover:text-indigo-400 transition-colors">
              Log in
            </Link>
            <Link 
              href="/login" 
              className="inline-flex h-9 items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-indigo-600/20 transition-all hover:bg-indigo-700 hover:scale-105"
            >
              Live Demo
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-24 pb-32">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-background to-background"></div>
          <div className="container relative mx-auto px-4 md:px-8 flex flex-col items-center text-center">
            <div className="inline-flex items-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-sm font-medium text-indigo-300 mb-8 backdrop-blur-sm">
              <Zap className="mr-2 h-4 w-4" /> v1.0 is now live
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter max-w-4xl bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
              The all-in-one operating system for your business.
            </h1>
            <p className="mt-6 max-w-[42rem] text-lg text-muted-foreground sm:text-xl">
              Nexflow seamlessly integrates CRM, Inventory, and Invoicing into a single, blazing-fast platform built on Next.js 15.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link 
                href="/login" 
                className="inline-flex h-12 items-center justify-center rounded-lg bg-indigo-600 px-8 text-sm font-medium text-white shadow-xl shadow-indigo-600/20 transition-all hover:bg-indigo-700 hover:scale-105"
              >
                Try the Demo <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link 
                href="https://github.com" 
                target="_blank"
                className="inline-flex h-12 items-center justify-center rounded-lg border border-border/50 bg-background px-8 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                View Source Code
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-zinc-950/50 border-y border-border/40">
          <div className="container mx-auto px-4 md:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Everything you need to scale</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Purpose-built modules that talk to each other perfectly.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="rounded-2xl border border-border/50 bg-background/50 p-8 backdrop-blur-sm transition-all hover:border-indigo-500/30 hover:bg-indigo-500/5">
                <div className="h-12 w-12 rounded-xl bg-blue-500/20 text-blue-500 flex items-center justify-center mb-6">
                  <KanbanSquare className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Modern CRM</h3>
                <p className="text-muted-foreground mb-6">Manage contacts and drag-and-drop deals across your pipeline.</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center"><CheckCircle2 className="h-4 w-4 mr-2 text-blue-500" /> Interactive Kanban board</li>
                  <li className="flex items-center"><CheckCircle2 className="h-4 w-4 mr-2 text-blue-500" /> Activity logging timeline</li>
                  <li className="flex items-center"><CheckCircle2 className="h-4 w-4 mr-2 text-blue-500" /> Tag-based filtering</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-border/50 bg-background/50 p-8 backdrop-blur-sm transition-all hover:border-indigo-500/30 hover:bg-indigo-500/5">
                <div className="h-12 w-12 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center mb-6">
                  <Package className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Inventory Engine</h3>
                <p className="text-muted-foreground mb-6">Real-time stock tracking with atomic adjustments and low-stock alerts.</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center"><CheckCircle2 className="h-4 w-4 mr-2 text-amber-500" /> SKU & Category management</li>
                  <li className="flex items-center"><CheckCircle2 className="h-4 w-4 mr-2 text-amber-500" /> Immutable stock history log</li>
                  <li className="flex items-center"><CheckCircle2 className="h-4 w-4 mr-2 text-amber-500" /> Supplier database</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-border/50 bg-background/50 p-8 backdrop-blur-sm transition-all hover:border-indigo-500/30 hover:bg-indigo-500/5">
                <div className="h-12 w-12 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center mb-6">
                  <FileText className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Smart Invoicing</h3>
                <p className="text-muted-foreground mb-6">Generate, send, and track professional invoices linked directly to inventory.</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center"><CheckCircle2 className="h-4 w-4 mr-2 text-emerald-500" /> Auto-calculating line items</li>
                  <li className="flex items-center"><CheckCircle2 className="h-4 w-4 mr-2 text-emerald-500" /> Client-side PDF export</li>
                  <li className="flex items-center"><CheckCircle2 className="h-4 w-4 mr-2 text-emerald-500" /> Status workflow tracking</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Roles Section */}
        <section id="roles" className="py-24 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none"></div>
          <div className="container relative mx-auto px-4 md:px-8">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">Frictionless Demo Login</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Nexflow uses a customized NextAuth credentials provider that bypasses passwords for the demo. Instantly switch between 5 distinct personas to experience role-based access control (RBAC).
                </p>
                <div className="space-y-4">
                  {[
                    { role: "ADMIN", desc: "Full access to all modules and system settings." },
                    { role: "MANAGER", desc: "Pipeline oversight and team performance tracking." },
                    { role: "SALES_REP", desc: "Focused on contacts, deals, and daily activities." },
                    { role: "WAREHOUSE", desc: "Inventory adjustments and stock monitoring." },
                    { role: "ACCOUNTANT", desc: "Invoice status transitions and revenue reporting." }
                  ].map(r => (
                    <div key={r.role} className="flex items-start gap-4 p-4 rounded-xl border border-border/30 bg-background/40">
                      <Shield className="h-5 w-5 text-indigo-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-semibold">{r.role}</p>
                        <p className="text-sm text-muted-foreground">{r.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-transparent rounded-2xl blur-xl"></div>
                <div className="relative rounded-2xl border border-border/50 bg-black overflow-hidden shadow-2xl">
                  {/* Mock Login UI */}
                  <div className="p-6 border-b border-border/50 flex items-center justify-between bg-zinc-950">
                    <div className="flex gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-500/80"></div>
                      <div className="h-3 w-3 rounded-full bg-amber-500/80"></div>
                      <div className="h-3 w-3 rounded-full bg-emerald-500/80"></div>
                    </div>
                    <div className="text-xs font-mono text-muted-foreground">nexflow.demo/login</div>
                  </div>
                  <div className="p-8 space-y-4 bg-zinc-950/80">
                    <p className="text-center font-semibold mb-6">Select a persona to enter</p>
                    <Link href="/login" className="block w-full py-3 px-4 rounded border border-indigo-500/30 bg-indigo-500/10 text-center text-sm font-medium hover:bg-indigo-500/20 transition-colors">Login as Admin</Link>
                    <Link href="/login" className="block w-full py-3 px-4 rounded border border-border/50 bg-background/50 text-center text-sm font-medium hover:bg-muted transition-colors">Login as Sales Rep</Link>
                    <Link href="/login" className="block w-full py-3 px-4 rounded border border-border/50 bg-background/50 text-center text-sm font-medium hover:bg-muted transition-colors">Login as Warehouse</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tech Stack Section */}
        <section id="tech-stack" className="py-24 bg-zinc-950/80 border-t border-border/40">
          <div className="container mx-auto px-4 md:px-8 text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-12">Powered by the Modern Stack</h2>
            <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
              {[
                { name: "Next.js 15", icon: Layers },
                { name: "React 19", icon: Zap },
                { name: "Prisma ORM", icon: Database },
                { name: "Neon Postgres", icon: Database },
                { name: "NextAuth v5", icon: Lock },
                { name: "Shadcn UI", icon: Package },
                { name: "Tailwind CSS", icon: Layers },
                { name: "TypeScript", icon: FileText }
              ].map((tech, i) => (
                <div key={i} className="flex items-center gap-3 px-6 py-3 rounded-full border border-border/50 bg-background/50 text-sm font-medium backdrop-blur-sm">
                  <tech.icon className="h-4 w-4 text-indigo-400" />
                  {tech.name}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/40 py-10">
        <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-indigo-600 font-bold text-white text-xs">
              N
            </div>
            <span>© 2026 Nexflow Inc. Demo Application.</span>
          </div>
          <div className="flex gap-6">
            <Link href="https://github.com" className="hover:text-foreground transition-colors">GitHub</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Twitter</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
