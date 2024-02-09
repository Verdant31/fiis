"use client";
import { Fii } from "@/lib/types";
import { getPercentFromFii } from "@/utils/getPercentFromFii";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

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
