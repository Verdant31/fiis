/* eslint-disable react/no-unescaped-entities */
/* eslint-disable jsx-a11y/alt-text */
"use client";
import { tw } from "./styles";
import { FiiGroupedOperations } from "@/types/fiis";
import { Image, Text, View } from "@react-pdf/renderer";
import { format } from "date-fns";
import { currencyFormatter } from "@/utils/currency-formatter";
import { FiisOperations } from "@prisma/client";
import { OperationText } from "@/components/operation-type-card";

interface Props {
  operations: FiiGroupedOperations[];
  extractedOperations: FiisOperations[];
}

enum OperationTypeImageUrl {
  "purchase" = "ArrowUpCircle.png",
  "sale" = "ArrowDownCircle.png",
  "unfolding" = "Info.png",
}

export function Operations({ extractedOperations }: Props) {
  return (
    <View style={tw("flex flex-col mt-4")}>
      <View
        style={tw(
          "flex flex-row bg-customPurple pt-[7px] pb-[3px] px-4 rounded-sm",
        )}
      >
        <Text style={tw("text-white font-medium w-[90px] ")}>Fundo</Text>
        <Text style={tw("text-white font-medium w-[125px]")}>
          Data da operação
        </Text>
        <Text style={tw("text-white font-medium w-[60px]")}>Cotas</Text>
        <Text style={tw("text-white font-medium w-[90px]")}>Cotação</Text>
        <Text style={tw("text-white font-medium w-[105px]")}>
          Tipo da operação
        </Text>
      </View>

      {extractedOperations.map((item) => (
        <View
          key={item.fiiName}
          style={tw(
            "flex flex-row border-b-[1px] border-b-black pt-[7px] pb-[3px] px-4",
          )}
        >
          <Text style={tw("w-[90px] ")}>{item?.fiiName}</Text>
          <Text style={tw("w-[125px]")}>
            {format(new Date(item?.date), "dd/MM/yyyy")}
          </Text>
          <Text style={tw("w-[60px]")}>{item?.qty}</Text>
          <Text style={tw("w-[90px]")}>
            {item?.type === "unfolding"
              ? "N/A"
              : currencyFormatter(item?.quotationValue)}
          </Text>
          <View style={tw("w-[105px] flex flex-row items-center gap-3")}>
            <Image
              style={{ width: 12, height: 12 }}
              src={
                OperationTypeImageUrl[
                  item?.type as keyof typeof OperationTypeImageUrl
                ]
              }
            />
            <Text style={tw("pt-1")}>{OperationText[item?.type]}</Text>
          </View>
        </View>
      ))}
      <View style={tw("mt-8")}>
        <Text style={tw("pt-1 font-semibold text-customPurple ")}>
          OBSERVAÇÃO
        </Text>
        <Text>
          Para as operações do tipo "Desdobramento", a coluna de cotas se refere
          a proporção do desdobramento. Ex: Uma cota passou a valer X (Valor da
          coluna) cotas.
        </Text>
      </View>
    </View>
  );
}
