"use client";
import { tw } from "./styles";
import { Dividend, FiiGroupedOperations } from "@/types/fiis";
import { Text, View } from "@react-pdf/renderer";
import { format } from "date-fns";
import ReactPDFChart from "react-pdf-charts";
import { currencyFormatter } from "@/utils/currency-formatter";
import { PieChart, Pie, Cell } from "recharts";
import { chartColors } from "@/utils/chart-colors";

interface RenderCustomizedLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  outerRadius: number;
  fill: string;
  value: number;
}

interface Props {
  operations: FiiGroupedOperations[];
  extractedDividends: Dividend[];
}

const Card = ({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) => {
  return (
    <View style={tw("flex flex-col text-white font-medium text-center")}>
      <Text
        style={tw(
          "bg-customPurple pt-[7px] pb-[3px] px-4 text-center rounded-sm",
        )}
      >
        {label}
      </Text>
      <Text style={tw("text-black font-normal mt-2 text-lg")}>{children}</Text>
    </View>
  );
};

export function Dividends({ extractedDividends, operations }: Props) {
  const totalDividendsFromExtract = extractedDividends.reduce(
    (total, item) => total + (item.total || 0),
    0,
  );

  const chartData = extractedDividends.map((item) => ({
    fiiName: item.fiiName,
    totalPaid: item.total,
    percentage:
      totalDividendsFromExtract > 0
        ? ((item.total || 0) / totalDividendsFromExtract) * 100
        : 0,
  }));

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    outerRadius,
    fill,
    value,
  }: RenderCustomizedLabelProps) => {
    const RADIAN = Math.PI / 180;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? "start" : "end";
    if (ey > 240) {
      return (
        <g>
          <path d={`M${sx},${sy}L${mx},${my}L`} stroke={fill} fill="none" />
          <circle cx={mx} cy={ey} r={2} fill={fill} stroke="none" />
          <text
            x={mx + -1 * 12}
            y={ey + 15}
            textAnchor={"start"}
            style={{ fontSize: 12 }}
            fill="#333"
          >
            {Math.floor(value)}%
          </text>
        </g>
      );
    }
    return (
      <g>
        <path
          d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
          stroke={fill}
          fill="none"
        />

        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />

        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          textAnchor={textAnchor}
          style={{ fontSize: 12 }}
          fill="#333"
        >
          {Math.floor(value)}%
        </text>
      </g>
    );
  };

  const getTotalInvestedInFii = (fiiName: string) => {
    const fiiOperations = operations.find(
      (operation) => operation.fiiName === fiiName,
    );

    const total = fiiOperations?.operations.reduce((acc, operation) => {
      if (operation.type === "sale")
        acc -= operation.qty * operation.quotationValue;
      else if (operation.type === "purchase")
        acc += operation.qty * operation.quotationValue;
      return acc;
    }, 0);

    return total ?? 0;
  };

  const getMostValuableFii = () => {
    const fiis = extractedDividends.map((fiiDividends) => {
      const totalInvested = getTotalInvestedInFii(fiiDividends.fiiName);
      return {
        fiiName: fiiDividends.fiiName,
        percent: (100 * fiiDividends?.total) / totalInvested,
      };
    });
    fiis.sort((a, b) => b.percent - a.percent);
    return fiis[0];
  };

  const biggestPayer = extractedDividends.reduce(
    (acc, item) => (item.total > acc.total ? item : acc),
    { total: 0, fiiName: "" },
  ).fiiName;

  const mostInvested = extractedDividends.reduce(
    (acc, item) =>
      getTotalInvestedInFii(item.fiiName) > getTotalInvestedInFii(acc.fiiName)
        ? item
        : acc,
    { total: 0, fiiName: "" },
  ).fiiName;

  return (
    <View style={tw("flex flex-col mt-4")}>
      <View
        style={tw(
          "flex flex-row bg-customPurple pt-[7px] pb-[3px] px-4 rounded-sm",
        )}
      >
        <Text style={tw("text-white font-medium w-[80px]")}>Fundo</Text>
        <Text style={tw("text-white font-medium w-[60px]")}>Cotas</Text>
        <Text style={tw("text-white font-medium w-[95px]")}>Pago p/ cota</Text>
        <Text style={tw("text-white font-medium w-[75px]")}>Total</Text>
        <Text style={tw("text-white font-medium w-[90px]")}>Data</Text>
        <Text style={tw("text-white font-medium w-[105px]")}>
          Total investido
        </Text>
      </View>
      {extractedDividends.map((item) => (
        <View
          key={item.fiiName}
          style={tw(
            "flex flex-row border-b-[1px] border-b-black pt-[7px] pb-[3px] px-4",
          )}
        >
          <Text style={tw("w-[80px]")}>{item?.fiiName}</Text>
          <Text style={tw("w-[60px]")}>{item?.quotesAtPayment}</Text>
          <Text style={tw("w-[95px]")}>
            {currencyFormatter(item?.paymentPerQuote)}
          </Text>
          <Text style={tw("w-[75px]")}>{currencyFormatter(item?.total)}</Text>
          <Text style={tw("w-[90px]")}>
            {format(new Date(item.date), "dd/MM/yyyy")}
          </Text>
          <Text style={tw("w-[105px]")}>
            {currencyFormatter(getTotalInvestedInFii(item.fiiName))}
          </Text>
        </View>
      ))}

      <View style={tw("mt-12 flex items-center flex-row gap-14")}>
        <Card label="Total do período">
          {currencyFormatter(totalDividendsFromExtract)}
        </Card>
        <Card label="Maior pagador">{biggestPayer}</Card>
        <Card label="Maior retorno por valor investido">
          {getMostValuableFii().fiiName} (
          {getMostValuableFii().percent.toFixed(2)}%)
        </Card>
      </View>
      <View style={tw("mt-2 flex items-center flex-row gap-14")}>
        <Card label="Mais valor investido">{mostInvested}</Card>
      </View>
      <View break style={tw("mt-8")}>
        <Text style={tw("mb-4")}>
          Representação em formato de gráfico da porcentagem que cada fundo
          representa do pagamento total de dividendos do período selecionado.
        </Text>
        <ReactPDFChart>
          <PieChart height={300} width={500}>
            <Pie
              isAnimationActive={false}
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              label={renderCustomizedLabel}
              fill="#8884d8"
              dataKey="percentage"
            >
              {chartData.map((_entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={chartColors[index % chartColors.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ReactPDFChart>
        <View
          style={tw(
            "flex flex-row justify-center mt-12 items-center gap-6 flex-wrap",
          )}
        >
          {chartData.map((entry, index) => (
            <View
              style={tw("flex flex-row items-center gap-4")}
              key={entry.fiiName}
            >
              <View
                style={tw(
                  `h-4 -mt-1 w-4 rounded-sm bg-[${chartColors[index]}]`,
                )}
              />
              <Text>
                {entry.fiiName} ({Math.floor(entry.percentage)}%)
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
