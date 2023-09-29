import { Percent } from "@/components/fiis/FiiWallet";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

interface InsertPercent extends Percent {
  oldQty: number;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const updatedFiis: InsertPercent[] = body.updatedFiis;

    const response = await Promise.all(
      updatedFiis.map(async (fii) => {
        await prisma.fiisPurchases.create({
          data: {
            purchaseDate: format(new Date(), "dd/MM/yyyy"),
            qty: fii.qty - fii.oldQty,
            fiiName: fii.name,
            userName: body.userName,
          },
        });
      })
    );
    return NextResponse.json({ message: "FII created", status: 200, response });
  } catch (err) {
    return NextResponse.json({ message: (err as Error)?.message, status: 500 });
  }
}
