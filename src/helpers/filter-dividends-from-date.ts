import { FiiDividends } from "@/types/fiis";

interface Props {
  dividends: FiiDividends[];
  filterDateFn?: (date: Date) => boolean;
}

export const filterDividendsFromDate = ({ dividends, filterDateFn }: Props) => {
  const dividendsAsArray = dividends
    .map((fiiDividend) => {
      return Object.values(fiiDividend.monthlyDividends);
    })
    .flat();

  if (!filterDateFn) return dividendsAsArray;

  return dividendsAsArray
    .filter(({ date }) => filterDateFn(new Date(date)))
    .map((dividend) => ({
      ...dividend,
    }));
};
