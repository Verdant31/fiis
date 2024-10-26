/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BarChart,
  LineChart,
  XAxis,
  XAxisProps,
  YAxis,
  YAxisProps,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart";
import { ReactNode, SVGProps } from "react";

type XAxisComponent = React.Component<
  Omit<SVGProps<SVGElement>, "scale"> & XAxisProps
>;

type YAxisComponent = React.Component<
  Omit<SVGProps<SVGElement>, "scale"> & YAxisProps
>;
interface Props {
  className: string;
  chartConfig?: ChartConfig;
  chartType: "bar" | "line";
  data?: any[] | undefined;
  chartProps?: any;
  xAxisProps?: XAxisProps;
  yAxisProps?: YAxisProps;
  children: ReactNode;
  tooltip?: {
    labelFormatter: (label: string) => string;
    valueFormatter: (value: number) => string;
  };
}

export const CustomChart = ({
  chartConfig,
  className,
  chartType,
  data,
  chartProps,
  xAxisProps,
  yAxisProps,
  children,
  tooltip,
}: Props) => {
  const defaultXAxisProps = {
    tickLine: false,
    axisLine: false,
    tickMargin: 8,
    ...xAxisProps,
  } as unknown as XAxisComponent;

  const defaultYAxisProps = {
    tickLine: false,
    axisLine: false,
    ...yAxisProps,
  } as unknown as YAxisComponent;

  return (
    <ChartContainer
      className={className}
      config={chartConfig ?? ({} satisfies ChartConfig)}
    >
      {chartType === "bar" ? (
        <BarChart {...chartProps} data={data} accessibilityLayer margin={{}}>
          {children}
          {xAxisProps && <XAxis {...defaultXAxisProps} />}
          {yAxisProps && <YAxis {...defaultYAxisProps} />}
        </BarChart>
      ) : (
        <LineChart {...chartProps} data={data} accessibilityLayer margin={{}}>
          {tooltip && (
            <ChartTooltip
              labelFormatter={(label) => tooltip.labelFormatter(String(label))}
              content={
                <ChartTooltipContent
                  itemValueFormatter={(item) =>
                    tooltip.valueFormatter(item.value as number)
                  }
                />
              }
            />
          )}
          {children}
          {xAxisProps && <XAxis {...defaultXAxisProps} />}
          {yAxisProps && <YAxis {...defaultYAxisProps} />}
        </LineChart>
      )}
    </ChartContainer>
  );
};
