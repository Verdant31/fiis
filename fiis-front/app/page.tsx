"use client";
import { AnalyticsCards } from "@/components/AnalyticsCards";
import { FiisChart } from "@/components/FiisChart";
import MinimalFiisList from "@/components/MinimalFiisList";
import { getFiis } from "@/queries/getFiis";
import { getPaymentsHistory } from "@/queries/getPaymentsHistory";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const { data, isLoading } = useQuery(["get-fiis-key"], {
    queryFn: async () => getFiis(),
    cacheTime: 0,
    refetchOnWindowFocus: false,
  });

  const { data: history, isLoading: isLoadingHistory } = useQuery(["get-fiis-history-key"], {
    queryFn: async () => getPaymentsHistory(),
    cacheTime: 0,
    refetchOnWindowFocus: false,
  });

  const totalQuotes =
    data?.reduce((acc, fii) => {
      return acc + fii.qty;
    }, 0) ?? 0;

  return (
    <main className="w-full mt-12">
      <div className="flex items-center justify-between mb-8">
        <div className="w-[450px ml-5">
          <h1 className="text-white text-4xl font-bold tracking-wide">ROAD TO THE 300K</h1>
          <h1 className="text-white text-sm font-thin tracking-wide w-[400px]">Analytical web dashboard to help me reach my goal of R$30000,00 by 2025</h1>
        </div>
        <AnalyticsCards totalQuotes={totalQuotes} history={history} fiis={data} isLoading={isLoading || isLoadingHistory} />
      </div>
      <div className="flex items-center justify-between gap-[60px] ">
        <FiisChart fiis={data} isLoading={isLoading} />
        <MinimalFiisList fiis={data} isLoading={isLoading} />
      </div>
    </main>
  );
}
