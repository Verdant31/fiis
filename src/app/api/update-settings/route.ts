"use server";
import { NextResponse } from "next/server";
import { validateRequest } from "@/lib/validate-request";
import { prisma } from "@/lib/prisma";

interface Payload {
  displayExpiredIncomes: boolean;
  displayZeroedFunds: boolean;
}

export async function POST(req: Request) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized", status: 401 });
    }
    const body: Payload = await req.json();

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        displayExpiredIncomes: body.displayExpiredIncomes,
        displayZeroedFunds: body.displayZeroedFunds,
      },
    });

    return NextResponse.json({
      updatedUser,
      message: "Alteração feita com sucesso.",
      status: 200,
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: (err as Error)?.message, status: 500 });
  }
}
