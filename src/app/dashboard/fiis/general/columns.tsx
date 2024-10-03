"use client";

import { DataTableColumnHeader } from "@/components/table";
import { Dividend, FiiSummary } from "@/types/fiis";
import { currencyFormatter } from "@/utils/currency-formatter";
import { FiisOperations } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export const fiisSummaryColumns: ColumnDef<FiiSummary>[] = [
  {
    accessorKey: "fiiName",
    header: "Nome",
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("fiiName")}</div>;
    },
  },
  {
    accessorKey: "quotes",
    header: "Cotas",
    cell: ({ row }) => {
      return <div className=" font-medium">{row.getValue("quotes")}</div>;
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Preço" />;
    },
    cell: ({ row }) => {
      const price = row.getValue("price") as number;
      const changedValue =
        100 - (row.original.valueAtFirstPurchase * 100) / price;
      return (
        <div className="font-medium flex flex-col sm:flex-row sm:gap-1">
          {currencyFormatter(row.getValue("price"))}
          {changedValue > 0 ? (
            <span className="font-semibold text-green-500">
              ({changedValue.toFixed(1)}%)
            </span>
          ) : (
            <span className="font-semibold text-[#ed2846]">
              ({changedValue.toFixed(1)}%)
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "variation",
    header: "Variação",
    cell: ({ row }) => {
      if (!row.original.high || !row.original.low) {
        return <p className="font-medium">N/A</p>;
      }

      return (
        <div className="font-medium flex flex-col md:block">
          {currencyFormatter(row.original.high - row.original.low)}
        </div>
      );
    },
  },
  {
    accessorKey: "totalInvested",
    header: "Total investido",
    cell: ({ row }) => {
      const total = row.original.operations.reduce((acc, op) => {
        if (op.type === "purchase") acc += op.quotationValue * op.qty;
        return acc;
      }, 0);

      return (
        <div className="font-medium flex flex-col md:block">
          {currencyFormatter(total)}
        </div>
      );
    },
  },
  {
    accessorKey: "currentTotal",
    header: "Total atual",
    cell: ({ row }) => {
      const total = row.original.operations.reduce((acc, op) => {
        if (op.type === "purchase") acc += op.quotationValue * op.qty;
        return acc;
      }, 0);

      const currentTotal = row.original.operations.reduce((acc, op) => {
        if (op.type === "purchase") acc += row.original.price * op.qty;
        return acc;
      }, 0);

      const variation = (currentTotal * 100) / total - 100;

      return (
        <div className="font-medium flex items-center gap-1">
          {currencyFormatter(currentTotal)}
          {variation > 0 ? (
            <span className="font-semibold text-green-500">
              ({variation.toFixed(1)}%)
            </span>
          ) : (
            <span className="font-semibold text-[#ed2846]">
              ({variation.toFixed(1)}%)
            </span>
          )}
        </div>
      );
    },
  },
];

export const fiisSummaryColumnsMobile: ColumnDef<FiiSummary>[] = [
  {
    accessorKey: "fiiName",
    header: "Nome",
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("fiiName")}</div>;
    },
  },
  {
    accessorKey: "totalInvested",
    header: "Total investido",
    cell: ({ row }) => {
      const total = row.original.operations.reduce((acc, op) => {
        if (op.type === "purchase") acc += op.quotationValue * op.qty;
        return acc;
      }, 0);

      return (
        <div className="font-medium flex flex-col md:block">
          {currencyFormatter(total)}
        </div>
      );
    },
  },
  {
    accessorKey: "currentTotal",
    header: "Total atual",
    cell: ({ row }) => {
      const total = row.original.operations.reduce((acc, op) => {
        if (op.type === "purchase") acc += op.quotationValue * op.qty;
        return acc;
      }, 0);

      const currentTotal = row.original.operations.reduce((acc, op) => {
        if (op.type === "purchase") acc += row.original.price * op.qty;
        return acc;
      }, 0);

      const variation = (currentTotal * 100) / total - 100;

      return (
        <div className="font-medium flex items-center gap-1">
          {currencyFormatter(currentTotal)}
          {variation > 0 ? (
            <span className="font-semibold text-green-500">
              ({variation.toFixed(1)}%)
            </span>
          ) : (
            <span className="font-semibold text-[#ed2846]">
              ({variation.toFixed(1)}%)
            </span>
          )}
        </div>
      );
    },
  },
];

export const operationsSummaryColumns: ColumnDef<FiisOperations>[] = [
  {
    accessorKey: "fiiName",
    header: "Nome",
    cell: ({ row }) => {
      return <div className=" font-medium">{row.getValue("fiiName")}</div>;
    },
  },
  {
    accessorKey: "qty",
    header: "Cotas",
    cell: ({ row }) => {
      return <div className=" font-medium">{row.getValue("qty")}</div>;
    },
  },
  {
    accessorKey: "quotationValue",
    header: "Preço",
    cell: ({ row }) => {
      return (
        <div className=" font-medium">
          {currencyFormatter(row.getValue("quotationValue"))}
        </div>
      );
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Data" />;
    },
    sortingFn: (a, b) => {
      const dateA = new Date(a.getValue("date"));
      const dateB = new Date(b.getValue("date"));

      if (dateA < dateB) {
        return -1;
      }
      if (dateA > dateB) {
        return 1;
      }
      return 0;
    },
    cell: ({ row }) => {
      return (
        <div className="font-medium">
          {format(new Date(row.getValue("date")), "dd/MM/yyyy")}
        </div>
      );
    },
  },
];

export const dividendsColumns: ColumnDef<Dividend>[] = [
  {
    accessorKey: "quotesAtPayment",
    header: "Cotas",
    cell: ({ row }) => {
      return (
        <div className=" font-medium">{row.getValue("quotesAtPayment")}</div>
      );
    },
  },
  {
    accessorKey: "paymentPerQuote",
    header: "Por cota",
    cell: ({ row }) => {
      return (
        <div className=" font-medium">
          {currencyFormatter(row.getValue("paymentPerQuote"))}
        </div>
      );
    },
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => {
      return (
        <div className=" font-medium">
          {currencyFormatter(row.getValue("total"))}
        </div>
      );
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Data" />;
    },
    sortingFn: (a, b) => {
      const dateA = new Date(a.getValue("date"));
      const dateB = new Date(b.getValue("date"));

      if (dateA < dateB) {
        return -1;
      }
      if (dateA > dateB) {
        return 1;
      }
      return 0;
    },
    cell: ({ row }) => {
      return (
        <div className="font-medium">
          {format(new Date(row.getValue("date")), "dd/MM/yyyy")}
        </div>
      );
    },
  },
];
