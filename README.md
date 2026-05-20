# Nexflow - Business Operating System

Nexflow is a modern, full-stack business application demonstrating a unified CRM, Inventory, and Invoicing system. It features real-time role-based access control (RBAC), drag-and-drop Kanban pipelines, and atomic stock management.

![Nexflow](https://via.placeholder.com/1200x600/0d0d18/ffffff?text=Nexflow+Dashboard)

## 🚀 Live Demo

**[next-flow-taupe.vercel.app](https://next-flow-taupe.vercel.app)**

*Use the built-in frictionless login to instantly switch between 5 distinct personas and test the RBAC rules.*

## 🛠 Tech Stack

- **Framework:** Next.js 16 (App Router) & React 19
- **UI & Styling:** Tailwind CSS v4, Shadcn UI, Radix Primitives, Base UI
- **Database:** Neon Serverless PostgreSQL
- **ORM:** Prisma v5
- **Authentication:** NextAuth.js v5 (Beta)
- **Interactions:** `@dnd-kit` (Kanban), `recharts` (Dashboards), `jsPDF` (Invoice Exports)

## 🏗 Architecture

```mermaid
graph TD
    Client["Client (Browser)"] -->|Next.js App Router| NextAuth[NextAuth v5 Middleware]
    NextAuth -->|Session/Role| API[API Routes / Server Actions]
    API -->|Prisma Client| Neon[(Neon PostgreSQL)]
    
    subgraph Modules
    CRM[CRM Module]
    INV[Inventory Module]
    BILL[Invoicing Module]
    end
    
    API --> CRM
    API --> INV
    API --> BILL
    
    CRM -.->|Deals linked to Contacts| CRM
    BILL -.->|Invoices linked to Contacts| CRM
    BILL -.->|Line items linked to Products| INV
    INV -.->|Atomic Stock Adjustments| INV
```

## 🔐 Role Access Matrix

Nexflow implements a robust RBAC system utilizing 5 distinct roles:

| Feature / Module | `ADMIN` | `MANAGER` | `SALES_REP` | `WAREHOUSE` | `ACCOUNTANT` |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Contacts (CRM)** | Full | Read/Write | Read/Write (Own) | Read-Only | Read-Only |
| **Deals (Kanban)** | Full | Read/Write | Read/Write (Own) | No Access | No Access |
| **Products (Inventory)** | Full | Read-Only | Read-Only | Full | Read-Only |
| **Stock Adjustments** | Yes | No | No | Yes | No |
| **Invoices (Create)** | Yes | No | Yes | No | Yes |
| **Invoices (Mark Paid)** | Yes | No | No | No | Yes |
| **Dashboard KPIs** | Global | Team | Personal | Logistics | Financial |

## 💻 Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Hazem-Soliman-dev/NextFlow.git
   cd NextFlow
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://user:password@hostname/dbname?sslmode=require"
   NEXTAUTH_SECRET="your-super-secret-key-at-least-32-chars"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Initialize the Database:**
   ```bash
   npx prisma db push
   npx prisma generate
   ```

5. **Seed Demo Data:**
   ```bash
   npm run seed
   ```

6. **Run the Development Server:**
   ```bash
   npm run dev
   ```

7. **Access the App:**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 License

MIT License. See [LICENSE](LICENSE) for more information.
