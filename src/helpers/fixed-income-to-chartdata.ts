import { FixedIncomeWithEvolution } from "@/types/fixed-income";
import _ from "lodash";
import { incomesToString } from "./incomes-to-string";

export const fixedIncomeToChartData = (
  data: FixedIncomeWithEvolution[],
  chartViewMode: "realValue" | "percent",
) => {
  //   const mostRecentIncome = _.minBy(
  //     data,
  //     (investment) => investment.investmentEvolution.length,
  //   );

  //   const chartData = mostRecentIncome?.investmentEvolution.map(
  //     (monthlyYield) => {
  //       return {
  //         date: monthlyYield.date,
  //         ...data.reduce((acc, curr) => {
  //           return {
  //             ...acc,
  //             [curr.companyName]: curr.investmentEvolution.find((i) => {
  //               return i.date === monthlyYield.date;
  //             })?.value,
  //           };
  //         }, {}),
  //       };
  //     },
  //   );

  const mostRecentIncome = _.maxBy(
    data,
    (investment) => investment.investmentEvolution.length,
  );

  let biggestValue = 0;
  const chartData =
    mostRecentIncome?.investmentEvolution.map((monthlyYield) => {
      return {
        date: monthlyYield.date,
        ...data.reduce((acc, curr) => {
          const keyAccess =
            chartViewMode === "realValue" ? "value" : "percentEvolution";

          const fixedIncomeYield = incomesToString(curr.incomes);

          const key =
            curr.companyName.slice(0, 3).toUpperCase() +
            " - " +
            fixedIncomeYield;

          const value = curr.investmentEvolution.find(
            (i) => i.date === monthlyYield.date,
          )?.[keyAccess];

          if (value && value > biggestValue) biggestValue = value;

          return {
            ...acc,
            [key]: value,
          };
        }, {}),
      };
    }) ?? [];

  const lines = Object.keys(chartData[0]).filter((k) => k !== "date");

  return { chartData, lines, biggestValue };
};
