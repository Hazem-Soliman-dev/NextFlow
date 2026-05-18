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
    const body = await request.json();
    
    // In a real app, verify the user has permission to update THIS deal
    // (e.g. they are the assigned rep, or a manager/admin)
    
    const deal = await prisma.deal.update({
      where: { id },
      data: {
        stage: body.stage,
        assignedToId: body.assignedToId,
        value: body.value !== undefined ? Number(body.value) : undefined,
        title: body.title
      },
      include: {
        contact: { select: { name: true, company: true } },
        assignedTo: { select: { name: true, avatarUrl: true } }
      }
    });

    return NextResponse.json(deal);
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    await prisma.deal.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
