"use server";
import { prisma } from "@/lib/prisma";
import { FiisOperations } from "@prisma/client";
import _ from "lodash";
import { NextResponse } from "next/server";
import yahooFinance from "yahoo-finance2";
import { format, addHours } from "date-fns";
import { handleUnfoldings } from "@/helpers/handle-unfoldings";
import { validateRequest } from "@/lib/validate-request";

type FiiDividendObject = {
  date: Date;
  paymentPerQuote: number;
  quotesAtPayment: number;
  total: number;
  fiiName: string;
};

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
    const fiisAsKeys = _.groupBy(fiisOperations, "fiiName");

    const fiis = Object.keys(fiisAsKeys).map((fiiName) => ({
      fiiName,
      operations: fiisAsKeys[fiiName],
    }));

    const calculateMonthlyDividends = (
      fiiOperations: FiisOperations[],
      dividends: {
        date: Date;
        dividends: number;
      }[],
    ) => {
      const monthlyDividends: Record<string, FiiDividendObject> = {};
      for (const dividend of dividends) {
        const { quotesOwnedAtPayment, dividendsReceived } = handleUnfoldings({
          fiiOperations,
          dividends,
          dividend,
        });

        const monthKey = format(addHours(dividend.date, 3), "MM/yyyy");
        if (!monthlyDividends[monthKey]) {
          monthlyDividends[monthKey] = {
            date: addHours(dividend.date, 3),
            paymentPerQuote: dividend.dividends,
            quotesAtPayment: quotesOwnedAtPayment,
            total: dividendsReceived,
            fiiName: fiiOperations[0].fiiName,
          };
        }
        monthlyDividends[monthKey].total = dividendsReceived;
      }

      return monthlyDividends;
    };

    const promises = fiis.map(async (fii) => {
      const dividends = await yahooFinance.historical(fii.fiiName, {
        period1: "2023-01-01",
        period2: new Date(),
        events: "dividends",
      });

      return {
        fiiName: fii.fiiName,
        quotes: fii.operations.reduce((acc, op) => {
          if (op.type === "purchase") acc += op.qty;
          else if (op.type === "sale") acc -= op.qty;
          return acc;
        }, 0),
        monthlyDividends: calculateMonthlyDividends(fii.operations, dividends),
      };
    });

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
