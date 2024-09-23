import {
  IntervalsFilterType,
  IntervalsValueType,
  TableDataType,
} from "@/types/extracts";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

export type StatementsFilterState = {
  filters: {
    intervalType: IntervalsFilterType;
    intervalValue: IntervalsValueType | undefined;
    fiiName: string | undefined;
    tableDataType: TableDataType;
  };
  resetedFilters: boolean;
};

type StatementsFilterActions = {
  setIntervalValue: Dispatch<SetStateAction<IntervalsValueType | undefined>>;
  setFiiName: Dispatch<SetStateAction<string | undefined>>;
  setIntervalTupe: Dispatch<SetStateAction<IntervalsFilterType>>;
  setTableDataType: Dispatch<SetStateAction<TableDataType>>;
  setResetedFilters: Dispatch<SetStateAction<boolean>>;
  clearFilters: () => void;
};

export const StatementsFilterContext = createContext(
  {} as StatementsFilterState & StatementsFilterActions,
);

export const StatementsFilterContextProvider = (props: {
  children: ReactNode;
}) => {
  const [resetedFilters, setResetedFilters] = useState(false);
  const [intervalType, setIntervalTupe] = useState<IntervalsFilterType>("Mês");
  const [intervalValue, setIntervalValue] = useState<
    IntervalsValueType | undefined
  >(new Date());
  const [fiiName, setFiiName] = useState<string>();
  const [tableDataType, setTableDataType] =
    useState<TableDataType>("dividends");

  const clearFilters = () => {
    setIntervalTupe("Mês");
    setIntervalValue(new Date());
    setFiiName(undefined);
    setTableDataType("dividends");
    setResetedFilters((p) => !p);
  };

  return (
    <StatementsFilterContext.Provider
      value={{
        filters: {
          intervalType,
          intervalValue,
          fiiName,
          tableDataType,
        },
        resetedFilters,
        setIntervalTupe,
        setResetedFilters,
        clearFilters,
        setIntervalValue,
        setFiiName,
        setTableDataType,
      }}
    >
      {props.children}
    </StatementsFilterContext.Provider>
  );
};

export const useStatementsFilterContext = () => {
  const value = useContext(StatementsFilterContext);
  return value;
};
