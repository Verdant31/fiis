/* eslint-disable jsx-a11y/alt-text */
"use client";
import { Page, Text, View, Document, Image } from "@react-pdf/renderer";
import { format, intervalToDuration } from "date-fns";
import { tw } from "./styles";
import {
  IntervalsFilterType,
  IntervalsValueType,
  TableDataType,
} from "@/types/extracts";
import { DateInRangeModeType } from "@/components/select-interval";
import { ptBR } from "date-fns/locale";
import { FixedIncomeWithEvolution } from "@/types/fixed-income";
import { currencyFormatter } from "@/utils/currency-formatter";
import ReactPDFChart from "react-pdf-charts";
import { fixedIncomeToChartData } from "@/helpers/fixed-income-to-chartdata";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { chartColors } from "@/utils/chart-colors";

interface Props {
  operations: FixedIncomeWithEvolution[];
  extractedData: FixedIncomeWithEvolution[];
  userEmail: string;
  filters: {
    intervalType: IntervalsFilterType;
    intervalValue: IntervalsValueType | undefined;
    fiiName: string | undefined;
    tableDataType: TableDataType;
  };
}

export function FixedIncomeExtractsPdf({
  operations,
  userEmail,
  filters,
  extractedData,
}: Props) {
  const { intervalType, intervalValue, tableDataType } = filters;
  const title = `Meu Extrato de ${
    tableDataType === "operations" ? "Operações" : "Rendimentos"
  }`;
  const logoUrl = process.env.NEXT_PUBLIC_APP_URL + "/pdf-logo.png";

  const displayIntervalValue = (): string => {
    if (intervalType === "Personalizado") {
      const { from, to } = intervalValue as DateInRangeModeType;
      return `De ${from} Até ${to}`;
    }
    if (intervalType === "Mês") {
      return format(intervalValue as Date, "MMMM", {
        locale: ptBR,
      });
    }
    return intervalValue as string;
  };

  const getRemainingDaysUntilDue = (dueDate: Date) => {
    const today = new Date();
    const dueDateObj = new Date(dueDate);
    const duration = intervalToDuration({
      start: today,
      end: dueDateObj,
    });
    return (
      (duration?.years ?? 0) * 365 +
      (duration?.months ?? 0) * 30 +
      (duration?.days ?? 0)
    );
  };

  const { chartData, lines, biggestValue } = fixedIncomeToChartData(
    operations,
    "percent",
  );

  return (
    <Document>
      <Page
        size="A4"
        wrap
        style={tw("bg-white text-black pt-5 px-5 font-sans text-base")}
      >
        <View
          style={tw(
            "flex items-center justify-between px-8 pb-5 flex-row border-b-[1px] border-customPurple",
          )}
        >
          <Text style={tw("text-3xl w-52 leading-5")}>{title}</Text>
          <View style={tw("flex items-center flex-row gap-2.5")}>
            <Image src={logoUrl} style={{ height: 80, width: 90 }} />
            <View>
              <Text style={tw("font-extrabold text-[20px]")}>STOCKS.TR</Text>
              <Text style={tw("w-[150px] font-light text-sm m-0 p-0")}>
                Seus investimentos sempre ao seu alcance.
              </Text>
            </View>
          </View>
        </View>
        <View style={tw("mt-5 px-2.5")}>
          <Text>
            Emissão feita em {format(new Date(), "dd/MM/yyyy hh:mm")} por{" "}
            {userEmail}
          </Text>

          <View
            style={tw(
              "flex flex-row bg-customPurple pt-[7px] pb-[3px] px-4 rounded-sm mt-4",
            )}
          >
            <Text style={tw("text-white font-medium w-[80px]")}>Empresa</Text>
            <Text style={tw("text-white font-medium w-[150px]")}>
              Vencimento
            </Text>
            <Text style={tw("text-white font-medium w-[115px]")}>
              Valor investido
            </Text>
            <Text style={tw("text-white font-medium w-[75px] ")}>Período</Text>
            <Text style={tw("text-white font-medium w-[115px]")}>
              Rendimento
            </Text>
          </View>
          {extractedData.map((item) => (
            <View
              key={item.companyName}
              style={tw(
                "flex flex-row border-b-[1px] border-b-black pt-[7px] pb-[3px] px-4",
              )}
            >
              <Text style={tw("w-[80px]")}>{item?.companyName}</Text>
              <Text style={tw("w-[150px]")}>
                {format(new Date(item.dueDate), "dd/MM/yyyy")} &nbsp; (
                {getRemainingDaysUntilDue(new Date(item.dueDate))} dias)
              </Text>
              <Text style={tw("w-[115px]")}>
                {currencyFormatter(
                  tableDataType === "operations"
                    ? item.investedValue
                    : (operations.find((op) => op.id === item.id)
                        ?.investedValue ?? 0),
                )}
              </Text>
              <Text style={tw("w-[75px] capitalize")}>
                {displayIntervalValue()}
              </Text>
              <Text style={tw("w-[115px]")}>
                {currencyFormatter(
                  tableDataType === "operations"
                    ? item.latestValue
                    : item.investedValue,
                )}
              </Text>
            </View>
          ))}
        </View>
        <View style={tw("mt-12 flex items-center")}>
          <ReactPDFChart>
            <LineChart data={chartData} height={300} width={500}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickMargin={8}
                tickFormatter={(value: number) =>
                  new Date(value).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }
              />
              <YAxis
                type="number"
                tickFormatter={(v) => v + "%"}
                domain={[-10, Math.round(biggestValue) + 10]}
              />
              {lines?.map((line, index) => (
                <Line
                  key={line}
                  dataKey={line}
                  name={line}
                  type="monotone"
                  stroke={chartColors[index]}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            </LineChart>
          </ReactPDFChart>
        </View>
        <View
          style={tw(
            "flex flex-row justify-center mt-12 items-center gap-6 flex-wrap",
          )}
        >
          {lines.map((entry, index) => (
            <View key={entry} style={tw("flex flex-row items-center gap-4")}>
              <View
                style={tw(
                  `h-4 -mt-1 w-4 rounded-sm bg-[${chartColors[index]}]`,
                )}
              />
              <Text>{entry}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}
