"use server";
import { prisma } from "@/lib/prisma";
import { validateRequest } from "@/lib/validate-request";
import _ from "lodash";
import { NextResponse } from "next/server";
import yahooFinance from "yahoo-finance2";

export async function GET() {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized", status: 401 });
    }

    const fiisOperations = await prisma.fiisOperations.findMany({
      where: {
        userId: user.id,
      },
    });
    const fiis = _.uniqBy(fiisOperations, "fiiName").map(
      (purchase) => purchase.fiiName,
    );

    const now = new Date();
    const period1 = new Date(
      now.getFullYear() - 1,
      now.getMonth(),
      now.getDate(),
    );
    const period2 = now.toISOString().split("T")[0];
    const queryInterval = {
      period1: period1.toISOString().split("T")[0],
      period2,
    };

    const promises = fiis.map(async (fiiName) => ({
      history: await yahooFinance
        .historical(fiiName, queryInterval)
        .then((response) =>
          response.map((day) => ({
            date: day.date,
            close: day.close,
          })),
        ),
      fiiName,
    }));

    const results = await Promise.all(promises);
    return NextResponse.json({
      results: results ?? [],
      status: 200,
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: (err as Error)?.message, status: 500 });
  }
}
