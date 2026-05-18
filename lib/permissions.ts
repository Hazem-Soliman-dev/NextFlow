import { Session } from "next-auth";

export type Role = "ADMIN" | "MANAGER" | "SALES_REP" | "WAREHOUSE" | "ACCOUNTANT";

export const ROLE_ACCESS = {
  ADMIN: ["crm", "inventory", "invoices", "dashboard", "settings"],
  MANAGER: ["crm", "invoices", "dashboard"],
  SALES_REP: ["crm", "dashboard"],
  WAREHOUSE: ["inventory", "dashboard"],
  ACCOUNTANT: ["invoices", "dashboard"],
};

export function canAccess(role: Role, module: string): boolean {
  const allowedModules = ROLE_ACCESS[role] || [];
  return allowedModules.includes(module);
}

export function requireRole(session: Session | null, ...allowedRoles: Role[]) {
  if (!session?.user) throw new Error("Unauthorized");
  
  const userRole = (session.user as any).role as Role;
  if (!allowedRoles.includes(userRole) && userRole !== "ADMIN") {
    throw new Error("Forbidden: Insufficient permissions");
  }
}
