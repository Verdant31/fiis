"use client";
import { useFiisDividends } from "@/queries/use-fiis-dividends";
import { useFiisOperations } from "@/queries/use-fiis-operations";
import { StatementsFilterContextProvider } from "@/contexts/StatementsFilters";
import { StatementsFilters } from "@/components/statements/filters";
import { StatementsMain } from "@/components/statements/main";
import { FiiDividends, FiiGroupedOperations } from "@/types/fiis";
import { StatementsSkeleton } from "@/components/skeletons/statements-skeleton";

export default function Statements() {
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
      <main className="mt-6 max-w-[1024px] mx-auto px-6 lg:mt-2">
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
