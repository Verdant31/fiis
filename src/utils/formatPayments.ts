import { Fii } from "@/lib/types";

export const formatPayments = (fiis?: Fii[]) => {
  const allPayments = [];
  if(!fiis) return [];

  for(const fii of fiis){
    if(!fii.payments) continue;
    for (const payment of fii.payments) {
      allPayments.push(payment);
    }
  }
  return allPayments;
}
