import { FixedIncomeWithEvolution } from "@/types/fixed-income";
import { datesAreSameMonthAndYear } from "@/utils/dates-are-same-month-and-year";

interface Props {
  tableDataType: string;
  operations: FixedIncomeWithEvolution[];
  intervalValue: Date;
}

export const getFixedIncomeStatementData = ({
  intervalValue,
  operations,
  tableDataType,
}: Props) => {
  if (tableDataType === "operations") {
    const filteredOperations = operations.filter((operation) => {
      const d1 = new Date(operation.purchaseDate);
      const d2 = intervalValue;
      return (
        d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear()
      );
    });

    return filteredOperations;
  } else {
    const filteredOperations = operations.filter((operation) =>
      operation.investmentEvolution.find((ev) =>
        datesAreSameMonthAndYear(new Date(ev.date), intervalValue as Date),
      ),
    );

    const tableData = filteredOperations.map((operation) => {
      const lastIncomeIndex = operation.investmentEvolution.findIndex((ev) =>
        datesAreSameMonthAndYear(new Date(ev.date), intervalValue as Date),
      );

      const filteredEvolution = operation.investmentEvolution.filter((ev) =>
        datesAreSameMonthAndYear(new Date(ev.date), intervalValue as Date),
      );

      if (lastIncomeIndex === 0 || lastIncomeIndex === -1)
        return {
          ...operation,
          investedValue: undefined,
        };

      const value =
        operation.investmentEvolution[lastIncomeIndex].value -
        operation.investmentEvolution[lastIncomeIndex - 1].value;

      return {
        ...operation,
        purchaseDate: intervalValue,
        investmentEvolution: filteredEvolution,
        investedValue: value,
      };
    });

    const filteredTableData = tableData.filter((op) =>
      Boolean(op.investedValue),
    );
    return filteredTableData;
  }
};
