import { incomesToString } from "@/helpers/incomes-to-string";
import { FixedIncomeWithEvolution } from "@/types/fixed-income";
import { currencyFormatter } from "@/utils/currency-formatter";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export const operationsStatementColumns: ColumnDef<FixedIncomeWithEvolution>[] =
  [
    {
      accessorKey: "companyName",
      header: "Empresa",
      cell: ({ row }) => {
        return (
          <div className=" font-medium">
            {row.getValue("companyName") +
              " " +
              incomesToString(row.original.incomes)}
          </div>
        );
      },
    },
    {
      accessorKey: "date",
      header: "Data",
      cell: ({ row }) => {
        return (
          <div className=" font-medium text-[14px]">
            {format(new Date(row.original.purchaseDate), "dd/MM/yy")}
          </div>
        );
      },
    },
    {
      accessorKey: "investedValue",
      header: "Valor",
      cell: ({ row }) => {
        return (
          <div className=" font-medium">
            {currencyFormatter(row.getValue("investedValue"))}
          </div>
        );
      },
    },
  ];
