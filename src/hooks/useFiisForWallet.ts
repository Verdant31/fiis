import { getFiis } from "@/queries/getFiis";
import { getPurchases } from "@/queries/getPurchases";
import { useQuery } from "@tanstack/react-query";

export const useFiisForWallet = () => {
  const { data: fiis } = useQuery(["get-fiis-key"], {
    queryFn: async () => getFiis(),
    cacheTime: 0,
    refetchOnWindowFocus: false,
  });

  const { data: purchasesResponse } = useQuery(["get-purchases-key"], {
    queryFn: async () => getPurchases(),
    cacheTime: 0,
    refetchOnWindowFocus: false,
  });

  const totalQuotes =
    purchasesResponse?.purchases?.reduce((acc, fii) => {
      return acc + fii.qty;
    }, 0) ?? 0;

  const formatted = fiis?.map((fii) => {
    const totalQuotesForFii =
      purchasesResponse?.purchases?.reduce((acc, purchase) => {
        if (fii.name !== purchase.fiiName) return acc;
        return acc + purchase.qty;
      }, 0) ?? 0;

    return {
      ...fii,
      qty: totalQuotesForFii,
    };
  });

  return { data: formatted, totalQuotes };
};
