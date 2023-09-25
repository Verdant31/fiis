import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const fiiId = searchParams.get("fiiId");

    const fiis = await prisma.paymentHistory.findMany({
      where: {
        fiiId: parseInt(fiiId as string),
      },
    });
    return NextResponse.json({ status: 200, fiis });
  } catch (err) {
    return NextResponse.json({ message: "Interal error", status: 500 });
  }
}
