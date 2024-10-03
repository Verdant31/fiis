"use client";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { useFixedIncomeOperations } from "@/queries/use-fixed-income-operations";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
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

type ChartViewMode = "realValue" | "percent";
enum ViewModeEnum {
  "Valor real" = "realValue",
  "Percentual" = "percent",
}

export default function Fiis() {
  const [tab, setTab] = useState("general");
  const [selectedIncome, setSelectedIncome] =
    useState<FixedIncomeWithEvolution>();
  const [chartViewMode, setChartViewMode] = useState<ChartViewMode>("percent");

  const { data } = useFixedIncomeOperations();

  const {
    handleNextPage,
    handlePreviousPage,
    partialData,
    pagination: { pageIndex },
  } = useTablePagination({
    data,
    initialpageSize: 8,
  });

  if (!data) return <h1>sem dados</h1>;

  const { chartData, lines, biggestValue } = fixedIncomeToChartData(
    data,
    chartViewMode,
  );

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
            <div className="flex items-end justify-between mt-6">
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
            <ChartContainer className="mt-6" config={{} satisfies ChartConfig}>
              <LineChart accessibilityLayer data={chartData} margin={{}}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  type="number"
                  domain={
                    chartViewMode === "percent"
                      ? [-10, biggestValue + 10]
                      : undefined
                  }
                  hide
                  tickFormatter={() => ``}
                />
                <ChartTooltip
                  labelFormatter={(label) => {
                    return format(new Date(label), "PP", { locale: ptBR });
                  }}
                  content={
                    <ChartTooltipContent
                      itemValueFormatter={(item) =>
                        chartViewMode === "percent"
                          ? `${(item.value as number).toFixed(2)}%`
                          : BRL.format(
                              parseFloat((item.value as number)?.toFixed(2)),
                            )
                      }
                    />
                  }
                />
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
              </LineChart>
            </ChartContainer>
            <div className="space-y-4 mt-4">
              {partialData.map((fixedIncome, index) => (
                <div
                  className="border-[1px] p-4 rounded-md space-y-1"
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
                  <div className="flex justify-between">
                    <p>
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
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <p className="pl-1">
                Pagina {pageIndex + 1} de {Math.ceil(data.length / 7)}
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
                  disabled={pageIndex === Math.ceil(data.length / 7) - 1}
                >
                  Próxima
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="details">
          {JSON.stringify(selectedIncome)}
        </TabsContent>
      </Tabs>
    </main>
  );
}
