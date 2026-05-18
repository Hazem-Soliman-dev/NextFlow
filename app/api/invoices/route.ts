import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    
    const where: any = {};
    if (status && status !== "ALL") {
      where.status = status;
    }

    const invoices = await prisma.invoice.findMany({
      where,
      include: {
        contact: { select: { name: true, email: true, company: true } },
        createdBy: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(invoices);
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { contactId, dueDate, status, subtotal, tax, total, lineItems } = body;

    // Default invoice number generation (e.g. INV-YYYYMMDD-XXXX)
    const count = await prisma.invoice.count();
    const invoiceNumber = `INV-${new Date().toISOString().slice(0,10).replace(/-/g, '')}-${(count + 1).toString().padStart(4, '0')}`;

    const invoice = await prisma.invoice.create({
      data: {
        number: invoiceNumber,
        contactId,
        status: status || "DRAFT",
        dueDate: new Date(dueDate),
        subtotal: Number(subtotal),
        taxAmount: Number(tax),
        total: Number(total),
        createdById: session.user?.id as string,
        lineItems: {
          create: lineItems.map((item: { productId: any; description: any; quantity: number; unitPrice: number; }) => ({
            productId: item.productId,
            description: item.description,
            quantity: Number(item.quantity),
            unitPrice: Number(item.unitPrice),
            total: Number(item.quantity) * Number(item.unitPrice)
          }))
        }
      },
      include: {
        lineItems: true,
        contact: true
      }
    });

    return NextResponse.json(invoice, { status: 201 });
  } catch (error) {
    console.error("Create invoice error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
