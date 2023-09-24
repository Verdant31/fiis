import { Percent } from "@/components/fiis/FiiWallet";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const updatedFiis: Percent[] = body.updatedFiis;

    const response = await Promise.all(
      updatedFiis.map(
        async (fii) =>
          await prisma.fii.update({
            data: {
              qty: fii.qty,
            },
            where: {
              name: fii.name,
            },
          })
      )
    );
    return NextResponse.json({ message: "FII created", status: 200, response });
  } catch (err) {
    return NextResponse.json({ message: (err as Error)?.message, status: 500 });
  }
}
