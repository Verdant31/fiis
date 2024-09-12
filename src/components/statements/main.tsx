import {
  dividendsStatementColumns,
  operationsStatementColumns,
} from "@/app/dashboard/fiis/statements/columns";
import { useStatementsFilterContext } from "@/contexts/StatementsFilters";
import { FiisController } from "@/controllers/fii";
import { FiiDividends, FiiGroupedOperations } from "@/types/fiis";
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { DataTable } from "../table";
import { ArrowDownCircle, ArrowUpCircle, Info } from "lucide-react";

interface Props {
  dividends: FiiDividends[];
  operations: FiiGroupedOperations[];
}

export function StatementsMain({ dividends, operations }: Props) {
  const [operationsSorting, setOperationsSorting] = useState<SortingState>([]);

  const { filters } = useStatementsFilterContext();

  const fiis = new FiisController({
    dividends,
    operations,
  });

  const DividendsTable = () => {
    const data = fiis.getDividendsStatements(filters);
    const table = useReactTable({
      data,
      columns: dividendsStatementColumns,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      onSortingChange: setOperationsSorting,
      getSortedRowModel: getSortedRowModel(),
      state: {
        sorting: operationsSorting,
      },
    });

    return <DataTable table={table} />;
  };

  const OperationsTable = () => {
    const data = fiis.getOperationsStatements(filters);
    const table = useReactTable({
      data,
      columns: operationsStatementColumns,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      onSortingChange: setOperationsSorting,
      getSortedRowModel: getSortedRowModel(),
      state: {
        sorting: operationsSorting,
      },
    });

    return (
      <div>
        {data.length > 0 && (
          <div className={`flex items-center gap-4 mb-4 mini:hidden `}>
            <div className="flex items-center gap-2 text-sm">
              <ArrowDownCircle className="text-[#ed2846]" size={20} />
              Venda
            </div>
            <div className="flex items-center gap-2 text-sm">
              <ArrowUpCircle className="text-green-500" size={20} />
              Compra
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Info className="text-blue-500" size={20} />
              Desdobramento
            </div>
          </div>
        )}
        <DataTable table={table} />
      </div>
    );
  };

  return (
    <div className="mt-6 ">
      {filters.tableDataType === "dividends" ? (
        <DividendsTable />
      ) : (
        <OperationsTable />
      )}
    </div>
  );
}
