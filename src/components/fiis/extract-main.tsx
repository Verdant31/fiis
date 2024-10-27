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
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Download,
  Eraser,
  Info,
} from "lucide-react";
import { FiisOperations } from "@prisma/client";
import { useTablePagination } from "@/hooks/use-table-pagination.ts";
import { Button } from "../ui/button";
import { format } from "date-fns";
import { currencyFormatter } from "@/utils/currency-formatter";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import { FiisExtractsPdf } from "../pdf/fiis-extracts";

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

  const handleStartExtract = async () => {
    const fileName = "extrato.pdf";
    const { data: session } = await api.get("/me");

    if (!session?.user?.email) {
      toast.info("Você precisa estar logado para baixar o extrato");
      return;
    }

    const component = (
      <FiisExtractsPdf
        userEmail={session.user.email as string}
        operations={operations as FiiGroupedOperations[]}
        extractedData={data as Dividend[] | FiisOperations[]}
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
        </Button>{" "}
        <Button
          onClick={clearFilters}
          className="items-center w-[50%] shrink-0 flex gap-4 max-w-[225px] lg:w-auto"
        >
          <Eraser size={20} />
          Limpar
        </Button>
      </div>
      <div className="mt-4 lg:h-[600px]">
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
  const { pagination, setPagination } = useTablePagination({
    initialpageSize: 9,
    mobilePageSize: 7,
  });

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

  const { pageIndex, pageSize } = pagination;

  const partialData = data.slice(
    pageIndex * pageSize,
    pageIndex * pageSize + pageSize,
  );

  const handleNextPage = () => {
    if (pageIndex * pageSize + pageSize >= data.length) return;
    setPagination({
      pageIndex: pageIndex + 1,
      pageSize,
    });
  };

  const handlePreviousPage = () => {
    if (pageIndex === 0) return;
    setPagination({
      pageIndex: pageIndex - 1,
      pageSize,
    });
  };

  return (
    <div className="h-full">
      {partialData.length > 0 && (
        <p className="mb-2">
          <strong>Total:</strong>{" "}
          {currencyFormatter(
            data.reduce((acc, fii) => {
              return acc + fii.total;
            }, 0),
          )}
        </p>
      )}
      <div className="mini-sm:hidden block">
        {partialData.length > 0 ? (
          <div>
            <div className="space-y-4 ">
              {partialData.map((dividend) => {
                return (
                  <div
                    key={dividend.fiiName}
                    className="border-[1px] rounded-md py-3 px-4 border-zinc-800 pb-2"
                  >
                    <div className="flex justify-between items-center">
                      <p>
                        <strong>Fundo:</strong> {dividend.fiiName}
                      </p>
                      <p>
                        <strong>Total:</strong>{" "}
                        {currencyFormatter(dividend.total)}
                      </p>
                    </div>
                    <div className="text-sm flex justify-between items-center">
                      <p>
                        Por cota: {currencyFormatter(dividend.paymentPerQuote)}
                      </p>
                      <p>{format(dividend.date, "dd/MM/yyyy")}</p>
                    </div>
                    <div className="text-sm flex justify-between items-center">
                      <p>Cotas: {dividend.quotesAtPayment}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="my-4 flex items-center justify-end gap-4">
              <Button
                variant="outline"
                className="w-36"
                onClick={handlePreviousPage}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                className="w-36"
                onClick={handleNextPage}
              >
                Próxima
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center my-8 text-zinc-300">
            Não foi possível encontrar resultados com os filtros selecionados.
          </div>
        )}
      </div>

      <DataTable className="mini-sm:block hidden lg:h-full" table={table} />
    </div>
  );
};

const OperationsTable = ({ data }: { data: FiisOperations[] }) => {
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
