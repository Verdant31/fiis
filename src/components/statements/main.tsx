import { useStatementsFilterContext } from "@/contexts/StatementsFilters";
import { FiisController } from "@/controllers/fii";
import { FiiDividends, FiiGroupedOperations } from "@/types/fiis";

interface Props {
  dividends: FiiDividends[];
  operations: FiiGroupedOperations[];
}

export function StatementsMain({ dividends, operations }: Props) {
  const { fiiName, intervalType, tableDataType, intervalValue } =
    useStatementsFilterContext();

  const data = new FiisController({
    dividends,
    operations,
  }).getDataToStatements({
    intervalType,
    intervalValue,
    fiiName,
    tableDataType,
  });

  console.log(data);

  // const table = useReactTable({
  //   data,
  //   columns: [],
  // });
  return <div>{/* <DataTable table={table} /> */}</div>;
}
