import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
export const revalidate = 0;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userName = searchParams.get("userName") as string;
    const purchases = await prisma.fiisPurchases.findMany({
      where: {
        userName,
      },
      select: {
        fiiName: true,
        id: true,
        paymentHistory: true,
        purchaseDate: true,
        qty: true,
        userName: true,
      },
    });

    const flatHistory = purchases.flatMap((purchase) => purchase.paymentHistory);

    return NextResponse.json({ status: 200, purchases, flatHistory });
  } catch (err) {
    console.log("err", err);
    return NextResponse.json({ message: "Interal error", status: 500 });
  }
}
