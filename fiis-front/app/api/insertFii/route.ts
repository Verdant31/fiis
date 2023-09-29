import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fiis } = body?.fiis as { fiis: { name: string; qty: string; purchaseDate: string }[] };

    const dbFiis = await prisma.fii.findMany();

    const response = await Promise.all(
      fiis.map(async (fii) => {
        const foundInDb = dbFiis.find((fiiDb) => fiiDb.name === fii.name);
        if (!foundInDb) {
          const created = await prisma.fii.create({
            data: {
              name: fii.name,
            },
          });

          return await prisma.fiisPurchases.create({
            data: {
              purchaseDate: fii.purchaseDate,
              qty: parseInt(fii.qty),
              userName: body.userName,
              fiiName: created.name,
            },
          });
        }

        const created = await prisma.fiisPurchases.create({
          data: {
            purchaseDate: fii.purchaseDate,
            qty: parseInt(fii.qty),
            userName: body.userName,
            fiiName: foundInDb.name,
          },
        });
        return created;
      })
    );

    return NextResponse.json({ message: "FII created", status: 200, fii: response });
  } catch (err) {
    return NextResponse.json({ message: (err as Error)?.message, status: 500 });
  }
}
