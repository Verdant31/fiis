"use client";
import { StatementsFilterContextProvider } from "@/contexts/StatementsFilters";
import { StatementsSkeleton } from "@/components/skeletons/statements-skeleton";
import { StatementsFilters } from "@/components/fixed-income/extract-filters";
import { StatementsMain } from "@/components/fixed-income/extract-main";
import { useFixedIncomeOperations } from "@/queries/use-fixed-income-operations";

export default function Extracts() {
  const { data, isLoading } = useFixedIncomeOperations();

  if (isLoading) return <StatementsSkeleton />;
  if (!isLoading && !data) return <h1>erro</h1>;

  return (
    <StatementsFilterContextProvider>
      <main className="mt-6 max-w-[1124px] mx-auto px-6 lg:mt-2 relative">
        <h1 className="text-3xl font-semibold text-center lg:text-left">
          Extratos
        </h1>
        <StatementsFilters />
        <StatementsMain operations={data} />
      </main>
    </StatementsFilterContextProvider>
  );
}
