import { IncomeEnum } from "@/types/fixed-income";
import { Income } from "@prisma/client";

export const incomesToString = (incomes: Income[]) => {
  return incomes
    .map((i) =>
      i.type === "inflation"
        ? IncomeEnum[i.type]
        : `${i.value}% ${i.type !== "fixed" ? IncomeEnum[i.type] : ""}`,
    )
    .join(" + ");
};
