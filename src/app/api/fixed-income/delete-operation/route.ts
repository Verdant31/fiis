"use server";
import { NextResponse } from "next/server";
import { validateRequest } from "@/lib/validate-request";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: Request) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized", status: 401 });
    }
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({
        message: "Informações faltando",
        status: 400,
      });
    }

    const operation = await prisma.fixedIncomeOperations.delete({
      where: {
        id,
        userId: user.id,
      },
    });

    const fixedIncomeOperations = await prisma.fixedIncomeOperations.findMany({
      where: {
        userId: user.id,
      },
    });

    const fiisOperations = await prisma.fiisOperations.findMany({
      where: { userId: user.id },
    });

    return NextResponse.json({
      userHasEmptyData:
        fixedIncomeOperations.length === 0 && fiisOperations.length === 0,
      operation,
      operations: fixedIncomeOperations,
      message: "Operação deletada com sucesso.",
      status: 200,
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: (err as Error)?.message, status: 500 });
  }
}
