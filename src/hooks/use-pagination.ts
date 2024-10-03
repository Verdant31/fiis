/* eslint-disable @typescript-eslint/no-explicit-any */
import { useTablePagination } from "./use-table-pagination.ts";

export const usePagination = ({ data = [] }: { data?: any[] }) => {
  const { pagination, setPagination } = useTablePagination();

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

  return {
    partialData,
    handleNextPage,
    handlePreviousPage,
    pageIndex,
  };
};
