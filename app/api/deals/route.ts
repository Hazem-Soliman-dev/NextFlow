import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const searchParams = request.nextUrl.searchParams;
    const assignedToId = searchParams.get("assignedToId");
    
    // Role filtering: Sales Rep sees own deals, Manager/Admin see all
    const userRole = (session.user as any).role;
    
    const where: any = {};
    
    if (userRole === "SALES_REP") {
      where.assignedToId = session.user?.id;
    } else if (assignedToId) {
      where.assignedToId = assignedToId;
    }

    const deals = await prisma.deal.findMany({
      where,
      include: {
        contact: { select: { name: true, company: true } },
        assignedTo: { select: { name: true, avatarUrl: true } }
      },
      orderBy: { updatedAt: 'desc' }
    });

    return NextResponse.json(deals);
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const deal = await prisma.deal.create({
      data: {
        title: body.title,
        value: Number(body.value),
        stage: body.stage || "LEAD",
        contactId: body.contactId,
        assignedToId: body.assignedToId || session.user?.id,
      },
      include: {
        contact: { select: { name: true, company: true } },
        assignedTo: { select: { name: true, avatarUrl: true } }
      }
    });

    return NextResponse.json(deal, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
