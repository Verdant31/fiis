import {
  dividendsStatementColumns,
  operationsStatementColumns,
} from "@/app/dashboard/fiis/statements/columns";
import { useStatementsFilterContext } from "@/contexts/StatementsFilters";
import { FiisController } from "@/controllers/fii";
import { Dividend, FiiDividends, FiiGroupedOperations } from "@/types/fiis";
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  TableState,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { DataTable } from "../table";
import { ArrowDownCircle, ArrowUpCircle, Info } from "lucide-react";
import { FiisOperations } from "@prisma/client";
import { useTablePagination } from "@/hooks/use-table-pagination.ts";

interface Props {
  dividends: FiiDividends[];
  operations: FiiGroupedOperations[];
}

export function StatementsMain({ dividends, operations }: Props) {
  const fiis = new FiisController({
    dividends,
    operations,
  });

  const { filters } = useStatementsFilterContext();

  const data =
    filters.tableDataType === "dividends"
      ? fiis.getDividendsStatements(filters)
      : fiis.getOperationsStatements(filters);

  return (
    <div className="mt-6 lg:h-[600px]">
      {filters.tableDataType === "dividends" ? (
        <DividendsTable data={data as Dividend[]} />
      ) : (
        <OperationsTable data={data as FiisOperations[]} />
      )}
    </div>
  );
}

const DividendsTable = ({ data }: { data: Dividend[] }) => {
  const [operationsSorting, setOperationsSorting] = useState<SortingState>([]);
  const { pagination, setPagination } = useTablePagination();

  const table = useReactTable({
    data,
    columns: dividendsStatementColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setOperationsSorting,
    getSortedRowModel: getSortedRowModel(),
    onPaginationChange: setPagination,
    state: {
      sorting: operationsSorting,
      pagination,
    } as Partial<TableState>,
  });

  return <DataTable className="lg:h-full" table={table} />;
};

const OperationsTable = ({ data }: { data: FiisOperations[] }) => {
  const [operationsSorting, setOperationsSorting] = useState<SortingState>([]);
  const { pagination, setPagination } = useTablePagination();

  const table = useReactTable({
    data,
    columns: operationsStatementColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setOperationsSorting,
    getSortedRowModel: getSortedRowModel(),
    onPaginationChange: setPagination,
    state: {
      sorting: operationsSorting,
      pagination,
    } as Partial<TableState>,
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
      <DataTable className="lg:h-full" table={table} />
    </div>
  );
};
