import { FiisController } from "@/controllers/fii";
import { useFiisPriceHistory } from "@/queries/use-fiis-price-history";
import React from "react";

export function FiisInvestmentGrowthChart() {
  const { data: priceHistory } = useFiisPriceHistory();
  const fiisController = new FiisController({ history: priceHistory ?? [] });
  console.log(fiisController.getFiisInvestmentGrowth());
  return <div>fiis-investment-growth-chart</div>;
}
