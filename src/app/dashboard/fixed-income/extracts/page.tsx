"use client";
import { useFiisDividends } from "@/queries/use-fiis-dividends";
import { useFiisOperations } from "@/queries/use-fiis-operations";
import { StatementsFilterContextProvider } from "@/contexts/StatementsFilters";
import { FiiDividends, FiiGroupedOperations } from "@/types/fiis";
import { StatementsFilters } from "@/components/extracts/filters";
import { StatementsMain } from "@/components/extracts/main";
import { StatementsSkeleton } from "@/components/skeletons/statements-skeleton";

export default function Extracts() {
  const { data: dividends, isLoading: isLoadingDividends } = useFiisDividends();
  const { data: operations, isLoading: isLoadingOperations } =
    useFiisOperations();

  const isLoading = isLoadingDividends || isLoadingOperations;
  const falsyData = !dividends || !operations;

  if (isLoading) return <StatementsSkeleton />;
  if (!isLoading && falsyData) return <h1>erro</h1>;

  const fiis = ["Nenhum", ...(dividends?.map((fii) => fii.fiiName) ?? [])];

  return (
    <StatementsFilterContextProvider>
      <main className="mt-6 max-w-[1124px] mx-auto px-6 lg:mt-2 relative">
        <h1 className="text-3xl font-semibold text-center lg:text-left">
          Extratos
        </h1>
        <StatementsFilters fiis={fiis} />
        <StatementsMain
          operations={operations as FiiGroupedOperations[]}
          dividends={dividends as FiiDividends[]}
        />
      </main>
    </StatementsFilterContextProvider>
  );
}
