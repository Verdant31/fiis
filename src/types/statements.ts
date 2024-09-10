import { DateInRangeModeType } from "@/components/select-interval";

export type IntervalsFilterType =
  | "Dias"
  | "Mês"
  | "Ano"
  | "Todos"
  | "Personalizado";
export type TableDataType = "dividends" | "operations";
export type IntervalsValueType = string | Date | DateInRangeModeType;

export interface StatementsFiltersData {
  intervalType: IntervalsFilterType;
  intervalValue?: IntervalsValueType;
  fiiName?: string;
  tableDataType: TableDataType;
}
