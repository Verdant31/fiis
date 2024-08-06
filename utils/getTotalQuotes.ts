import { Fii } from "@/lib/types";

export const getTotalQuotes = (fiis?: Fii[]) => {
  if (!fiis) return 0;
  return  fiis?.reduce((acc, fii) => {
    const totalPurchaseOfFii = fii.purchases?.reduce((purchaseAcc, purchase) => {
      return purchaseAcc + purchase.qty
    }, 0);
    return acc + (totalPurchaseOfFii ?? 0);
  }, 0) ?? 0;
}