"use client";

import { currencyFormatter } from "@/utils/currency-formatter";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export type IncomeTableData = {
  date: Date;
  percentEvolution: number;
  value: number;
  previousValue: number;
};

export const incomeEvolutionColumns: ColumnDef<IncomeTableData>[] = [
  {
    accessorKey: "date",
    header: "Nome",
    cell: ({ row }) => {
      return (
        <div className="font-medium">
          {format(new Date(row.getValue("date")), "MM/yyyy")}
        </div>
      );
    },
  },
  {
    accessorKey: "value",
    header: "Valor",
    cell: ({ row }) => {
      const diff = row.original.value - row.original.previousValue;
      return (
        <div className=" font-medium">
          {currencyFormatter(row.getValue("value"))}
          {row.index > 0 && (
            <span className="text-muted-foreground ml-2">
              +{diff.toFixed(2)}
            </span>
          )}
        </div>
      );
    },
  },
];
