"use client";
import { Button } from "@/components/ui/button";
import { getFiis } from "@/queries/getFiis";
import { formatPayments } from "@/utils/formatPayments";
import { getMonthName } from "@/utils/getMonthName";
import { sortByMonth } from "@/utils/sortByMonth";
import { useQuery } from "@tanstack/react-query";
import _ from "lodash";
import { useState } from "react";
import { BarLoader } from "react-spinners";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BRL } from "@/utils/intlBr";
import React from "react";


export default function Payments() {
  const [activeMonth, setActiveMonth] = useState("");
  const { data: fiis, isLoading } = useQuery(["get-fiis-key"], {
    queryFn: async () =>  await getFiis(),
    cacheTime: 0,
    refetchOnWindowFocus: true,
  });

  if(isLoading) {
    return (
      <div className="flex items-center justify-center mt-44">
        <BarLoader color="#adfa1d" width={300} />
      </div>
    )
  }

  const allPayments = formatPayments(fiis)

  const groupedPaymentsByMonth = _.groupBy(allPayments, (payment) => getMonthName(payment.date.split("/")[1]));
  const months = sortByMonth(Object.keys(groupedPaymentsByMonth))

  const currentMonthPayments = groupedPaymentsByMonth[activeMonth] || [];
  const monthTotal = currentMonthPayments.reduce((acc, payment) => acc + payment.quotesQuantityAtThePayment * payment.paidPerQuote, 0);
  const fiisThatNotPaid = fiis?.filter((fii) => !currentMonthPayments.some((payment) => payment.fiiName === fii.name));

  return (
    <main className="w-full mt-12">
      <h1 className="text-2xl font-extrabold">Select the month you want to see FII payments</h1>
      <div className="flex items-center gap-6 my-8"> 
        {months.map((month) => (
          <Button 
            key={month}
            onClick={() => setActiveMonth(month)}
            className="bg-zinc-900 text-white w-40 hover:bg-zinc-800"
            {...(month === activeMonth && {
              style: {
                outline: "1px solid white",
              }
            })}
          >
            {month}
          </Button>
        ))} 
      </div>
      {activeMonth && (
        <React.Fragment>
          <div className="flex flex-col space-y-1">
        <span className="text-lg"><span className="font-semibold">Total paid: </span> {BRL.format(monthTotal)}</span>
        <span className="text-lg"><span className="font-semibold">Remainin FII's: </span> 
          {fiisThatNotPaid?.map(fii => fii.name).join(", ")}
        </span>
          </div>
          <Table className="mt-4 w-[700px]">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Paid per quote</TableHead>
                <TableHead>Total quotes at payment</TableHead>
                <TableHead>Total paid</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentMonthPayments?.map((payment) => {
                return (
                  <TableRow className="cursor-pointer" key={payment.id}>
                    <TableCell className="font-medium">{payment.fiiName}</TableCell>
                    <TableCell>{BRL.format(payment.paidPerQuote)}</TableCell>
                    <TableCell>{payment.quotesQuantityAtThePayment}</TableCell>
                    <TableCell>{BRL.format(payment.quotesQuantityAtThePayment * payment.paidPerQuote)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </React.Fragment>
      )}
    </main>
  );
}
