/* eslint-disable react-hooks/exhaustive-deps */
import { FiisController } from "@/controllers/fii";
import { useFiisPriceHistory } from "@/queries/use-fiis-price-history";
import { Dividend, FiiSummary } from "@/types/fiis";
import { currencyFormatter } from "@/utils/currency-formatter";
import React, { useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Bar,
  BarChart,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { format, parse } from "date-fns";
import { Skeleton as ShadSkeleton } from "../ui/skeleton";

import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";
import { DataTable } from "../table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUniqueFiiDividends } from "@/queries/use-unique-fii-dividends";
import CalendarArrowDown from "../icons/calendar-arrow-down";
import { FiisOperations } from "@prisma/client";
import {
  operationsSummaryColumns,
  dividendsColumns,
} from "@/app/dashboard/fiis/general/columns";
import DeleteOperationModal from "../delete-operation-modal";

interface Props {
  fii: FiiSummary;
  fiisLength: number;
  windowWidth: number;
  operations: FiisOperations[];
}

export function FiiDetails({
  fii,
  fiisLength,
  windowWidth,
  operations,
}: Props) {
  const [dividendsSorting, setDividendsSorting] = useState<SortingState>([]);
  const [operationsSorting, setOperationsSorting] = useState<SortingState>([]);

  const [tab, setTab] = useState("price");

  const { data: priceHistory, isLoading: isLoadingHistory } =
    useFiisPriceHistory();
  const { data: fiiDividends, isLoading: isLoadingDividends } =
    useUniqueFiiDividends({ operations, key: fii.fiiName });

  const fiisController = new FiisController({ history: priceHistory ?? [] });

  const { chartData, yAxisDomain } = fiisController.formatHistoryToChartData(
    fii.fiiName,
  );

  const randomChartColorIndex = useMemo(
    () => Math.floor(Math.random() * fiisLength + 1),
    [fii],
  );

  const operationsTable = useReactTable({
    data: fii.operations,
    columns: operationsSummaryColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setOperationsSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting: operationsSorting,
    },
    initialState: {
      pagination: {
        pageSize: windowWidth > 1024 ? 6 : 11,
      },
    },
  });

  const dividendsTable = useReactTable({
    data: fiiDividends?.dividends as Dividend[],
    columns: dividendsColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setDividendsSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting: dividendsSorting,
    },
    initialState: {
      pagination: {
        pageSize: windowWidth > 1024 ? 6 : 11,
      },
    },
  });

  const fiiColor = `hsl(var(--chart-${randomChartColorIndex}))`;
  const isLoading = isLoadingHistory || isLoadingDividends;

  return (
    <div>
      <div>
        <h1 className="mt-4 text-xl font-semibold">Detalhes do fundo</h1>
        <div className="mt-4 grid grid-cols-3 gap-4 lg:grid-cols-4 xl:grid-cols-6">
          <div className="space-y-2 w-[85%]">
            <p
              style={{ backgroundColor: fiiColor }}
              className="py-1 pl-2  font-medium rounded-[2px] "
            >
              Preço
            </p>
            <p>{currencyFormatter(fii.price)}</p>
          </div>
          <div className="space-y-2 w-[85%] ">
            <p
              style={{ backgroundColor: fiiColor }}
              className="py-1 pl-2  font-medium rounded-[2px] "
            >
              Cotas
            </p>
            <p>{fii.quotes}</p>
          </div>
          <div className="space-y-2 w-[85%] ">
            <p
              style={{ backgroundColor: fiiColor }}
              className="py-1 pl-2  font-medium rounded-[2px] "
            >
              P/VP
            </p>
            <p>{fii?.pvp ? fii?.pvp : !fii?.extraInfo?.pvp ? "N/A" : null}</p>
            {!fii?.pvp && fii.extraInfo?.pvp && (
              <div className="flex gap-2 items-center">
                <CalendarArrowDown />
                <p className="pt-[2px]">{fii?.extraInfo?.pvp?.toFixed(2)}</p>
              </div>
            )}
          </div>
          <div className="space-y-2 w-[85%] ">
            <p
              style={{ backgroundColor: fiiColor }}
              className="py-1 pl-2  font-medium rounded-[2px] "
            >
              High/Low
            </p>
            {fii?.high && fii?.low ? (
              <p>
                {currencyFormatter(fii.low)} / {currencyFormatter(fii.high)}
              </p>
            ) : (
              <p>N/A</p>
            )}
          </div>
          <div className="space-y-2 w-[85%] ">
            <p
              style={{ backgroundColor: fiiColor }}
              className="py-1 pl-2  font-medium rounded-[2px] "
            >
              Yield M.
            </p>
            <p>
              {fii?.annualYield
                ? fii?.annualYield.toFixed(2) + "%"
                : !fii?.extraInfo?.annualYield
                  ? "N/A"
                  : null}
            </p>
            {!fii?.annualYield && fii.extraInfo?.annualYield && (
              <div className="flex gap-2 items-center">
                <CalendarArrowDown />
                <p className="pt-[2px]">
                  {(fii?.extraInfo?.annualYield).toFixed(2)}%
                </p>
              </div>
            )}
          </div>
          <div className="space-y-2 w-[85%] ">
            <p
              style={{ backgroundColor: fiiColor }}
              className="py-1 pl-2  font-medium rounded-[2px] "
            >
              Total Inv.
            </p>
            <p>
              {currencyFormatter(
                fii.operations.reduce((acc, op) => {
                  if (op.type === "purchase") acc += op.qty * op.quotationValue;
                  return acc;
                }, 0),
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <CalendarArrowDown
            size={22}
            className="mt-[1px] text-muted-foreground"
          />
          <span className="text-muted-foreground text-sm">
            Indica que o dado contém um atraso.
          </span>
        </div>
      </div>
      <div>
        <h1 className="mt-4 text-xl font-semibold">Gráficos</h1>
        <div className="xl:flex xl:w-full xl:gap-12 ">
          {!priceHistory || isLoading ? (
            <ShadSkeleton className="w-full h-[300px] lg:basis-[50%] lg:h-[400px] mt-4" />
          ) : (
            <div className="mt-4 max-h-[400px] lg:max-h-[500px] basis-[50%] grow-0">
              <Tabs
                value={tab}
                onValueChange={(value: string) => {
                  setTab(value);
                }}
                defaultValue="price"
              >
                <TabsList className="lg:mb-8 grid grid-cols-2 w-[250px] lg:w-[400px] mb-4">
                  <TabsTrigger value="price">Preço</TabsTrigger>
                  <TabsTrigger value="dividends">Dividendos</TabsTrigger>
                </TabsList>
                <TabsContent value="price">
                  <ChartContainer
                    className="w-full h-full max-h-[330px] lg:max-h-[400px]"
                    config={{} satisfies ChartConfig}
                  >
                    <LineChart accessibilityLayer data={chartData} margin={{}}>
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="date"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        minTickGap={32}
                        tickFormatter={(value) => {
                          const date = parse(value, "dd/MM/yyyy", new Date());
                          return date.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          });
                        }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        type="number"
                        domain={yAxisDomain}
                        hide
                      />
                      <ChartTooltip
                        content={
                          <ChartTooltipContent
                            itemValueFormatter={(item) =>
                              currencyFormatter(item.value as number)
                            }
                          />
                        }
                      />
                      <Line
                        key={fii.fiiName}
                        dataKey={fii.fiiName}
                        name={fii.fiiName}
                        type="monotone"
                        stroke={fiiColor}
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ChartContainer>
                </TabsContent>
                <TabsContent value="dividends">
                  <ChartContainer config={{}}>
                    <BarChart
                      accessibilityLayer
                      data={fiiDividends?.dividendsAsChartData?.filter(
                        (payment) => payment.dividend > 0,
                      )}
                    >
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="month"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tickFormatter={(value) => {
                          const date = parse(value, "MM/yyyy", new Date());
                          return format(date, "MM/yy");
                        }}
                      />
                      <ChartTooltip
                        cursor={false}
                        label="Dividendo"
                        content={
                          <ChartTooltipContent
                            itemValueFormatter={(item) =>
                              currencyFormatter(item.value as number)
                            }
                            hideLabel
                          />
                        }
                      />
                      <Bar
                        name="Dividendo"
                        dataKey="dividend"
                        fill={fiiColor}
                        radius={8}
                      />
                    </BarChart>
                  </ChartContainer>
                </TabsContent>
              </Tabs>
            </div>
          )}
          <div className="xl:basis-[50%] mt-4">
            <Tabs defaultValue="operations">
              <TabsList className="lg:mb-8 grid grid-cols-2 w-[250px] lg:w-[400px] mb-4">
                <TabsTrigger value="operations">Operações</TabsTrigger>
                <TabsTrigger value="dividends">Dividendos</TabsTrigger>
              </TabsList>
              <TabsContent value="operations">
                <DataTable
                  className={`h-[${170 + fii.operations.length * 52}px] xl:min-h-[360px] xl:w-full xl:basis-[50%] mt-6`}
                  table={operationsTable}
                />
              </TabsContent>
              <TabsContent value="dividends">
                <DataTable
                  className={`h-[${170 + fii.operations.length * 52}px] xl:min-h-[360px] xl:w-full xl:basis-[50%] mt-6`}
                  table={dividendsTable}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      <DeleteOperationModal stockType="fii" id={fii.fiiName} />
    </div>
  );
}
