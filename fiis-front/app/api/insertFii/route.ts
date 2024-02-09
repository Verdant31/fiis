import { Field } from "@/components/fiis/InsertFiiModal";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import util from "util";
const execAsync = util.promisify(exec);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const fiis = body?.fiis as Field[];

    const formatedToCreation = fiis?.map((fii) => ({
      fiiName: fii.name,
      qty: parseInt(fii.qty),
      purchaseDate: fii.purchaseDate,
      quotationValue: parseFloat(fii.quotationValue),
      initialValue: parseFloat(fii.quotationValue)
    }))


    const response = await prisma.fiisPurchases.createMany({
      data: formatedToCreation
    })
    const { stdout } = await execAsync(`ts-node C:/Users/Verdant/Desktop/fiis/fiis-script/src/index.ts`);
    return NextResponse.json({ message: "FII created", status: 200, response, stdout});
  } catch (err) {
    return NextResponse.json({ message: (err as Error)?.message, status: 500 });
  }
}
