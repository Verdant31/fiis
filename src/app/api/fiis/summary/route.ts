"use server";
import { prisma } from "@/lib/prisma";
import _ from "lodash";
import { NextResponse } from "next/server";
import yahooFinance from "yahoo-finance2";
import { handleFiiMissingInfos } from "@/helpers/handle-fii-missing-info";
import { validateRequest } from "@/lib/validate-request";

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
      fiiName: fiiName + ".SA",
      fiiCnpj: fiisAsKeys[fiiName]?.[0]?.fiiCnpj,
      operations: fiisAsKeys[fiiName],
    }));

    const promises = fiis.map(async (fii) => {
      const summary = await yahooFinance.quote(fii.fiiName);
      const quotes = fii.operations.reduce((acc, operation) => {
        if (operation.type === "purchase" || operation.type === "unfolding") {
          acc += operation.qty;
        } else if (operation.type === "sale") {
          acc -= operation.qty;
        }
        return acc;
      }, 0);
      const operations = fii.operations.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
      const hasMissingInfo = !summary.dividendRate || !summary.priceToBook;

      return {
        fiiName: fii.fiiName.split(".SA")[0],
        quotes,
        monthlyYield: summary.dividendRate,
        annualYield: summary.dividendYield,
        price: summary.regularMarketPrice,
        pvp: summary.priceToBook?.toFixed(2),
        type: summary.quoteType,
        high: summary.regularMarketDayHigh,
        low: summary.regularMarketDayLow,
        operations,
        valueAtFirstPurchase: operations[operations.length - 1].quotationValue,
        ...(hasMissingInfo && {
          extraInfo: await handleFiiMissingInfos({
            ...fii,
            currentQuotePrice: summary.regularMarketPrice as number,
          }),
        }),
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
