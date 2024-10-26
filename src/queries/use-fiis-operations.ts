import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { FiiGroupedOperations } from "@/types/fiis";

export const useFiisOperations = () => {
  const query = useQuery(["get-fiis-operations"], async () => {
    const response = await api.get("fiis/operations");
    if (response?.data.status !== 200) {
      toast.error(response?.data?.message);
      throw new Error(
        "Houve um erro ao tentar resgatar suas compras/vendas de FIIs, tente novamente mais tarde e caso o problema persista contate contato@joaopiovesan.com.br",
      );
    }
    return response.data.operations as FiiGroupedOperations[];
  });
  return query;
};
