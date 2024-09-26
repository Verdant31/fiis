"use client";

import { usePathname } from "next/navigation";
import { Header } from "./header";
import Onboard from "./onboard";

export function Pathname({
  children,
}: {
  hasOperations: boolean;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hasOperations = true;
  return (
    <div>
      {pathname !== "/" && hasOperations && <Header />}
      {hasOperations ? children : <Onboard />}
    </div>
  );
}
