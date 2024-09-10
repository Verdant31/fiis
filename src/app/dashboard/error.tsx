"use client";

import { Button } from "@/components/ui/button";
import { Frown } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const router = useRouter();

  return (
    <div className="mx-auto w-[80%] flex flex-col items-center gap-4 text-center mt-24">
      <Frown size={84} strokeWidth={1.5} />
      <p>{error.message}</p>

      <div className="w-full mt-6">
        <Button onClick={reset} className="w-[100%]">
          Tentar novamente
        </Button>
        {error.name !== "ApiInteralError" && (
          <Button
            onClick={() => router.push("/dashboard")}
            className="w-[100%] mt-4"
          >
            Voltar para a home
          </Button>
        )}
      </div>
    </div>
  );
}
