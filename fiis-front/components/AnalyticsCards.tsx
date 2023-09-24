"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BRL } from "@/utils/intlBr";
import { Fii, PaymentHistory } from "@prisma/client";

interface AnalyticsCardsProps {
  fiis: Fii[] | undefined;
  isLoading: boolean;
  history: PaymentHistory[] | undefined;
  totalQuotes: number;
}

export function AnalyticsCards({ fiis, isLoading, history, totalQuotes }: AnalyticsCardsProps) {
  const updatedTotal =
    fiis?.reduce((acc, item) => {
      return acc + Number(item.qty * item.quotationValue);
    }, 0) ?? 0;

  const initialTotal =
    fiis?.reduce((acc, item) => {
      return acc + Number(item.qty * item.initialValue);
    }, 0) ?? 0;

  const percentSinceBegin = (100 * updatedTotal) / initialTotal - 100 ?? 0;

  const dividends =
    history?.reduce((acc, payment) => {
      return acc + payment.value * payment.qty;
    }, 0) ?? 0;

  return (
    <aside className="flex gap-6  items-center justify-between">
      <Card className="w-[220px] bg-background border-zinc-800">
        <CardHeader>
          <CardTitle className="text-md font-normal text-white">Total investido</CardTitle>
        </CardHeader>
        <CardContent className="text-white pt-2 text-lg font-semibold tracking-wide">
          <p>{BRL.format(parseFloat(updatedTotal?.toFixed(2)))}</p>
        </CardContent>
        <CardContent className="text-white text-[12px] font-thin tracking-wide">
          <p>+{percentSinceBegin.toFixed(2)}% desde o começo</p>
        </CardContent>
      </Card>
      <Card className="w-[220px] bg-background border-zinc-800">
        <CardHeader>
          <CardTitle className="text-md font-normal text-white">Dividendos pagos</CardTitle>
        </CardHeader>
        <CardContent className="text-white pt-2 text-lg font-semibold tracking-wide">
          <p>{BRL.format(parseFloat(dividends?.toFixed(2)))}</p>
        </CardContent>
        <CardContent className="text-white text-[12px] font-thin tracking-wide">
          <p>Desde junho/2022</p>
        </CardContent>
      </Card>
      <Card className="w-[220px] bg-background border-zinc-800">
        <CardHeader>
          <CardTitle className="text-md font-normal text-white">Até a meta</CardTitle>
        </CardHeader>
        <CardContent className="text-white pt-2 text-lg font-semibold tracking-wide">
          <p>{BRL.format(300000 - initialTotal)}</p>
        </CardContent>
        <CardContent className="text-white text-[12px] font-thin tracking-wide">
          <p>+{((100 * initialTotal) / 300000).toFixed(1)}% percorrido</p>
        </CardContent>
      </Card>
      <Card className="w-[220px] bg-background border-zinc-800">
        <CardHeader>
          <CardTitle className="text-md font-normal text-white">Total de cotas</CardTitle>
        </CardHeader>
        <CardContent className="text-white pt-2 text-lg font-semibold tracking-wide">
          <p>{totalQuotes}</p>
        </CardContent>
        <CardContent className="text-white text-[12px] font-thin tracking-wide">
          <p>+5 desde o mês passado</p>
        </CardContent>
      </Card>
    </aside>
  );
}
