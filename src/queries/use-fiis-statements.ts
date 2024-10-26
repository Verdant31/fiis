import { useStatementsFilterContext } from "@/contexts/StatementsFilters";
import { api } from "@/lib/axios";
import { Dividend } from "@/types/fiis";
import { FiisOperations } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";

interface MutationParams {
  data: Dividend[] | FiisOperations[];
  sendToEmail: boolean;
}

export const useFiisExtracts = () => {
  const { filters } = useStatementsFilterContext();

  const query = useMutation(
    ["get-fiis-price-history"],
    async (data: MutationParams) => {
      const response = await api.post("fiis/send-extract-to-email", {
        ...data,
        filters,
      });
      return response.data;
    },
  );
  return query;
};
