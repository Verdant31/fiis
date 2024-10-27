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
import { Download, Eraser } from "lucide-react";
import { useTablePagination } from "@/hooks/use-table-pagination.ts";
import { Button } from "../ui/button";
import { FixedIncomeWithEvolution } from "@/types/fixed-income";
import { getFixedIncomeStatementData } from "@/helpers/fixed-income-statements-data";
import { FixedIncomeExtractsPdf } from "../pdf/fixed-income-extracts";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";

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

  const { filters } = useStatementsFilterContext();

  const handleStartExtract = async () => {
    const fileName = "extrato.pdf";
    const { data: session } = await api.get("/me");

    if (!session?.user?.email) {
      toast.info("Você precisa estar logado para baixar o extrato");
      return;
    }

    const component = (
      <FixedIncomeExtractsPdf
        userEmail={session.user.email as string}
        operations={operations as FixedIncomeWithEvolution[]}
        extractedData={tableData as FixedIncomeWithEvolution[]}
        filters={filters}
      />
    );

    const blob = await pdf(component).toBlob();

    saveAs(blob, fileName);
  };

  return (
    <div>
      <div className="flex items-center pr-6 gap-6 mt-4 lg:absolute lg:right-0 lg:top-[82.5px]">
        <Button
          onClick={handleStartExtract}
          className="items-center w-[50%] shrink-0 flex gap-4 max-w-[225px] lg:w-auto"
        >
          <Download size={20} />
          Extrair
        </Button>

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
