import {
  IntervalsFilterType,
  IntervalsValueType,
  TableDataType,
} from "@/types/statements";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

type StatementsFilterState = {
  filters: {
    intervalType: IntervalsFilterType;
    intervalValue: IntervalsValueType | undefined;
    fiiName: string | undefined;
    tableDataType: TableDataType;
  };
};

type StatementsFilterActions = {
  setIntervalValue: Dispatch<SetStateAction<IntervalsValueType | undefined>>;
  setFiiName: Dispatch<SetStateAction<string | undefined>>;
  setIntervalTupe: Dispatch<SetStateAction<IntervalsFilterType>>;
  setTableDataType: Dispatch<SetStateAction<TableDataType>>;
};

export const StatementsFilterContext = createContext(
  {} as StatementsFilterState & StatementsFilterActions,
);

export const StatementsFilterContextProvider = (props: {
  children: ReactNode;
}) => {
  const [intervalType, setIntervalTupe] = useState<IntervalsFilterType>("Mês");
  const [intervalValue, setIntervalValue] = useState<
    IntervalsValueType | undefined
  >(new Date());
  const [fiiName, setFiiName] = useState<string>();
  const [tableDataType, setTableDataType] =
    useState<TableDataType>("dividends");

  return (
    <StatementsFilterContext.Provider
      value={{
        filters: {
          intervalType,
          intervalValue,
          fiiName,
          tableDataType,
        },
        setIntervalTupe,
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
