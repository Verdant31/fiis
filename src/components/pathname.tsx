"use client";

import { redirect, usePathname } from "next/navigation";
import { Header } from "./header";
import { Onboard } from "./onboard";
import { useEffect } from "react";

export function Pathname({
  children,
  hasOperations,
}: {
  hasOperations: {
    fiis: boolean;
    fixedIncomes: boolean;
  };
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const alreadyCompleteOnboard =
    hasOperations.fiis || hasOperations.fixedIncomes;

  useEffect(() => {
    if (
      pathname.includes("fixed-income") &&
      !pathname.includes("register") &&
      !hasOperations.fixedIncomes
    ) {
      redirect("/dashboard/home");
    }
    if (
      (pathname.includes("fiis") || pathname === "/dashboard/home") &&
      !pathname.includes("register") &&
      !hasOperations.fiis
    ) {
      redirect("/dashboard/fixed-income/general");
    }
  }, [pathname, hasOperations.fiis, hasOperations.fixedIncomes]);

  return (
    <div>
      {pathname !== "/" && alreadyCompleteOnboard && (
        <Header hasOperations={hasOperations} />
      )}
      {alreadyCompleteOnboard ? children : <Onboard />}
    </div>
  );
}
