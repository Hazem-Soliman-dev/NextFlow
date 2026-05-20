import Link from "next/link"
import { ArrowRight, CheckCircle2, Shield, Package, FileText, KanbanSquare } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight">Nexflow</span>
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
            <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
            <Link href="#roles" className="hover:text-foreground transition-colors">Role Access</Link>
            <Link href="#faq" className="hover:text-foreground transition-colors">FAQ</Link>
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
                href="https://github.com/Hazem-Soliman-dev/NextFlow"
                target="_blank"
                className="inline-flex h-12 items-center justify-center rounded-lg border border-border/50 bg-background px-8 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                View Source Code
              </Link>
            </div>
          </div>
        </section>

        {/* Mockup Dashboard Preview Section */}
        <section className="relative -mt-16 pb-24 flex justify-center">
          <div className="container relative mx-auto px-4 md:px-8 flex justify-center">
            <div className="relative w-full max-w-5xl rounded-2xl border border-indigo-500/20 bg-zinc-950/80 p-2 shadow-2xl backdrop-blur-sm">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/30 bg-zinc-900/50 rounded-t-xl">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500/80"></div>
                  <div className="h-3 w-3 rounded-full bg-amber-500/80"></div>
                  <div className="h-3 w-3 rounded-full bg-emerald-500/80"></div>
                </div>
                <div className="text-[10px] sm:text-xs text-muted-foreground font-mono bg-zinc-950 px-4 py-1 rounded-md border border-border/20">
                  next-flow-taupe.vercel.app/dashboard
                </div>
                <div className="w-12"></div>
              </div>
              <div className="p-4 bg-zinc-950/40 rounded-b-xl grid grid-cols-6 gap-4 min-h-[350px]">
                {/* Mock Sidebar */}
                <div className="col-span-1 hidden sm:flex flex-col gap-3 border-r border-border/20 pr-4 pt-1">
                  <div className="h-4 w-16 bg-indigo-500/20 rounded mb-2"></div>
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="h-3 w-3 bg-muted rounded-full"></div>
                      <div className="h-2 w-10 bg-muted rounded"></div>
                    </div>
                  ))}
                </div>
                {/* Mock Dashboard Grid */}
                <div className="col-span-6 sm:col-span-5 space-y-4">
                  {/* Mock KPI Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { label: "Won Revenue", value: "$45,280.00", color: "text-emerald-400" },
                      { label: "Pipeline Value", value: "$120,500.00", color: "text-indigo-400" },
                      { label: "Total Contacts", value: "84 active", color: "text-blue-400" },
                      { label: "Low Stock Items", value: "3 alerts", color: "text-red-400" }
                    ].map((kpi, idx) => (
                      <div key={idx} className="p-3 rounded-xl border border-border/20 bg-background/50">
                        <p className="text-[9px] text-muted-foreground uppercase tracking-wider">{kpi.label}</p>
                        <p className={`text-sm font-bold mt-1 ${kpi.color}`}>{kpi.value}</p>
                      </div>
                    ))}
                  </div>
                  {/* Mock Table and Charts mockup */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl border border-border/20 bg-background/50 h-[180px] flex flex-col justify-between">
                      <div className="flex justify-between items-center">
                        <div className="h-3 w-24 bg-muted rounded"></div>
                        <div className="h-3.5 w-12 bg-indigo-500/10 rounded"></div>
                      </div>
                      <div className="space-y-2.5">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <div key={i} className="flex justify-between items-center">
                            <div className="flex gap-2 items-center">
                              <div className="h-5 w-5 bg-muted rounded-full"></div>
                              <div className="h-2.5 w-20 bg-muted rounded"></div>
                            </div>
                            <div className="h-2.5 w-10 bg-muted rounded"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="p-4 rounded-xl border border-border/20 bg-background/50 h-[180px] flex flex-col justify-between">
                      <div className="h-3 w-32 bg-muted rounded"></div>
                      <div className="flex-1 flex items-end gap-2.5 justify-around mt-4 pt-2">
                        {[40, 65, 35, 85, 50, 75].map((val, idx) => (
                          <div key={idx} className="w-6 bg-indigo-500/20 hover:bg-indigo-500/40 transition-colors rounded-t" style={{ height: `${val}%` }}></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
                    <Link href="/login" className="block w-full py-3 px-4 rounded-lg border border-indigo-500/30 bg-indigo-600/10 text-indigo-400 text-center text-sm font-medium hover:bg-indigo-600 hover:text-white transition-all duration-200 hover:scale-[1.02]">Login as Admin</Link>
                    <Link href="/login" className="block w-full py-3 px-4 rounded-lg border border-border/50 bg-background/50 text-center text-sm font-medium hover:bg-muted hover:text-foreground transition-all duration-200 hover:scale-[1.02]">Login as Sales Rep</Link>
                    <Link href="/login" className="block w-full py-3 px-4 rounded-lg border border-border/50 bg-background/50 text-center text-sm font-medium hover:bg-muted hover:text-foreground transition-all duration-200 hover:scale-[1.02]">Login as Warehouse</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* FAQ Section */}
        <section id="faq" className="py-24 border-t border-border/40">
          <div className="container mx-auto px-4 md:px-8 max-w-4xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Frequently Asked Questions</h2>
              <p className="text-muted-foreground text-lg">Clear answers on how the demo environment behaves.</p>
            </div>
            <div className="space-y-4">
              {[
                {
                  q: "How does the passwordless demo login work?",
                  a: "For testing purposes, NextFlow uses a custom NextAuth credentials provider. Clicking any role instantly initializes a session with the correct database permissions, bypassing password checks. In production, this is swapped for secure OAuth or standard bcrypt hashing."
                },
                {
                  q: "Is the data persistent or reset regularly?",
                  a: "The data is persisted in a serverless Neon PostgreSQL database instance. If needed, you can reset the seed dataset using the database migrations configured via Prisma ORM."
                },
                {
                  q: "What role restrictions are enforced in CRM vs. Invoicing?",
                  a: "We enforce strict backend RBAC rules. For example, WAREHOUSE role sessions cannot view the Deals pipeline or Invoice values, and SALES_REP sessions can only edit contacts assigned directly to their account, returning 403 authorization warnings for violations."
                },
                {
                  q: "Can I export invoices as physical files?",
                  a: "Yes! The Invoices module includes a client-side PDF exporter utility built on jsPDF. It generates clean client invoices, automatically compiling line items, pricing calculations, and company headers into a downloadable file."
                }
              ].map((faq, idx) => (
                <div key={idx} className="p-6 rounded-xl border border-border/30 bg-background/30 hover:border-indigo-500/20 transition-all">
                  <h3 className="font-semibold text-lg text-foreground/90">{faq.q}</h3>
                  <p className="text-muted-foreground text-sm mt-2 leading-relaxed">{faq.a}</p>
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
            <Link href="https://github.com/Hazem-Soliman-dev" className="hover:text-foreground transition-colors">GitHub</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
