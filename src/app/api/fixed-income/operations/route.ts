"use server";
import { formatRawCdbData } from "@/helpers/format-raw-cdb-data";
import { formatRawInflationData } from "@/helpers/format-raw-inflation-data";
import { prisma } from "@/lib/prisma";
import { validateRequest } from "@/lib/validate-request";
import { datesAreSameMonthAndYear } from "@/utils/dates-are-same-month-and-year";
import { Income } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized", status: 401 });
    }
    const fiisOperations = await prisma.fixedIncomeOperations.findMany({
      where: { userId: user.id },
    });

    const oldestOperation = fiisOperations.reduce((oldest, current) =>
      new Date(current.purchaseDate) < new Date(oldest.purchaseDate)
        ? current
        : oldest,
    );

    const [inflation, cdb] = await Promise.all([
      fetch(process.env.INFLATION_API_URL as string).then((res) =>
        formatRawInflationData(res, oldestOperation),
      ),
      fetch(process.env.CDB_API_URL as string).then((res) =>
        formatRawCdbData(res, oldestOperation),
      ),
    ]);

    const withIncomes = fiisOperations.map((operation) => {
      const cdbIncomes = cdb.filter((income) =>
        datesAreSameMonthAndYear(income.date, new Date(operation.purchaseDate)),
      );
      const inflationIncomes = inflation.filter((income) =>
        datesAreSameMonthAndYear(income.date, new Date(operation.purchaseDate)),
      );
      const operationMainIncome = operation.incomes.find(
        (op) => op.type === "cdi" || op.type === "inflation",
      ) as Income;

      const incomes =
        operationMainIncome?.type === "cdi" ? cdbIncomes : inflationIncomes;

      const initialInvestment = {
        date: new Date(operation.purchaseDate),
        value: operation.investedValue,
      };

      const investmentEvolution = incomes.reduce(
        (evolution, income) => {
          const lastValue = evolution[evolution.length - 1].value;
          let updatedValue = 0;
          const hasFixedIndex = operation.incomes.find(
            (i) => i.type === "fixed",
          );

          if (operationMainIncome.type === "cdi" || !hasFixedIndex) {
            const monthlyYield =
              1 + (income.value / 100) * (operationMainIncome?.value / 100);

            updatedValue = lastValue * monthlyYield;
          } else {
            const fixedIndexMonthValue =
              Math.pow(1 + hasFixedIndex.value, 1 / 12) - 1;

            // console.log({
            //   "100% da Inflação:": income.value,
            //   "Taxa fixa mensal": fixedIndexMonthValue,
            //   "100% da inflação + taxa fixa: ":
            //     income.value + fixedIndexMonthValue,
            //   lastValue,
            // });

            const monthlyYield =
              ((income.value + fixedIndexMonthValue) * lastValue) / 100;

            updatedValue = lastValue + monthlyYield;
          }
          return [
            ...evolution,
            {
              date: new Date(income.date),
              value: updatedValue,
              percentEvolution:
                (100 * updatedValue) / operation.investedValue - 100,
            },
          ];
        },
        [initialInvestment],
      );

      return {
        ...operation,
        latestValue: investmentEvolution[investmentEvolution.length - 1].value,
        investmentEvolution,
      };
    });

    return NextResponse.json({
      operations: withIncomes ?? [],
      status: 200,
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: (err as Error)?.message, status: 500 });
  }
}
