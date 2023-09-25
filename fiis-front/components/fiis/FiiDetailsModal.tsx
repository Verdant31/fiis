"use client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { getFiiHistory } from "@/queries/getFiiHistory";
import { BRL } from "@/utils/intlBr";
import { Fii } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { Dispatch, SetStateAction } from "react";
import { BarLoader } from "react-spinners";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

interface FiiDetailsModalProps {
  fii: Fii;
  setIsOpen: Dispatch<SetStateAction<Fii | undefined>>;
}

export function FiiDetailsModal({ setIsOpen, fii }: FiiDetailsModalProps) {
  const isOpen = !!fii;

  const { data, isLoading } = useQuery(["get-fii-history-key"], {
    queryFn: async () => getFiiHistory(fii.id),
    cacheTime: 0,
    refetchOnWindowFocus: false,
  });

  if (!data && !isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={() => setIsOpen(undefined)}>
        <DialogContent className="focus-visible:outline-none min-h-[200px] sm:max-w-[600px]">
          <div className="flex items-center justify-center">
            <h1>Não foi possível obter informações sobre o FII solicitado.</h1>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const totalIncome =
    data?.reduce((acc, payment) => {
      return acc + payment.qty * payment.value;
    }, 0) ?? 0;

  const nextMonth = totalIncome + (fii.qty + fii.lastIncomeValue);

  return (
    <Dialog open={isOpen} onOpenChange={() => setIsOpen(undefined)}>
      <DialogContent className="focus-visible:outline-none min-h-[300px] sm:max-w-[600px]">
        {isLoading ? (
          <div className="flex items-center justify-center">
            <BarLoader color="#adfa1d" width={300} />
          </div>
        ) : (
          <div className="flex flex-col">
            <h1 className="text-center text-xl tracking-widest font-semibold">FII: {fii.name}</h1>
            <div className="grid  grid-cols-3 gap-6  p-4">
              <div>
                <h1 className="inline-block tracking-wider  font-medium text-[#adfa1d] bg-opacity-70 ">Last date</h1>
                <h1 className="mt-2 text-xl font-regular tracking-wide">{fii.lastIncomeDate}</h1>
              </div>
              <div>
                <h1 className="inline-block tracking-wider  font-medium text-[#adfa1d] bg-opacity-70 ">Total value</h1>
                <h1 className="mt-2 text-xl font-regular tracking-wide">{BRL.format(fii.quotationValue * fii.qty)}</h1>
              </div>
              <div>
                <h1 className="inline-block tracking-wider  font-medium text-[#adfa1d] bg-opacity-70 ">Quotes qty</h1>
                <h1 className="mt-2 text-xl font-regular tracking-wide">{fii.qty}</h1>
              </div>
              <div>
                <h1 className="inline-block tracking-wider  font-medium text-[#adfa1d] bg-opacity-70 ">Total income</h1>
                <h1 className="mt-2 text-xl font-regular tracking-wide">{BRL.format(totalIncome)}</h1>
              </div>
              <div>
                <h1 className="inline-block tracking-wider  font-medium text-[#adfa1d] bg-opacity-70 ">Next Month</h1>
                <h1 className="mt-2 text-xl font-regular tracking-wide">{BRL.format(nextMonth)}</h1>
              </div>
            </div>
            <div className="mt-4 no-scrollbar h-[150px] overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Paid</TableHead>
                    <TableHead>Quantity at</TableHead>
                    <TableHead>Income date</TableHead>
                    <TableHead>Closure</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.map((payment) => {
                    return (
                      <TableRow key={payment.id}>
                        <TableCell>{BRL.format(payment.value)}</TableCell>
                        <TableCell>{payment.qty}</TableCell>
                        <TableCell>{payment.date}</TableCell>
                        <TableCell>{BRL.format(payment.closure)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
