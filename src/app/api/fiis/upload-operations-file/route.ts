/* eslint-disable @typescript-eslint/no-explicit-any */
import { outputFormSchema } from "@/lib/forms/create-fii-operation";
import { parse } from "date-fns";
import { NextResponse } from "next/server";
import { FormOutputData } from "../../../../lib/forms/create-fii-operation";
import { uniqBy } from "lodash";
import { validateRequest } from "@/lib/validate-request";
import { prisma } from "@/lib/prisma";

const columns = [
  "data_compra",
  "preco_cota",
  "quantidade",
  "cnpj_fundo",
  "nome_fundo",
  "tipo_operacao",
  "proporcao_desdobramento",
];

enum OperationTypeColumn {
  "Compra" = "purchase",
  "Venda" = "sale",
  "Desdobramento" = "unfolding",
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

    const operations = rawOperations.map((op) => ({
      name: op.nome_fundo,
      cnpj: op.cnpj_fundo,
      date: parse(op.data_compra, "dd/MM/yyyy", new Date()).toDateString(),
      operationType:
        OperationTypeColumn?.[
          op.tipo_operacao.trim() as keyof typeof OperationTypeColumn
        ],
      quotes: parseInt(op.quantidade),
      price: parseFloat(op.preco_cota),
      ...(op.tipo_operacao === "Desdobramento" && {
        unfoldingProportion: parseInt(op.proporcao_desdobramento),
      }),
    })) as FormOutputData[];

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

    const createdOperations = await prisma.fiisOperations.createMany({
      data: operations.map((op) => {
        const { cnpj, name, operationType, quotes, price, ...rest } = op;
        return {
          ...rest,
          qty: quotes as number,
          type: operationType,
          fiiCnpj: cnpj,
          fiiName: name,
          quotationValue: price,
          userId: user.id,
        };
      }),
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
