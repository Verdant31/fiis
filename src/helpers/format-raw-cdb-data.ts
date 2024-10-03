import { RawCdbData } from "@/types/fixed-income";
import { datesAreSameMonthAndYear } from "@/utils/dates-are-same-month-and-year";
import { FixedIncomeOperations } from "@prisma/client";
import { parse } from "date-fns";

export const formatRawCdbData = async (
  response: Response,
  oldestOperation: FixedIncomeOperations,
) => {
  const data = (await response.json()) as RawCdbData;

  const formattedData = data.map((item) => {
    return {
      date: parse(item.data, "dd/MM/yyyy", new Date()),
      value: parseFloat(item.valor),
    };
  });

  const filteredData = formattedData.filter((item) =>
    datesAreSameMonthAndYear(item.date, new Date(oldestOperation.purchaseDate)),
  );
  return filteredData;
};
