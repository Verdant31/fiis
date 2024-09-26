"use server";
import { IncomeTypes, Operation } from "@prisma/client";
import { NextResponse } from "next/server";
import { outputFormSchema } from "../../../../lib/forms/create-fixed-income-operation";
import { validateRequest } from "@/lib/validate-request";
import { prisma } from "@/lib/prisma";

interface Payload {
  incomes: [{ value: number; type: IncomeTypes }];
  purchaseDate: string;
  dueDate: string;
  companyName: Operation;
  investedValue: number;
}

export async function POST(req: Request) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized", status: 401 });
    }

    const body: Payload = await req.json();
    const parse = outputFormSchema.safeParse(body);

    if (parse.error) {
      return NextResponse.json({
        message: "Erro ao tentar validar os campos enviados.",
        status: 400,
      });
    }

    const operation = await prisma.fixedIncomeOperations.create({
      data: {
        ...body,
        userId: user.id,
      },
    });

    return NextResponse.json({
      operation,
      message: "Operação cadastrada com sucesso.",
      status: 200,
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: (err as Error)?.message, status: 500 });
  }
}
