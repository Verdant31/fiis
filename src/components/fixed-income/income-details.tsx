"use client";
import { CartesianGrid, Line } from "recharts";
import { format } from "date-fns";
import { BRL } from "@/utils/intlBr";
import { ptBR } from "date-fns/locale";
import { incomesToString } from "@/helpers/incomes-to-string";
import { currencyFormatter } from "@/utils/currency-formatter";
import { FixedIncomeWithEvolution } from "@/types/fixed-income";
import { CustomChart } from "@/components/chart";
import { StockDetailsCard } from "@/components/stock-details-card";
import { DataTable } from "@/components/table";
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  TableState,
  useReactTable,
} from "@tanstack/react-table";
import _ from "lodash";
import { incomeEvolutionColumns } from "@/app/dashboard/fixed-income/general/columns";
import { useMemo, useState } from "react";
import { useTablePagination } from "@/hooks/use-table-pagination.ts";
import DeleteOperationModal from "../delete-operation-modal";

interface Props {
  chartData: {
    date: Date;
  }[];
  chartViewMode: "percent" | "realValue";
  yAxisProps: {
    type: "number";
    domain: number[] | undefined;
    hide: boolean;
  };
  xAxisProps: {
    dataKey: string;
    tickMargin: number;
    tickFormatter: (value: number) => string;
  };
  selectedIncome: FixedIncomeWithEvolution;
  color: string;
}

export default function IncomeDetails({
  chartData,
  chartViewMode,
  xAxisProps,
  yAxisProps,
  selectedIncome,
  color,
}: Props) {
  const [operationsSorting, setOperationsSorting] = useState<SortingState>([]);

  const selectedIncomeChartLine =
    selectedIncome?.companyName.slice(0, 3).toUpperCase() +
    " - " +
    incomesToString(selectedIncome?.incomes ?? []);

  const tableWithPrevious = useMemo(
    () =>
      _.map(selectedIncome?.investmentEvolution, (item, index) => ({
        ...item,
        previousValue: _.get(
          selectedIncome?.investmentEvolution,
          `[${index - 1}].value`,
          0,
        ),
      })),
    [selectedIncome?.investmentEvolution],
  );

  const { pagination, setPagination } = useTablePagination({
    initialpageSize: 9,
    mobilePageSize: 7,
  });

  const table = useReactTable({
    data: tableWithPrevious,
    columns: incomeEvolutionColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setOperationsSorting,
    getSortedRowModel: getSortedRowModel(),
    onPaginationChange: setPagination,
    state: {
      sorting: operationsSorting,
      pagination,
    } as Partial<TableState>,
  });

  return (
    <div>
      <div>
        <h1 className="mt-4 text-xl font-semibold">Detalhes do fundo</h1>
        <div className="mt-4 grid grid-cols-3 gap-4 lg:grid-cols-4 xl:grid-cols-6">
          <StockDetailsCard
            color={color}
            label="Empresa"
            value={selectedIncome?.companyName}
          />
          <StockDetailsCard
            color={color}
            label="Investido"
            value={currencyFormatter(selectedIncome?.investedValue as number)}
          />
          <StockDetailsCard
            color={color}
            label="Atual"
            value={currencyFormatter(selectedIncome?.latestValue as number)}
          />
          <StockDetailsCard
            color={color}
            label="Rendimento"
            className="w-[100%]"
            value={incomesToString(selectedIncome?.incomes)}
          />
          <StockDetailsCard
            color={color}
            label="Vencimento"
            className="w-[100%]"
            value={format(new Date(selectedIncome.dueDate), "dd/MM/yyyy")}
          />
        </div>
      </div>
      <CustomChart
        chartType="line"
        className="mt-6"
        data={chartData}
        tooltip={{
          labelFormatter: (label) =>
            format(new Date(label), "PP", { locale: ptBR }),
          valueFormatter: (value) =>
            chartViewMode === "percent"
              ? `${(value as number).toFixed(2)}%`
              : BRL.format(parseFloat((value as number)?.toFixed(2))),
        }}
        xAxisProps={xAxisProps}
        yAxisProps={yAxisProps}
      >
        <CartesianGrid vertical={false} />
        <Line
          key={selectedIncomeChartLine}
          dataKey={selectedIncomeChartLine}
          name={selectedIncomeChartLine}
          type="monotone"
          stroke={color}
          strokeWidth={2}
          dot={false}
        />
      </CustomChart>
      <DataTable table={table} className="mt-6" />
      <DeleteOperationModal stockType="fixed" id={selectedIncome.id} />
    </div>
  );
}
