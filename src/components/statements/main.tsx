import { useStatementsFilterContext } from "@/contexts/StatementsFilters";
import { FiisController } from "@/controllers/fii";
import { FiiDividends, FiiGroupedOperations } from "@/types/fiis";

interface Props {
  dividends: FiiDividends[];
  operations: FiiGroupedOperations[];
}

export function StatementsMain({ dividends, operations }: Props) {
  const { filters } = useStatementsFilterContext();

  const fiis = new FiisController({
    dividends,
    operations,
  });

  const data =
    filters.tableDataType === "dividends"
      ? fiis.getDividendsStatements(filters)
      : fiis.getOperationsStatements(filters);

  console.log(data);

  // const table = useReactTable({
  //   data,
  //   columns: [],
  // });

  return <div className="w-[50%] break-words">{JSON.stringify(data)}</div>;
}
