import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userRole = (session.user as any).role;
    if (userRole !== "ADMIN" && userRole !== "WAREHOUSE") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { productId, type, quantity, reason } = body;

    if (!productId || !type || !quantity) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Use a transaction to ensure stock is updated atomically with the movement record
    const result = await prisma.$transaction(async (tx: { stockMovement: { create: (arg0: { data: { productId: any; type: any; quantity: number; reason: any; createdById: string; }; include: { createdBy: { select: { name: boolean; }; }; }; }) => any; }; product: { update: (arg0: { where: { id: any; }; data: { stock: { increment: number; }; }; }) => any; }; }) => {
      // 1. Create the stock movement record
      const movement = await tx.stockMovement.create({
        data: {
          productId,
          type,
          quantity: Number(quantity),
          reason,
          createdById: session.user?.id as string
        },
        include: { createdBy: { select: { name: true } } }
      });

      // 2. Update the actual product stock
      const stockChange = type === "IN" ? Number(quantity) : -Number(quantity);
      
      const product = await tx.product.update({
        where: { id: productId },
        data: { stock: { increment: stockChange } }
      });

      // Prevent negative stock
      if (product.stock < 0) {
        throw new Error("Insufficient stock");
      }

      return { movement, product };
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    if (error.message === "Insufficient stock") {
      return NextResponse.json({ error: "Insufficient stock" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
