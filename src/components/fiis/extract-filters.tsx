"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IntervalsFilterType, TableDataType } from "@/types/extracts";
import SelectInterval from "@/components/select-interval";
import { useStatementsFilterContext } from "@/contexts/StatementsFilters";

const intervalsFilterOptions = ["Dias", "Mês", "Ano", "Todos", "Personalizado"];

interface Props {
  fiis: string[];
}

export function StatementsFilters({ fiis }: Props) {
  const {
    setFiiName,
    setIntervalTupe,
    setIntervalValue,
    setTableDataType,
    filters: { fiiName, intervalType, tableDataType },
  } = useStatementsFilterContext();

  return (
    <div className="lg:flex lg:items-center lg:mt-8 gap-6 items-baseline">
      <div className="flex items-center gap-6 mt-6 lg:m-0">
        <div>
          <p className="mb-2 font-medium">Período</p>
          <div>
            <Select
              defaultValue={intervalType}
              onValueChange={(value) =>
                setIntervalTupe(value as IntervalsFilterType)
              }
              value={intervalType}
            >
              <SelectTrigger
                className="w-[150px] rounded-lg focus:ring-0 focus:ring-offset-0"
                aria-label="Select a value"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {intervalsFilterOptions.map((option) => (
                  <SelectItem
                    key={option}
                    value={option}
                    className="rounded-lg"
                  >
                    {option.split(".SA")[0]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="w-full">
          {intervalType !== "Todos" && (
            <p className="mb-2 font-medium">{intervalType}</p>
          )}
          <SelectInterval
            setIntervalValue={setIntervalValue}
            interval={intervalType}
          />
        </div>
      </div>
      <div className="flex items-center gap-6 mt-4 lg:m-0">
        <div>
          <p className="mb-2 font-medium">Ativo</p>
          <div>
            <Select
              defaultValue={fiis[0]}
              onValueChange={(value) => setFiiName(value)}
              value={fiiName ?? fiis[0]}
            >
              <SelectTrigger className="w-[150px] rounded-lg focus:ring-0 focus:ring-offset-0">
                <SelectValue placeholder="Nenhum" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {fiis.map((option) => (
                  <SelectItem
                    key={option}
                    value={option}
                    className="rounded-lg"
                  >
                    {option.split(".SA")[0]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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
                  Dividendos
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
