"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPercentFromFii } from "@/utils/getPercentFromFii";
import { useState } from "react";
import { BarLoader } from "react-spinners";
import { FiiDetailsModal } from "./fiis/FiiDetailsModal";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Fii } from "@/lib/types";

interface MiniimalFiisListProps {
  fiis: Fii[] | undefined;
  isLoading: boolean;
}

export default function MinimalFiisList({ fiis, isLoading }: MiniimalFiisListProps) {
  const [detailsModalIsOpen, setDetailsModalIsOpen] = useState<Fii>();

  const handleOpenModal = (fii: Fii) => {
    setDetailsModalIsOpen(fii);
  };

  return (
    <Card className="-mt-8 border-zinc-800 col-span-3 px-1 py-6 h-[500px] w-[900px] bg-background">
      {!!detailsModalIsOpen && <FiiDetailsModal fii={detailsModalIsOpen} setIsOpen={setDetailsModalIsOpen} />}
      <CardHeader>
        <CardTitle className="text-white">Meus fundos imobiliários</CardTitle>
      </CardHeader>
      {isLoading ? (
        <div className="flex items-center justify-center mt-44">
          <BarLoader color="#adfa1d" width={300} />
        </div>
      ) : (
        <CardContent className="mt-4 no-scrollbar h-[400px] overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Name</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead className="w-[160px]">Quote value</TableHead>
                <TableHead className="w-[160px]">P/VP</TableHead>
                <TableHead>Payment date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fiis?.map((fii) => {
                const fiiPercent = getPercentFromFii(fii);
                return (
                  <TableRow className="cursor-pointer" onClick={() => handleOpenModal(fii)} key={fii.name}>
                    <TableCell className="font-medium">{fii.name}</TableCell>
                    <TableCell>{fii.quantity}</TableCell>
                    <TableCell>
                      R${fii.quotationValue}
                      {fiiPercent !== 0 && (
                        <span className={`${fiiPercent > 0 ? "text-green-500" : "text-red-600"} ml-2`}>
                          {fiiPercent > 0 && "+"}
                          {fiiPercent}%
                        </span>
                      )}
                      
                    </TableCell>
                    <TableCell>{fii?.pvp}</TableCell>
                    <TableCell>{fii?.payments?.[0].date}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      )}
    </Card>
  );
}
