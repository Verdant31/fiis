/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useWindowSize } from "./use-window-size";

interface Props {
  initialpageSize: number;
  mobilePageSize?: number;
  data?: any[];
}

export function useTablePagination({
  mobilePageSize,
  initialpageSize,
  data = [],
}: Props) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: initialpageSize,
  });

  const windowWidth = useWindowSize()?.width ?? 0;

  useEffect(() => {
    if (!mobilePageSize) return;

    if (windowWidth < 640) {
      setPagination({
        pageIndex: 0,
        pageSize: mobilePageSize,
      });
    } else {
      setPagination({
        pageIndex: 0,
        pageSize,
      });
    }
  }, [windowWidth]);

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
    pagination,
    setPagination,
    partialData,
    handleNextPage,
    handlePreviousPage,
  };
}
