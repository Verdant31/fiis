"use server";
import { prisma } from "@/lib/prisma";
import { FiisOperation } from "@/types/fiis";
import _ from "lodash";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const fiisOperations = await prisma.fiisOperations.findMany({});
    const operations: FiisOperation[] = [];

    const groupedOperations = _.groupBy(fiisOperations, "fiiName");

    Object.keys(groupedOperations).forEach((fiiName) => {
      operations.push({
        fiiName: fiiName + ".SA",
        operations: groupedOperations[fiiName],
      });
    });

    return NextResponse.json({
      operations: operations ?? [],
      status: 200,
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: (err as Error)?.message, status: 500 });
  }
}
