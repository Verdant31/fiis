/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { useFixedIncomeOperations } from "@/queries/use-fixed-income-operations";
import { CartesianGrid, Line } from "recharts";
import { format } from "date-fns";
import { fixedIncomeToChartData } from "@/helpers/fixed-income-to-chartdata";
import { BRL } from "@/utils/intlBr";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ptBR } from "date-fns/locale";
import { incomesToString } from "@/helpers/incomes-to-string";
import { currencyFormatter } from "@/utils/currency-formatter";
import { Button } from "@/components/ui/button";
import { FixedIncomeWithEvolution } from "@/types/fixed-income";
import { useTablePagination } from "@/hooks/use-table-pagination.ts";
import { CustomChart } from "@/components/chart";
import IncomeDetails from "@/components/fixed-income/income-details";
import { FixedIncomeSkeleton } from "@/components/skeletons/fixed-income-skeleton";

type ChartViewMode = "realValue" | "percent";
enum ViewModeEnum {
  "Valor real" = "realValue",
  "Percentual" = "percent",
}

export default function FixedIncomes() {
  const [tab, setTab] = useState("general");
  const [selectedIncome, setSelectedIncome] =
    useState<FixedIncomeWithEvolution>();
  const [chartViewMode, setChartViewMode] = useState<ChartViewMode>("percent");

  const { data, isLoading } = useFixedIncomeOperations();

  const {
    handleNextPage,
    handlePreviousPage,
    partialData,
    pagination: { pageIndex },
  } = useTablePagination({
    data,
    initialpageSize: 4,
  });

  useEffect(() => {
    const income = data?.find((income) => income.id === selectedIncome?.id);
    if (!income) {
      setTab("general");
      setSelectedIncome(undefined);
    }
  }, [data]);

  if (isLoading || !data) return <FixedIncomeSkeleton />;

  const { chartData, lines, biggestValue } = fixedIncomeToChartData(
    data,
    chartViewMode,
  );

  const yAxisProps = {
    type: "number" as const,
    domain: chartViewMode === "percent" ? [-10, biggestValue + 10] : undefined,
    hide: true,
  };

  const xAxisProps = {
    dataKey: "date",
    tickMargin: 8,
    tickFormatter: (value: number) =>
      new Date(value).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
  };

  return (
    <main className="w-[90%] mx-auto mt-6 overflow-hidden lg:w-[calc(100%-48px)] lg:max-w-[1400px] pb-12">
      <div className="flex items-center gap-2 lg:text-lg">
        <h1
          className={`cursor-pointer ${tab === "details" && "text-muted-foreground "}`}
          onClick={() => setTab("general")}
        >
          Renda fixa
        </h1>
        {tab === "details" && (
          <div className="flex items-center gap-2">
            <ChevronRight className="shrink-0" size={24} />
            {selectedIncome?.companyName}
          </div>
        )}
      </div>
      <Tabs
        value={tab}
        onValueChange={(value: string) => setTab(value)}
        defaultValue="general"
      >
        <TabsContent value="general" className="mt-4">
          <div className="bg-zinc-900 p-5 rounded-md">
            <p className="text-xl font-semibold">Seus titulos</p>
            <p className="mt-2 text-sm">
              Para verificar detalhes dos seus títulos basta clicar no
              respectivo card do titulo.
            </p>
          </div>
          <div>
            <div className="flex items-end justify-between mt-6 lg:max-w-[784px] lg:gap-8">
              <div>
                <h1 className="font-semibold text-lg lg:text-xl">
                  Evolução dos titulos
                </h1>
                <p className="text-muted-foreground w-[85%] text-sm lg:text-base lg:w-full">
                  Gráfico contendo a evolução dos seus titulos de renda fixa
                  cadastrados{" "}
                </p>
              </div>
              <Select
                value={chartViewMode}
                onValueChange={(value) =>
                  setChartViewMode(value as ChartViewMode)
                }
              >
                <SelectTrigger
                  className="w-[250px] rounded-lg sm:ml-auto focus:ring-0 focus:ring-offset-0"
                  aria-label="Select a value"
                >
                  <SelectValue placeholder="Valor real" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {["Valor real", "Percentual"].map((option) => (
                    <SelectItem
                      key={option}
                      value={ViewModeEnum[option as keyof typeof ViewModeEnum]}
                      className="rounded-lg"
                    >
                      {option.split(".SA")[0]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="lg:flex lg:gap-16 lg:mt-2 lg:items-center">
              <CustomChart
                chartType="line"
                className="mt-6 lg:basis-[60%] lg:mt-0"
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
                {lines?.map((line, index) => (
                  <Line
                    key={line}
                    dataKey={line}
                    name={line}
                    type="monotone"
                    stroke={`hsl(var(--chart-${index + 1}))`}
                    strokeWidth={2}
                    dot={false}
                  />
                ))}
              </CustomChart>
              <div className="lg:basis-[40%] lg:h-[480px]">
                <div className="space-y-4 mt-2">
                  {partialData.map((fixedIncome, index) => (
                    <div
                      className="border-[1px] p-4 rounded-md "
                      key={fixedIncome.id}
                      onClick={() => {
                        setSelectedIncome(fixedIncome);
                        setTab("details");
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <p>
                          <span className="font-semibold">Empresa</span>:{" "}
                          {fixedIncome.companyName}
                        </p>

                        <p>
                          {currencyFormatter(
                            fixedIncome.investmentEvolution.at(-1)?.value ?? 0,
                          )}
                        </p>
                      </div>
                      <div className="flex justify-between mt-1">
                        <p className="text-sm">
                          <span className="font-semibold">Vencimento</span>:{" "}
                          {format(new Date(fixedIncome.dueDate), "dd/MM/yyyy")}
                        </p>
                        <p
                          style={{
                            backgroundColor: `hsl(var(--chart-${index + 1}))`,
                          }}
                          className="px-3 text-sm font-semibold rounded-xl text-center py-[1px]"
                        >
                          {incomesToString(fixedIncome.incomes)}
                        </p>
                      </div>
                      {new Date(fixedIncome.dueDate) < new Date() && (
                        <p className="px-3 mt-2 bg-red-600 text-sm  w-24 font-semibold rounded-xl text-center py-[1px]">
                          Vencido
                        </p>
                      )}
                    </div>
                  ))}
                </div>
                <div className="lg:pt-4 flex items-center justify-between">
                  <p className="pl-1">
                    Pagina {pageIndex + 1} de {Math.ceil(data.length / 4)}
                  </p>
                  <div className="my-4 flex items-center justify-end gap-4">
                    <Button
                      variant="outline"
                      className="w-28"
                      onClick={handlePreviousPage}
                      disabled={pageIndex === 0}
                    >
                      Anterior
                    </Button>
                    <Button
                      variant="outline"
                      className="w-32"
                      onClick={handleNextPage}
                      disabled={pageIndex === Math.ceil(data.length / 4) - 1}
                    >
                      Próxima
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="details">
          {selectedIncome && (
            <IncomeDetails
              selectedIncome={selectedIncome}
              chartViewMode={chartViewMode}
              yAxisProps={yAxisProps}
              xAxisProps={xAxisProps}
              chartData={chartData}
              color={`hsl(var(--chart-${partialData.indexOf(selectedIncome) + 1}))`}
            />
          )}
        </TabsContent>
      </Tabs>
    </main>
  );
}
