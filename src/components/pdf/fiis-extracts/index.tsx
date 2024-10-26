/* eslint-disable jsx-a11y/alt-text */
"use client";
import { Dividend, FiiGroupedOperations } from "@/types/fiis";
import { FiisOperations } from "@prisma/client";
import { Page, Text, View, Document, Image } from "@react-pdf/renderer";
import { format } from "date-fns";
import { tw } from "./styles";
import { Dividends } from "./dividends";
import {
  IntervalsFilterType,
  IntervalsValueType,
  TableDataType,
} from "@/types/extracts";
import { Operations } from "./operations";
import { DateInRangeModeType } from "@/components/select-interval";
import { ptBR } from "date-fns/locale";

interface Props {
  operations: FiiGroupedOperations[];
  extractedData: Dividend[] | FiisOperations[];
  userEmail: string;
  filters: {
    intervalType: IntervalsFilterType;
    intervalValue: IntervalsValueType | undefined;
    fiiName: string | undefined;
    tableDataType: TableDataType;
  };
}

export function FiisExtractsPdf({
  operations,
  userEmail,
  filters,
  extractedData,
}: Props) {
  const dataType = filters?.tableDataType;
  const title = `Meu Extrato de ${
    dataType === "dividends" ? "Dividendos" : "Operações"
  }`;

  const logoUrl = process.env.NEXT_PUBLIC_APP_URL + "/pdf-logo.png";

  const displayIntervalValue = (): string => {
    if (filters.intervalType === "Personalizado") {
      const { from, to } = filters.intervalValue as DateInRangeModeType;
      return `De ${from} Até ${to}`;
    }
    if (filters.intervalType === "Mês") {
      return format(filters.intervalValue as Date, "MMMM", {
        locale: ptBR,
      });
    }
    return filters.intervalValue as string;
  };

  return (
    // <PDFViewer className="w-full h-[100vh]">
    <Document>
      <Page
        size="A4"
        wrap
        style={tw("bg-white text-black pt-5 px-5 font-sans text-base")}
      >
        <View
          style={tw(
            "flex items-center justify-between px-8 pb-5 flex-row border-b-[1px] border-customPurple",
          )}
        >
          <Text style={tw("text-3xl w-52 leading-5")}>{title}</Text>
          <View style={tw("flex items-center flex-row gap-2.5")}>
            <Image src={logoUrl} style={{ height: 80, width: 90 }} />
            <View>
              <Text style={tw("font-extrabold text-[20px]")}>STOCKS.TR</Text>
              <Text style={tw("w-[150px] font-light text-sm m-0 p-0")}>
                Seus investimentos sempre ao seu alcance.
              </Text>
            </View>
          </View>
        </View>
        <View style={tw("mt-5 px-2.5")}>
          <Text>
            Emissão feita em {format(new Date(), "dd/MM/yyyy hh:mm")} por{" "}
            {userEmail}
          </Text>
          <View style={tw("mt-2")}>
            <Text style={tw("pt-1 font-semibold text-customPurple ")}>
              Filtros aplicados na extração
            </Text>
            <View>
              <Text>Nome do fundo: {filters.fiiName ?? "N/A"}</Text>
              <Text>Tipo de periódo: {filters.intervalType ?? "N/A"}</Text>
              <Text style={tw("capitalize")}>
                Periódo: {displayIntervalValue()}
              </Text>
            </View>
          </View>
          {dataType === "dividends" ? (
            <Dividends
              extractedDividends={extractedData as Dividend[]}
              operations={operations}
            />
          ) : (
            <Operations
              extractedOperations={extractedData as FiisOperations[]}
              operations={operations}
            />
          )}
        </View>
      </Page>
    </Document>
    // </PDFViewer>
  );
}
