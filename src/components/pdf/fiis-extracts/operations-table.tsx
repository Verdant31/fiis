"use client";
import { tw } from "./styles";
import { Dividend } from "@/types/fiis";
import { Text, View } from "@react-pdf/renderer";
import { format } from "date-fns";

import { currencyFormatter } from "@/utils/currency-formatter";
import { FiisOperations } from "@prisma/client";

export default function OperationsTable({
  operations,
}: {
  operations: FiisOperations[];
}) {
  return (
    <View style={tw("flex flex-col mt-4")}>
      <View style={tw("flex flex-row bg-customPurple pt-[7px] pb-[3px] px-4")}>
        <Text style={tw("text-white font-medium w-[60px]")}>Cotas</Text>
        <Text style={tw("text-white font-medium w-[95px]")}>Pago p/ cota</Text>
        <Text style={tw("text-white font-medium w-[75px]")}>Total</Text>
        <Text style={tw("text-white font-medium w-[90px]")}>Data</Text>
        <Text style={tw("text-white font-medium w-[105px]")}>
          Total investido
        </Text>
        <Text style={tw("text-white font-medium")}>Total recebido</Text>
      </View>
      {operations.map((item) => (
        <View
          key={item.fiiName}
          style={tw(
            "flex flex-row border-b-[1px] border-b-black pt-[7px] pb-[3px] px-4",
          )}
        >
          <Text style={tw("w-[60px]")}>{item?.quotesAtPayment}</Text>
          <Text style={tw("w-[95px]")}>
            {currencyFormatter(item?.paymentPerQuote)}
          </Text>
          <Text style={tw("w-[75px]")}>{currencyFormatter(item?.total)}</Text>
          <Text style={tw("w-[90px]")}>
            {format(new Date(item.date), "dd/MM/yyyy")}
          </Text>
          <Text style={tw("w-[105px]")}>R$ 105.000,00</Text>
          <Text>R$ 999.999,99</Text>
        </View>
      ))}
    </View>
  );
}
