import { RawInflationData } from "@/types/fixed-income";
import { datesAreSameMonthAndYear } from "@/utils/dates-are-same-month-and-year";
import { FixedIncomeOperations } from "@prisma/client";

export const formatRawInflationData = async (
  response: Response,
  oldestOperation: FixedIncomeOperations,
) => {
  const data = (await response.json()) as RawInflationData;
  const formattedData = data.value.map((item) => {
    return {
      date: new Date(item.VALDATA),
      value: item.VALVALOR,
    };
  });

  const filteredData = formattedData.filter((item) =>
    datesAreSameMonthAndYear(item.date, new Date(oldestOperation.purchaseDate)),
  );
  return filteredData;
};
