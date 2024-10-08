/* eslint-disable @typescript-eslint/no-explicit-any */
import { operationsStatementColumns } from "@/app/dashboard/fixed-income/extracts/columns";
import { useStatementsFilterContext } from "@/contexts/StatementsFilters";
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
import { Eraser } from "lucide-react";
import { useTablePagination } from "@/hooks/use-table-pagination.ts";
import { Button } from "../ui/button";
import ExtractOptionModal from "../fiis/extract-method-modal";
import { FixedIncomeWithEvolution } from "@/types/fixed-income";
import { getFixedIncomeStatementData } from "@/helpers/fixed-income-statements-data";

interface Props {
  operations: FixedIncomeWithEvolution[];
}

export function StatementsMain({ operations }: Props) {
  const {
    filters: { tableDataType, intervalValue },
    clearFilters,
  } = useStatementsFilterContext();

  const tableData = getFixedIncomeStatementData({
    tableDataType,
    intervalValue: intervalValue as Date,
    operations,
  });

  return (
    <div>
      <div className="flex items-center pr-6 gap-6 mt-4 lg:absolute lg:right-0 lg:top-[82.5px]">
        <ExtractOptionModal
          operations={operations}
          data={tableData as FixedIncomeWithEvolution[]}
        />
        <Button
          onClick={clearFilters}
          className="items-center w-[50%] shrink-0 flex gap-4 max-w-[225px] lg:w-auto"
        >
          <Eraser size={20} />
          Limpar
        </Button>
      </div>
      <div className="mt-4 lg:h-[600px]">
        <IncomesTable data={tableData as FixedIncomeWithEvolution[]} />
      </div>
    </div>
  );
}

const IncomesTable = ({ data }: { data: FixedIncomeWithEvolution[] }) => {
  const [operationsSorting, setOperationsSorting] = useState<SortingState>([]);
  const { pagination, setPagination } = useTablePagination({
    initialpageSize: 9,
    mobilePageSize: 7,
  });

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

  return <DataTable className="lg:h-full" table={table} />;
};
