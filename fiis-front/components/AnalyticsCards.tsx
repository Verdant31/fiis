"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Fii } from "@/lib/types";
import { BRL } from "@/utils/intlBr";

interface AnalyticsCardsProps {
  fiis: Fii[] | undefined;
  isLoading: boolean;
}

export function AnalyticsCards({ fiis }: AnalyticsCardsProps) {
  const totalQuotes = fiis?.reduce((acc, fii) => {
    const totalPurchaseOfFii = fii.purchases?.reduce((purchaseAcc, purchase) => {
      return purchaseAcc + purchase.qty
    }, 0);
    return acc + (totalPurchaseOfFii ?? 0);
  }, 0) ?? 0;

  const total = fiis?.reduce((acc, fii) => {
    const totalPurchaseOfFii = fii.purchases?.reduce((purchaseAcc, purchase) => {
      return purchaseAcc + (purchase.qty * purchase.quotationValue)
    }, 0);
    return acc + (totalPurchaseOfFii ?? 0);
  }, 0) ?? 0;

  const initial =  fiis?.reduce((acc, fii) => {
    const totalPurchaseOfFii = fii.initialValue * fii.quantity
    return acc + (totalPurchaseOfFii ?? 0);
  }, 0) ?? 0;

  const percentSinceBegin = (100 * total) / initial - 100 ?? 0;

  const dividends = fiis?.reduce((acc, fii) => {
    const totalPurchaseOfFii = fii.payments?.reduce((paymentAcc, payment) => {
      return paymentAcc + (payment.quotesQuantityAtThePayment * payment.paidPerQuote);
    }, 0);
    return acc + (totalPurchaseOfFii ?? 0);
  }, 0) ?? 0;

  return (
    <aside className="flex gap-6  items-center justify-between">
      <Card className="w-[220px] bg-background border-zinc-800">
        <CardHeader>
          <CardTitle className="text-md font-normal text-white">Total in FII's</CardTitle>
        </CardHeader>
        <CardContent className="text-white pt-2 text-lg font-semibold tracking-wide">
          <p>{BRL.format(parseFloat(total?.toFixed(2)))}</p>
        </CardContent>
        <CardContent className="text-white text-[12px] font-thin tracking-wide">
          <p>+{percentSinceBegin.toFixed(2)}% from initial value</p>
        </CardContent>
      </Card>
      <Card className="w-[220px] bg-background border-zinc-800">
        <CardHeader>
          <CardTitle className="text-md font-normal text-white">Dividends paid</CardTitle>
        </CardHeader>
        <CardContent className="text-white pt-2 text-lg font-semibold tracking-wide">
          <p>{BRL.format(parseFloat(dividends?.toFixed(2)))}</p>
        </CardContent>
        <CardContent className="text-white text-[12px] font-thin tracking-wide">
          <p>Since feb/2024</p>
        </CardContent>
      </Card>
      <Card className="w-[220px] bg-background border-zinc-800">
        <CardHeader>
          <CardTitle className="text-md font-normal text-white">Until goal</CardTitle>
        </CardHeader>
        <CardContent className="text-white pt-2 text-lg font-semibold tracking-wide">
          <p>{BRL.format(300000 - initial)}</p>
        </CardContent>
        <CardContent className="text-white text-[12px] font-thin tracking-wide">
          <p>+{((100 * initial) / 300000).toFixed(1)}% achieved</p>
        </CardContent>
      </Card>
      <Card className="w-[220px] bg-background border-zinc-800">
        <CardHeader>
          <CardTitle className="text-md font-normal text-white">Total quotes</CardTitle>
        </CardHeader>
        <CardContent className="text-white pt-2 text-lg font-semibold tracking-wide">
          <p>{totalQuotes}</p>
        </CardContent>
        <CardContent className="text-white text-[12px] font-thin tracking-wide">
          <p>+5 since last month</p>
        </CardContent>
      </Card>
    </aside>
  );
}
