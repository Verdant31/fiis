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
    initialpageSize: 6,
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
      <div className="mt-6 mb-2 rounded-md">
        <p className="text-2xl font-semibold">Rendimentos</p>
        <p className="mt-1 text-sm text-muted-foreground lg:text-base">
          Aqui você pode verificar o rendimento do título em formato de gráfico
          ou em formato de lista, indicando o rendimento de cada mês.
        </p>
      </div>
      <div className="xl:flex xl:w-full xl:gap-12 ">
        <div className="mt-4 max-h-[400px] lg:max-h-[500px] basis-[50%] grow-0">
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
        </div>
        <div className="xl:basis-[50%] mt-4">
          <DataTable table={table} className="mt-6" />
        </div>
      </div>
      <DeleteOperationModal stockType="fixed" id={selectedIncome.id} />
    </div>
  );
}
