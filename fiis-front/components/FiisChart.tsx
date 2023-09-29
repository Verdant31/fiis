"use client";
import { getPercentFromFii } from "@/utils/getPercentFromFii";
import { Fii } from "@prisma/client";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

const lineData = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

interface FiisChartProps {
  fiis: Fii[] | undefined;
  isLoading: boolean;
}

export function FiisChart({ fiis }: FiisChartProps) {
  const increaseList = fiis?.map((fii) => ({
    name: fii?.name?.slice(0, -2),
    increased: getPercentFromFii(fii),
  }));
  return (
    <div>
      <ResponsiveContainer width={700} height={400}>
        <BarChart data={increaseList} {...{ overflow: "visible" }}>
          <XAxis minTickGap={0} dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
          <Bar label={{ position: "top", fontSize: 14 }} dataKey="increased" fill="#adfa1d" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
