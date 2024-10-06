"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableDataType } from "@/types/extracts";
import SelectInterval from "@/components/select-interval";
import { useStatementsFilterContext } from "@/contexts/StatementsFilters";

export function StatementsFilters() {
  const {
    setIntervalValue,
    setTableDataType,
    filters: { intervalType, tableDataType },
  } = useStatementsFilterContext();

  return (
    <div className="lg:flex lg:items-center lg:mt-8 gap-6 items-baseline">
      <div className="flex items-center gap-6 mt-6 lg:m-0">
        <div className="w-full">
          <p className="mb-2 font-medium">Mês</p>
          <SelectInterval
            setIntervalValue={setIntervalValue}
            interval={intervalType}
          />
        </div>
        <div className="w-full">
          <p className="mb-2 font-medium">Dados do extrato</p>
          <div>
            <Select
              defaultValue={tableDataType}
              onValueChange={(value) =>
                setTableDataType(value as TableDataType)
              }
              value={tableDataType}
            >
              <SelectTrigger className="w-full lg:w-[150px] max-w-[300px] rounded-lg focus:ring-0 focus:ring-offset-0">
                <SelectValue placeholder="Nenhum" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="dividends" className="rounded-lg">
                  Rendimento
                </SelectItem>
                <SelectItem value="operations" className="rounded-lg">
                  Operações
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
