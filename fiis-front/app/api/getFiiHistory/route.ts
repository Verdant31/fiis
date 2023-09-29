import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const fiiId = searchParams.get("fiiId") as string;
    const userName = searchParams.get("userName") as string;

    const fiis = await prisma.fiisPurchases.findMany({
      where: {
        fii: {
          id: parseInt(fiiId as string),
        },
        userName,
      },
      select: {
        fiiName: true,
        id: true,
        purchaseDate: true,
        qty: true,
        paymentHistory: true,
      },
    });
    return NextResponse.json({ status: 200, fiis });
  } catch (err) {
    console.log("err", err);
    return NextResponse.json({ message: "Interal error", status: 500 });
  }
}
