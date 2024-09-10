"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useFiisDividends } from "@/queries/use-fiis-dividends";
import { FiisController } from "@/controllers/fii";
import {
  IntervalsFilterType,
  IntervalsValueType,
  TableDataType,
} from "@/types/statements";
import SelectInterval from "@/components/select-interval";
import { useFiisOperations } from "@/queries/use-fiis-operations";

const intervalsFilterOptions = ["Dias", "Mês", "Ano", "Todos", "Personalizado"];

export default function Statements() {
  const [intervalType, setIntervalTupe] = useState<IntervalsFilterType>("Mês");
  const [intervalValue, setIntervalValue] = useState<
    IntervalsValueType | undefined
  >(new Date());
  const [fiiName, setFiiName] = useState<string>();
  const [tableDataType, setTableDataType] =
    useState<TableDataType>("dividends");

  const { data: dividends, isLoading } = useFiisDividends();
  const { data: operations, isLoading: isLoadingOperations } =
    useFiisOperations();

  if (isLoading || isLoadingOperations) return null;

  const fiis = ["Nenhum", ...(dividends?.map((fii) => fii.fiiName) ?? [])];
  const data = new FiisController({
    dividends,
    operations,
  }).getDataToStatements({
    intervalType,
    intervalValue,
    fiiName,
    tableDataType,
  });
  console.log(data);

  return (
    <main className="mx-6 mt-6">
      <h1 className="text-3xl font-semibold text-center">Extratos</h1>
      <div className="flex items-center gap-6 mt-6 ">
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
      <div className="flex items-center gap-6 mt-4 ">
        <div>
          <p className="mb-2 font-medium">Ativo</p>
          <div>
            <Select
              defaultValue={fiis[0]}
              onValueChange={(value) => setFiiName(value)}
              value={fiiName}
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
              <SelectTrigger className="w-full rounded-lg focus:ring-0 focus:ring-offset-0">
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
    </main>
  );
}
