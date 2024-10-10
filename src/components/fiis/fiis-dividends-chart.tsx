"use client";
import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BRL } from "@/utils/intlBr";
import { useWindowSize } from "@/hooks/use-window-size";
import { Skeleton as ShadSkeleton } from "../ui/skeleton";
import { useFiisDividends } from "@/queries/use-fiis-dividends";

const chartConfig = {
  dividends: {
    label: "Dividends",
  },
} satisfies ChartConfig;

const Skeleton = () => {
  return (
    <div className="mt-6 max-w-[760px]">
      <div className="flex items-end justify-between">
        <div>
          <ShadSkeleton className="w-[187px] h-[27px]" />
          <ShadSkeleton className="w-[217px] mt-2 h-[27px]" />
        </div>
      </div>
      <div>
        <ShadSkeleton className="mt-6 max-w-[760px] min-h-[40px] h-auto w-[100%] rounded-lg  min-w-[430px] xl:min-w-[530p" />
        <ShadSkeleton className="mt-2 max-w-[760px] min-h-[40px] h-auto w-[90%] rounded-lg min-w-[360px] xl:min-w-[460px]" />
        <ShadSkeleton className="mt-2 max-w-[760px] min-h-[40px] h-auto w-[80%] rounded-lg min-w-[210px] xl:min-w-[310px]" />
        <ShadSkeleton className="mt-2 max-w-[760px] min-h-[40px] h-auto w-[70%] rounded-lg min-w-[260px] xl:min-w-[260px]" />
        <ShadSkeleton className="mt-2 max-w-[760px] min-h-[40px] h-auto w-[60%] rounded-lg min-w-[160px] xl:min-w-[160px]" />
      </div>
    </div>
  );
};

export function FiisDividendsChart() {
  const { data: dividends, isLoading } = useFiisDividends();
  const window = useWindowSize();

  if (isLoading) return <Skeleton />;
  if (dividends?.length === 0 || !dividends) return null;

  const topFiisIndex = (window.width ?? 0) > 700 ? 10 : 5;

  const firstFiiDividends = dividends[0]?.monthlyDividends;
  const hasNoDividends = Object.keys(firstFiiDividends).every(
    (month) => firstFiiDividends[month].total === 0,
  );

  const transformDividendsToChart = () => {
    if (hasNoDividends && dividends.length === 1) {
      const fiiDividends = dividends[0]?.monthlyDividends;
      const lastMonthPaid = Object.keys(fiiDividends).at(-1);

      if (!lastMonthPaid) return [];

      const data = dividends.map((fiiDividends) => {
        const lastMonthPaid = Object.keys(fiiDividends.monthlyDividends).at(
          -1,
        ) as keyof typeof fiiDividends;
        return {
          fii: fiiDividends.fiiName.split("11.SA")[0],
          dividends:
            fiiDividends.monthlyDividends[lastMonthPaid].paymentPerQuote *
            fiiDividends.quotes,
        };
      });

      return data;
    } else {
      const data = dividends.map((fiiDividends) => {
        const months = Object.keys(fiiDividends.monthlyDividends);
        return {
          fii: fiiDividends.fiiName.split("11.SA")[0],
          dividends: months.reduce((acc, month) => {
            acc += fiiDividends.monthlyDividends[month].total;
            return acc;
          }, 0),
        };
      });

      return data;
    }
  };

  const chartData = transformDividendsToChart()
    .sort((a, b) => b.dividends - a.dividends)
    .slice(0, topFiisIndex);

  return (
    <div className="mt-8 max-w-[760px] lg:max-w-[500px] lg:w-full lg:mr-8 lg:mt-6">
      <div>
        <h1 className="font-semibold text-lg lg:text-xl">
          Pagamento de dividendos
        </h1>
        <p className="text-muted-foreground w-[85%] text-sm lg:text-base lg:w-full">
          Top {topFiisIndex} maiores pagadores da carteira
        </p>
      </div>
      <ChartContainer
        className="mt-4 max-w-[95%] lg:h-[300px] xl:h-[400px]"
        config={chartConfig}
      >
        <BarChart
          accessibilityLayer
          data={chartData.map((fii, index) => ({
            ...fii,
            fill: `hsl(var(--chart-${index + 1}))`,
          }))}
          layout="vertical"
          margin={{
            left: 0,
          }}
        >
          <YAxis
            dataKey="fii"
            type="category"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value}
          />

          <XAxis dataKey="dividends" type="number" hide />
          {(window?.width ?? 0) > 1130 && (
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  itemValueFormatter={(item) =>
                    BRL.format(parseFloat((item.value as number)?.toFixed(2)))
                  }
                />
              }
            />
          )}

          <Bar dataKey="dividends" layout="vertical" radius={5}>
            {(window?.width ?? 0) < 1130 && (
              <LabelList
                position="insideLeft"
                dataKey="dividends"
                formatter={(value: number) =>
                  BRL.format(parseFloat((value as number)?.toFixed(2)))
                }
                fill="white"
                offset={8}
                fontSize={12}
              />
            )}
          </Bar>
        </BarChart>
      </ChartContainer>
      {hasNoDividends && (
        <p className="text-sm text-muted-foreground">
          ⚠️ No momento seus Fundos ainda não pagaram nenhum dividendo, este
          gráfico é uma simulação com base nos dividendos anteriores do fundo.
        </p>
      )}
    </div>
  );
}
