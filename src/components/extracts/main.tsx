import {
  dividendsStatementColumns,
  operationsStatementColumns,
} from "@/app/dashboard/fiis/extracts/columns";
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
import { ArrowDownCircle, ArrowUpCircle, Eraser, Info } from "lucide-react";
import { FiisOperations } from "@prisma/client";
import { useTablePagination } from "@/hooks/use-table-pagination.ts";
import { Button } from "../ui/button";
import ExtractOptionModal from "./extract-method-modal";

interface Props {
  dividends: FiiDividends[];
  operations: FiiGroupedOperations[];
}

export function StatementsMain({ dividends, operations }: Props) {
  const fiis = new FiisController({
    dividends,
    operations,
  });

  const { filters, clearFilters } = useStatementsFilterContext();

  const data =
    filters.tableDataType === "dividends"
      ? fiis.getDividendsStatements(filters)
      : fiis.getOperationsStatements(filters);

  return (
    <div>
      <div className="flex items-center pr-6 gap-6 mt-4 lg:absolute lg:right-0 lg:top-[82.5px]">
        <ExtractOptionModal operations={operations} data={data} />
        <Button
          onClick={clearFilters}
          className="items-center w-[50%] shrink-0 flex gap-4 max-w-[225px] lg:w-auto"
        >
          <Eraser size={20} />
          Limpar
        </Button>
      </div>
      <div className="mt-6  lg:h-[600px]">
        {filters.tableDataType === "dividends" ? (
          <DividendsTable data={data as Dividend[]} />
        ) : (
          <OperationsTable data={data as FiisOperations[]} />
        )}
      </div>
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
