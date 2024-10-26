import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { YahooApiInternalError } from "@/lib/exceptions";
import { FiisOperations } from "@prisma/client";
import { differenceInMonths, format } from "date-fns";
import { Dividend } from "@/types/fiis";
import { getFiiDividends } from "./use-fiis-dividends";

export const useUniqueFiiDividends = ({
  operations,
  key,
}: {
  operations: FiisOperations[];
  key: string;
}) => {
  const query = useQuery(
    [`get-fiis-dividends-${key}`],
    async () => {
      const response = await api.get("fiis/dividends");
      if (response?.data.status !== 200) {
        toast.error(response?.data?.message);
        throw new YahooApiInternalError();
      }
      const results = await getFiiDividends();
      const fii = results.find((fii) => fii.fiiName === operations[0].fiiName);
      const sortedOperations = operations.toSorted(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      );
      const firstOperationDate = sortedOperations[0].date;
      const months = differenceInMonths(
        new Date(),
        new Date(firstOperationDate),
      );
      const monthsKeys = [];
      for (let i = 0; i < months + 1; i++) {
        const date = new Date(
          new Date(sortedOperations[0].date).setMonth(
            new Date(sortedOperations[0].date).getMonth() + i,
          ),
        );
        monthsKeys.push(format(date, "MM/yyyy"));
      }
      const dividendsAsChart = monthsKeys.map((month) => {
        return {
          month,
          dividend: fii?.monthlyDividends[month].total || 0,
        };
      });

      const lastMonthsAndSortedDividends = dividendsAsChart
        .toSorted(
          (a, b) => new Date(a.month).getTime() - new Date(b.month).getTime(),
        )
        .slice(-8);

      const dividends = Object.keys(fii?.monthlyDividends ?? {})
        .map((month) => ({
          ...(fii?.monthlyDividends[month] as Dividend),
        }))
        .filter((dividend) => dividend.quotesAtPayment > 0);

      return {
        dividendsAsChartData: lastMonthsAndSortedDividends,
        dividends,
      };
    },
    {
      refetchOnWindowFocus: true,
    },
  );

  return query;
};
