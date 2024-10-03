"use client";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Bar,
  BarChart,
} from "recharts";
import { parse } from "date-fns";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BRL } from "@/utils/intlBr";
import { FormEvent, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton as ShadSkeleton } from "./ui/skeleton";
import { useFiisPriceHistory } from "@/queries/use-fiis-price-history";
import { FiisController } from "@/controllers/fii";
import { Input } from "./ui/input";
import { Sparkle } from "lucide-react";
import { useFiisSummary } from "@/queries/use-fiis-summary";
import { useCloudflareModel } from "@/queries/use-cloudflare-model";
import { useFiisDividends } from "@/queries/use-fiis-dividends";
import { client } from "@/app/providers";
import { ClipLoader } from "react-spinners";
import { currencyFormatter } from "@/utils/currency-formatter";

export enum FiisPriceChartOptions {
  AllBaseTen = "Base 10",
  AllBaseOneHundred = "Base 100",
  AllBaseNinety = "Base 90",
}

export function FiisHomeChart() {
  const [fiiFilter, setFiiFilter] = useState<string>();
  const [modelInput, setModelInput] = useState<string>("");

  const { data: fiisHistory, isLoading: isLoadingHistory } =
    useFiisPriceHistory();
  const { data: summary, isLoading: isLoadingSummary } = useFiisSummary();
  const { data: dividends, isLoading: isLoadingDividends } = useFiisDividends();

  const { data, isFetching: isLoadingModelResponse } = useCloudflareModel({
    modelInput,
    summary,
    fiisHistory,
    setModelInput,
  });

  const isLoading = isLoadingHistory || isLoadingSummary || isLoadingDividends;

  if (isLoading) return <Skeleton />;
  if (fiisHistory?.length === 0 || !summary || !fiisHistory) return null;

  const fiisController = new FiisController({
    history: fiisHistory,
    summary,
    dividends,
  });

  const { chartData, yAxisDomain, chartType } =
    fiisController.formatHistoryToChartData(fiiFilter, data);

  const selectOptions = [
    FiisPriceChartOptions.AllBaseTen,
    FiisPriceChartOptions.AllBaseOneHundred,
    FiisPriceChartOptions.AllBaseNinety,
    ...fiisHistory.map((fii) => fii.fiiName),
  ];

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const data = new FormData(e.target as HTMLFormElement);
    const modelInput = data.get("modelInput") as string;
    setModelInput(modelInput);
  };

  const fiisBars = Array.from(
    new Set(
      chartData
        .flatMap((item) => Object.keys(item))
        .filter((key) => key !== "date"),
    ),
  );

  console.log(chartData);
  return (
    <div className="mt-6 max-w-[760px] lg:w-full">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-semibold text-lg lg:text-xl">
            Histórico de Preços
          </h1>
          <p className="text-muted-foreground w-[85%] text-sm lg:text-base lg:w-full">
            Preço dos FIIS nos ultimos 12 meses
          </p>
        </div>
        <Select
          defaultValue={selectOptions[3]}
          value={fiiFilter}
          onValueChange={(value) => {
            setFiiFilter(value);
            setModelInput("");
            const el = document.getElementById(
              "modelInput",
            ) as HTMLInputElement;
            el.value = "";
            client.resetQueries({ queryKey: ["cloudflare"] });
          }}
        >
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto focus:ring-0 focus:ring-offset-0"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {selectOptions.map((option) => (
              <SelectItem key={option} value={option} className="rounded-lg">
                {option.split(".SA")[0]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="relative">
        <form onSubmit={onSubmit}>
          <Input
            name="modelInput"
            id="modelInput"
            className="mt-4 bg-zinc-900 pl-10 pr-12"
            placeholder="Mostre os fundos: XPML11, MXRF11 e BRCO11"
          />
        </form>
        {isLoadingModelResponse && (
          <ClipLoader
            size={20}
            className="absolute text-muted-foreground right-4 top-[10px]"
            color="#fff"
          />
        )}

        <Sparkle
          size={20}
          className="absolute text-muted-foreground left-2 top-[50%] translate-y-[-50%]"
        />
      </div>
      {chartType === "line" ? (
        <ChartContainer className="mt-6" config={{} satisfies ChartConfig}>
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
              tickFormatter={() => ``}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  itemValueFormatter={(item) =>
                    BRL.format(parseFloat((item.value as number)?.toFixed(2)))
                  }
                />
              }
            />
            {fiisHistory.map((fii, index) => (
              <Line
                key={fii.fiiName}
                dataKey={fii.fiiName}
                name={fii.fiiName.split(".SA")[0] + " "}
                type="monotone"
                stroke={`hsl(var(--chart-${index + 1}))`}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </LineChart>
        </ChartContainer>
      ) : (
        <ChartContainer
          className="mt-6 h-[400px] max-w-[100%]"
          config={{} satisfies ChartConfig}
        >
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  skipFalsyValues={true}
                  itemValueFormatter={(item) => {
                    return currencyFormatter(item.value as number);
                  }}
                  hideLabel
                />
              }
            />
            <ChartLegend
              className="flex-wrap"
              content={<ChartLegendContent />}
            />
            {fiisBars.map((data, index) => {
              return (
                <Bar
                  key={data}
                  barSize={120}
                  dataKey={data}
                  label={data}
                  stackId="a"
                  fill={`hsl(var(--chart-${index + 1}))`}
                />
              );
            })}
          </BarChart>
        </ChartContainer>
      )}
    </div>
  );
}

const Skeleton = () => {
  return (
    <div className="mt-6 max-w-[760px] lg:w-full">
      <div className="flex items-end justify-between">
        <div>
          <ShadSkeleton className="w-[187px] h-[27px]" />
          <ShadSkeleton className="w-[217px] mt-2 h-[27px]" />
        </div>
        <ShadSkeleton className="w-[140px] h-[30px]" />
      </div>

      <ShadSkeleton className="mt-6 max-w-[760px] lg:h-[430px] min-h-[217px] sm:min-h-[300px] h-auto w-[100%] rounded-lg" />
    </div>
  );
};
