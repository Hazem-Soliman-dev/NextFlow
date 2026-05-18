import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const userRole = (session.user as any).role;
    const body = await request.json();
    const { status } = body;

    // Role-gating logic
    if (status === "PAID" && userRole !== "ADMIN" && userRole !== "ACCOUNTANT") {
      return NextResponse.json({ error: "Only Accountants or Admins can mark invoices as PAID" }, { status: 403 });
    }

    const invoice = await prisma.invoice.update({
      where: { id },
      data: { status }
    });

    return NextResponse.json(invoice);
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
