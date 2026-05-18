import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        contact: true,
        createdBy: { select: { name: true, email: true } },
        lineItems: {
          include: { product: { select: { name: true, sku: true } } }
        }
      }
    });

    if (!invoice) return NextResponse.json({ error: "Not Found" }, { status: 404 });

    return NextResponse.json(invoice);
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await request.json();
    
    // We only allow basic updates here. For line item changes, we'd typically need a more complex flow,
    // deleting old line items and creating new ones, or updating them individually.
    const invoice = await prisma.invoice.update({
      where: { id },
      data: {
        dueDate: body.dueDate ? new Date(body.dueDate) : undefined
      }
    });

    return NextResponse.json(invoice);
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
