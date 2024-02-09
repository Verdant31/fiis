import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
export const revalidate = 0;
import _ from 'lodash';
import { compareDates } from "@/lib/utils";

export async function GET() {
  try {
    const fiis = await prisma.fiisPurchases.findMany();
    const payments = await prisma.payment.findMany();

    const groupedPayments = _.groupBy(payments, 'fiiName');
    const groupedFiis = _.groupBy(fiis, 'fiiName');
    const fiisNames = Object.keys(groupedFiis);

    let formatedFiis = [];
    for(const name of fiisNames) {
      const quantity = _.sumBy(groupedFiis[name], 'qty');
      const firstFii = groupedFiis[name][0];
      formatedFiis.push({
        id: firstFii?.id,
        name, 
        quantity,
        purchases: groupedFiis[name],
        payments: groupedPayments[name]?.sort(compareDates), 
        quotationValue: firstFii?.quotationValue,
        initialValue: firstFii?.initialValue,
       });
    }

    return NextResponse.json({ status: 200, fiis:formatedFiis });
  } catch (err) {
    console.log("err", err);
    return NextResponse.json({ message: "Interal error", status: 500 });
  }
}
