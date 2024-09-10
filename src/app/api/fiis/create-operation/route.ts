"use server";
import { Operation } from "@prisma/client";
import { NextResponse } from "next/server";
import { outputFormSchema } from "../../../../lib/forms/create-fii-operation";
import yahooFinance from "yahoo-finance2";
import { validateRequest } from "@/lib/validate-request";

interface Payload {
  name: string;
  price: number;
  quotes: number;
  cnpj: string;
  operationType: Operation;
  date: string;
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
    let foundFii = await yahooFinance.quote(body.name);
    if (!foundFii) {
      if (body.name.includes(".SA")) {
        return NextResponse.json({
          message: "Fundo não encontrado na nossa base de dados.",
          status: 404,
        });
      }
      const fiiWithRegionOnName = await yahooFinance.quote(body.name + ".SA");
      if (fiiWithRegionOnName) {
        foundFii = fiiWithRegionOnName;
      } else {
        return NextResponse.json({
          message: "Fundo não encontrado na nossa base de dados.",
          status: 404,
        });
      }
    }
    const operation = await prisma?.fiisOperations.create({
      data: {
        date: body.date,
        fiiCnpj: body.cnpj,
        fiiName: body.name.split(".SA")[0],
        qty: body.quotes,
        type: body.operationType,
        quotationValue: body.price,
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
