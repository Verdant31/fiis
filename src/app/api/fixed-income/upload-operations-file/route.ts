/* eslint-disable @typescript-eslint/no-explicit-any */
import { outputFormSchema } from "@/lib/forms/create-fixed-income-operation";
import { NextResponse } from "next/server";
import { FormOutputData } from "../../../../lib/forms/create-fixed-income-operation";
import { uniqBy } from "lodash";
import { validateRequest } from "@/lib/validate-request";
import { prisma } from "@/lib/prisma";
import { Income } from "@prisma/client";
import { parse } from "date-fns";

const columns = [
  "data_compra",
  "vencimento",
  "nome_empresa",
  "valor_investido",
  "rendimentos",
];

enum IncomeEnum {
  CDI = "cdi",
  IPCA = "inflation",
  FIXO = "fixed",
}

export async function POST(req: Request) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized", status: 401 });
    }

    const body = await req.json();
    const results: string[][] = body.parsingResults;

    const rawOperations = results.slice(1).map((row) => {
      const operation: Record<string, string> = {};
      row.forEach((value, index) => {
        operation[columns[index]] = value.trim();
      });
      return operation;
    });

    const operations = rawOperations.map((op) => {
      const incomes = op?.rendimentos.split(";").map((income) => {
        const [type, value] = income.trim().split(" ");
        console.log(type, value);
        return {
          type: IncomeEnum[type as keyof typeof IncomeEnum],
          value: Number(value.split("%")[0]),
        };
      }) as Income[];
      return {
        companyName: op?.nome_empresa,
        dueDate: parse(op?.vencimento, "dd/MM/yyyy", new Date()).toString(),
        incomes,
        investedValue: parseFloat(op?.valor_investido),
        purchaseDate: parse(
          op?.data_compra,
          "dd/MM/yyyy",
          new Date(),
        ).toString(),
        userId: user.id,
      };
    }) as FormOutputData[];

    const parses = await Promise.all(
      operations.map((op) => outputFormSchema.safeParse(op)),
    );

    const hasError = parses.some((parse) => !parse.success);
    if (hasError) {
      const objectErrors = parses
        .filter((parse) => !parse.success)
        .map((parse) => parse?.error?.formErrors?.fieldErrors);
      const errors = objectErrors.map((obj) => Object.values(obj ?? {})).flat();
      const withoutDuplicates = uniqBy(errors, JSON.stringify).flat();
      return NextResponse.json({ status: 422, error: withoutDuplicates });
    }

    const createdOperations = await prisma.fixedIncomeOperations.createMany({
      data: operations.map((operation) => ({
        ...operation,
        userId: user.id,
      })),
    });

    return NextResponse.json({
      status: 200,
      message: "Operações cadastradas com sucesso",
      operations: createdOperations,
    });
  } catch (e: any) {
    console.log(e.message);
    return NextResponse.json({
      status: 500,
      error: "Erro interno, contate um dos administradores.",
    });
  }
}
