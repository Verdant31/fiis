"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import { Skeleton as ShadSkeleton } from "./ui/skeleton";
import { useFiisOperations } from "@/queries/use-fiis-operations";
import { FiisController } from "@/controllers/fii";
import { currencyFormatter } from "@/utils/currency-formatter";
import { useFiisDividends } from "@/queries/use-fiis-dividends";
import { useFiisSummary } from "@/queries/use-fiis-summary";
import { FixedIncomeController } from "@/controllers/fixedIncome";
import { useFixedIncomeOperations } from "@/queries/use-fixed-income-operations";

const Skeleton = () => {
  return (
    <div className="flex space-x-4 overflow-hidden">
      {Array.from({ length: 3 }).map((_, index) => (
        <ShadSkeleton
          key={index}
          className={`w-[244px] h-[104px] ${index === 1 && "shrink-0"}`}
        />
      ))}
    </div>
  );
};

export function AnalyticsCarousel() {
  const [isEmblaRendered, setIsEmblaRendered] = useState(false);
  const { data: operations, isLoading: isLoadingOperations } =
    useFiisOperations();
  const { data: fixedIncomeOperations, isLoading: isLoadingFixedIncome } =
    useFixedIncomeOperations();
  const { data: dividends, isLoading: isLoadingDividends } = useFiisDividends();
  const { data: summary, isLoading: isLoadingSummary } = useFiisSummary();

  useEffect(() => {
    setIsEmblaRendered(true);
  }, []);

  if (
    !isEmblaRendered ||
    isLoadingOperations ||
    isLoadingSummary ||
    isLoadingDividends ||
    isLoadingFixedIncome
  ) {
    return <Skeleton />;
  }

  const fiis = new FiisController({ operations, dividends, summary });
  const fixedIncome = new FixedIncomeController({
    operations: fixedIncomeOperations,
  });
  const fiisInvested = fiis.getTotalValueInvested();
  const fixedIncomeInvested = fixedIncome.getTotalValueInvested();

  const fiisInvestedPercentage =
    (100 * fiisInvested.currentTotal) / fiisInvested.total - 100;

  const fixedIncomeInvestedPercentage =
    (100 * fixedIncomeInvested.currentTotal) / fixedIncomeInvested.total - 100;

  return (
    <Carousel
      opts={{
        loop: true,
        active: window?.innerWidth < 1130,
      }}
      className="w-full "
    >
      <CarouselContent className="-ml-4">
        <CarouselItem className="pl-4 basis-[270px]">
          <Card className="bg-zinc-900 ">
            <CardHeader>
              <CardTitle className="text-md font-normal text-white">
                Total Geral
              </CardTitle>
            </CardHeader>
            <CardContent className="text-white text-lg font-semibold tracking-wide">
              <p>
                {currencyFormatter(
                  fiisInvested.total + fixedIncomeInvested.total,
                )}
              </p>
              <p
                className="text-sm"
                style={{
                  color:
                    fiisInvestedPercentage + fixedIncomeInvestedPercentage > 0
                      ? "#22c55e"
                      : "#ed2846",
                }}
              >
                Atual:{" "}
                {currencyFormatter(
                  fiisInvested.currentTotal + fixedIncomeInvested.currentTotal,
                )}{" "}
                (
                {(fiisInvestedPercentage + fixedIncomeInvestedPercentage)
                  .toFixed(1)
                  .replace("-", "")}
                %)
              </p>
            </CardContent>
            <CardContent className="text-white text-[12px] font-thin tracking-wide">
              <p>Inclui compras e vendas no cálculo</p>
            </CardContent>
          </Card>
        </CarouselItem>
        <CarouselItem className="pl-4 basis-[270px]">
          <Card className="bg-zinc-900 ">
            <CardHeader>
              <CardTitle className="text-md font-normal text-white">
                Total em FIIs
              </CardTitle>
            </CardHeader>
            <CardContent className="text-white text-lg font-semibold tracking-wide">
              <p>{currencyFormatter(fiisInvested.total)}</p>
              <p
                className="text-sm"
                style={{
                  color: fiisInvestedPercentage > 0 ? "#22c55e" : "#ed2846",
                }}
              >
                Atual: {currencyFormatter(fiisInvested.currentTotal)} (
                {fiisInvestedPercentage.toFixed(1)}
                %)
              </p>
            </CardContent>
            <CardContent className="text-white text-[12px] font-thin tracking-wide">
              <p>Inclui compras e vendas no cálculo</p>
            </CardContent>
          </Card>
        </CarouselItem>

        <CarouselItem className="pl-4 basis-[270px]">
          <Card className="bg-zinc-900 h-[116px]">
            <CardHeader>
              <CardTitle className="text-md font-normal text-white">
                Dividendos recebidos
              </CardTitle>
            </CardHeader>
            <CardContent className="text-white pt-2 text-lg font-semibold tracking-wide">
              <p>{currencyFormatter(fiis.getTotalDividends())}</p>
            </CardContent>
            <CardContent className="text-white text-[12px] font-thin tracking-wide">
              <p>Desde 01/01/2023</p>
            </CardContent>
          </Card>
        </CarouselItem>

        <CarouselItem className="pl-4 basis-[270px]">
          <Card className="bg-zinc-900 h-[116px] ">
            <CardHeader>
              <CardTitle className="text-md font-normal text-white">
                Próximo mês
              </CardTitle>
            </CardHeader>
            <CardContent className="text-white pt-2 text-lg font-semibold tracking-wide">
              <p>{currencyFormatter(fiis.nextMonthDividends())}</p>
            </CardContent>
            <CardContent className="text-white text-[12px] font-thin tracking-wide">
              <p>Dividendos para o proximo mês</p>
            </CardContent>
          </Card>
        </CarouselItem>

        <CarouselItem className="pl-4 basis-[270px]">
          <Card className="bg-zinc-900 h-[116px]">
            <CardHeader>
              <CardTitle className="text-md font-normal text-white">
                Até a meta
              </CardTitle>
            </CardHeader>
            <CardContent className="text-white pt-2 text-lg font-semibold tracking-wide">
              <p>{currencyFormatter(300000 - fiisInvested.total)}</p>
            </CardContent>
            <CardContent className="text-white text-[12px] font-thin tracking-wide">
              <p>
                {((100 * fiisInvested.total) / 300000).toFixed(1)}% da meta
                alcançado
              </p>
            </CardContent>
          </Card>
        </CarouselItem>

        <CarouselItem className="pl-4 basis-[270px]">
          <Card className="bg-zinc-900 ">
            <CardHeader>
              <CardTitle className="text-md font-normal text-white">
                Total em Renda Fixa
              </CardTitle>
            </CardHeader>
            <CardContent className="text-white text-lg font-semibold tracking-wide">
              <p>{currencyFormatter(fixedIncomeInvested.total)}</p>
              <p
                className="text-sm"
                style={{
                  color:
                    fixedIncomeInvestedPercentage > 0 ? "#22c55e" : "#ed2846",
                }}
              >
                Atual: {currencyFormatter(fixedIncomeInvested.currentTotal)} (
                {fixedIncomeInvestedPercentage.toFixed(1)}
                %)
              </p>
            </CardContent>
            <CardContent className="text-white text-[12px] font-thin tracking-wide">
              <p>Inclui compras e vendas no cálculo</p>
            </CardContent>
          </Card>
        </CarouselItem>
      </CarouselContent>
    </Carousel>
  );
}
