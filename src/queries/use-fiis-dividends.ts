import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { YahooApiInternalError } from "@/lib/exceptions";
import { FiiDividends } from "@/types/fiis";

interface FiiDividendsResponse extends FiiDividends {
  error?: boolean;
}

export const getFiiDividends = async () => {
  const response = await api.get("fiis/dividends");
  if (response?.data.status !== 200) {
    toast.error(response?.data?.message);
    throw new YahooApiInternalError();
  }
  const results = response.data.results as FiiDividendsResponse[];
  const resultsWithError = results.filter((result) => result.error);

  if (resultsWithError.length > 0) {
    resultsWithError.forEach((result) => {
      toast.error(
        `Erro ao tentar buscar dividendos do fundo ${result.fiiName}`,
      );
    });
  }

  return results.filter((result) => !result.error);
};

export const useFiisDividends = () => {
  const query = useQuery(["get-fiis-dividends"], async () => {
    return await getFiiDividends();
  });

  return query;
};
