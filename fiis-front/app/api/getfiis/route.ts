import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
export const revalidate = 0;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userName = searchParams.get("userName") as string;
    const fiis = await prisma.fii.findMany({
      where: {
        FiisPurchases: {
          every: {
            userName,
          },
        },
      },
    });

    return NextResponse.json({ status: 200, fiis });
  } catch (err) {
    console.log("err", err);
    return NextResponse.json({ message: "Interal error", status: 500 });
  }
}
