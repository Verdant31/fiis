import { OperationText } from "@/components/operation-type-card";
import { Dividend } from "@/types/fiis";
import { currencyFormatter } from "@/utils/currency-formatter";
import { FiisOperations } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowDownCircle, ArrowUpCircle, Info } from "lucide-react";

export const dividendsStatementColumns: ColumnDef<Dividend>[] = [
  {
    accessorKey: "fiiName",
    header: "Fundo",
    cell: ({ row }) => {
      return <div className=" font-medium">{row.getValue("fiiName")}</div>;
    },
  },
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
    header: "P/ cota",
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
    header: "Data",
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
          {format(new Date(row.getValue("date")), "dd/MM/yy")}
        </div>
      );
    },
  },
];

export const operationsStatementColumns: ColumnDef<FiisOperations>[] = [
  {
    accessorKey: "fiiName",
    header: "Fundo",
    cell: ({ row }) => {
      return <div className=" font-medium">{row.getValue("fiiName")}</div>;
    },
  },
  {
    accessorKey: "date",
    header: "Data",
    cell: ({ row }) => {
      return (
        <div className=" font-medium text-[14px]">
          {format(new Date(row.getValue("date")), "dd/MM/yy")}
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Tipo",
    cell: ({ row }) => {
      const type = row.getValue("type") as keyof typeof OperationText;
      const color =
        type === "sale"
          ? "text-[#ed2846]"
          : type === "purchase"
            ? "text-green-500"
            : "text-blue-500";

      const Icon = () =>
        type === "sale" ? (
          <ArrowDownCircle size={18} />
        ) : type === "purchase" ? (
          <ArrowUpCircle size={18} />
        ) : (
          <Info size={18} />
        );

      return (
        <div>
          <div className={`hidden mini:flex items-center gap-2 ${color}`}>
            <Icon />
            <span className="w-[65px] truncate font-medium break-words">
              {OperationText[type]}
            </span>
          </div>
          <div className={`flex mini:hidden items-center gap-2 ${color}`}>
            <Icon />
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "qty",
    header: "Cotas",
    cell: ({ row }) => {
      const quotes = parseInt(row.getValue("qty"));
      return <div className=" font-medium">{quotes > 0 ? quotes : "N/A"}</div>;
    },
  },
];
