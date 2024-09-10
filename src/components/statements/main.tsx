import { useStatementsFilterContext } from "@/contexts/StatementsFilters";
import { FiisController } from "@/controllers/fii";
import { FiiDividends } from "@/queries/use-fiis-dividends";
import { FiisOperation } from "@/types/fiis";

interface Props {
  dividends: FiiDividends[];
  operations: FiisOperation[];
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
  return <div>{JSON.stringify(data)}</div>;
}
