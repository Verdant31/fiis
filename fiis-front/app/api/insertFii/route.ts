import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fiis } = body?.fiis as { fiis: { name: string; qty: string }[] };
    const dbFiis = await prisma.fii.findMany({ where: { userName: body.userName } });

    const response = await Promise.all(
      fiis.map(async (fii) => {
        const alreadyExists = dbFiis.find((dbFii) => dbFii.name === fii.name);
        if (alreadyExists) {
          return await prisma.fii.update({
            data: {
              qty: {
                increment: parseInt(fii.qty),
              },
            },
            where: {
              id: alreadyExists.id,
            },
          });
        }
        const created = await prisma.fii.create({
          data: {
            name: fii.name,
            lastIncomeDate: "",
            lastIncomeValue: 0,
            quotationValue: 0,
            yield: 0,
            initialValue: 0,
            qty: parseInt(fii.qty),
            userName: body.userName,
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
