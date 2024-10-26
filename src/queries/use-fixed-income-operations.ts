import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { FixedIncomeWithEvolution } from "@/types/fixed-income";

export const useFixedIncomeOperations = () => {
  const query = useQuery(["get-fixed-income-operations"], async () => {
    const response = await api.get("fixed-income/operations");
    if (response?.data.status !== 200) {
      toast.error(response?.data?.message);
      throw new Error(
        "Houve um erro ao tentar resgatar suas compras/vendas de FIIs, tente novamente mais tarde e caso o problema persista contate contato@joaopiovesan.com.br",
      );
    }

    return response.data.operations as FixedIncomeWithEvolution[];
  });
  return query;
};
