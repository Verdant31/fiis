"use server";
import { FiisOperations } from "@prisma/client";
import { NextResponse } from "next/server";
import { validateRequest } from "@/lib/validate-request";
import { Dividend } from "@/types/fiis";
import { StatementsFilterState } from "@/contexts/StatementsFilters";

interface Payload {
  data: Dividend[] | FiisOperations[];
  sendToEmail: boolean;
  filters: StatementsFilterState;
}

export async function POST(req: Request) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized", status: 401 });
    }

    const body: Payload = await req.json();
    console.log(body);
    return NextResponse.json({
      message: "Operação cadastrada com sucesso.",
      status: 200,
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: (err as Error)?.message, status: 500 });
  }
}
