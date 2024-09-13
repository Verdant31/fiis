import { useEffect, useState } from "react";
import { useWindowSize } from "./use-window-size";

export function useTablePagination() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const windowWidth = useWindowSize()?.width ?? 0;

  useEffect(() => {
    if (windowWidth < 640) {
      setPagination({
        pageIndex: 0,
        pageSize: 7,
      });
    } else {
      setPagination({
        pageIndex: 0,
        pageSize: 9,
      });
    }
  }, [windowWidth]);

  return {
    pagination,
    setPagination,
  };
}
