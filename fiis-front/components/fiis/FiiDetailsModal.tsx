"use client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { BRL } from "@/utils/intlBr";
import { Dispatch, SetStateAction } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Fii } from "@/lib/types";

interface FiiDetailsModalProps {
  fii: Fii;
  setIsOpen: Dispatch<SetStateAction<Fii | undefined>>;
}

export function FiiDetailsModal({ setIsOpen, fii }: FiiDetailsModalProps) {
  const isOpen = !!fii;
  const payments = fii.payments;
  const purchases = fii.purchases;

  const totalIncome = payments?.reduce((acc, payment) => {
    return acc + (payment.quotesQuantityAtThePayment * payment.paidPerQuote);
  }, 0) ?? 0;

  const totalQuotes = purchases?.reduce((acc, purchase) => {
    return acc + purchase.qty;
  }, 0) ?? 0;

  const totalPurchased = purchases?.reduce((acc, purchase) => {
    return acc + purchase.qty * purchase.quotationValue;
  }, 0) ?? 0;

  return (
    <Dialog open={isOpen} onOpenChange={() => setIsOpen(undefined)}>
      <DialogContent className="focus-visible:outline-none min-h-[300px] sm:max-w-[600px]">
        <div className="flex flex-col">
          <h1 className="text-center text-xl tracking-widest font-semibold">FII: {fii.name}</h1>
          <div className="grid  grid-cols-3 gap-6  p-4">
            <div>
              <h1 className="inline-block tracking-wider  font-medium text-[#adfa1d] bg-opacity-70 ">Quote</h1>
              <h1 className="mt-2 text-xl font-regular tracking-wide">{BRL.format(purchases[0].quotationValue)}</h1>
            </div>
            <div>
              <h1 className="inline-block tracking-wider  font-medium text-[#adfa1d] bg-opacity-70 ">Last date</h1>
              <h1 className="mt-2 text-xl font-regular tracking-wide">{payments?.[0].date}</h1>
            </div>
            <div>
              <h1 className="inline-block tracking-wider  font-medium text-[#adfa1d] bg-opacity-70 ">Total value</h1>
              <h1 className="mt-2 text-xl font-regular tracking-wide">{BRL.format(totalPurchased)}</h1>
            </div>
            <div>
              <h1 className="inline-block tracking-wider  font-medium text-[#adfa1d] bg-opacity-70 ">Quotes qty</h1>
              <h1 className="mt-2 text-xl font-regular tracking-wide">{totalQuotes}</h1>
            </div>
            <div>
              <h1 className="inline-block tracking-wider  font-medium text-[#adfa1d] bg-opacity-70 ">Total income</h1>
              <h1 className="mt-2 text-xl font-regular tracking-wide">{BRL.format(totalIncome)}</h1>
            </div>
          </div>
          <div className="mt-4 no-scrollbar h-[150px] overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Paid</TableHead>
                  <TableHead>Quantity at</TableHead>
                  <TableHead>Total of payment</TableHead>
                  <TableHead>Income date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments?.map((payment) => {
                  return (
                    <TableRow key={payment.id}>
                      <TableCell>{BRL.format(payment.paidPerQuote)}</TableCell>
                      <TableCell>{payment.quotesQuantityAtThePayment}</TableCell>
                      <TableCell>{BRL.format(payment.quotesQuantityAtThePayment * payment.paidPerQuote)}</TableCell>
                      <TableCell>{payment.date}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
