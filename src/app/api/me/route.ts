"use server";
import { NextResponse } from "next/server";
import { validateRequest } from "@/lib/validate-request";
import { prisma } from "@/lib/prisma";
export async function GET() {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized", status: 401 });
    }
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        email: true,
        displayExpiredIncomes: true,
        displayZeroedFunds: true,
      },
    });

    return NextResponse.json({
      user: {
        ...user,
        ...dbUser,
      },
      message: "Operação cadastrada com sucesso.",
      status: 200,
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: (err as Error)?.message, status: 500 });
  }
}
