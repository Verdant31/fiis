"use client";

import { Button } from "@/components/ui/button";
import { Frown } from "lucide-react";

export default function ErrorBoundary({
  error,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="mx-auto w-[80%] flex flex-col items-center gap-4 text-center mt-24">
      <Frown size={84} strokeWidth={1.5} />
      <p>{error.message}</p>

      <div className="w-full mt-6">
        {error.name !== "ApiInteralError" && (
          <Button
            onClick={() => (window.location.href = "/dashboard/home")}
            className="w-[100%] max-w-sm mt-4"
          >
            Voltar para a home
          </Button>
        )}
      </div>
    </div>
  );
}
