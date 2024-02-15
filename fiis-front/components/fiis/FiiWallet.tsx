"use client";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { updateFiiQuantities } from "@/queries/updateFiiQuantities";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { BarLoader } from "react-spinners";
import { Input } from "../ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { getFiis } from "@/queries/getFiis";
import { getTotalQuotes } from "@/utils/getTotalQuotes";

const expectedPercents: { [key: string]: number } = {
  RCRB11: 6.5,
  XPML11: 7.5,
  RBRR11: 10.5,
  PVBI11: 8.5,
  KNSC11: 10.5,
  KNRI11: 7.5,
  KNCR11: 15,
  HSML11: 10,
  HSLG11: 4.5,
  BTLG11: 6.5,
  BRCO11: 5.5,
  BCFF11: 7.5,
};

export type Percent = {
  id: number;
  name: string;
  actualPercent: number;
  expected: number;
  qty: number;
  quote: number;
};

export function FiiWallet() {
  const [budget, setBudget] = useState("");
  const [percents, setPercents] = useState<Percent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const { data: fiis } = useQuery(["get-fiis-key"], {
    queryFn: async () => getFiis(),
    cacheTime: 0,
    refetchOnWindowFocus: true,
  });

  const {
    data: updateResponse,
    mutateAsync: updateFiiMutation,
    reset,
  } = useMutation({
    mutationFn: updateFiiQuantities,
    onError: () => {
      setTimeout(() => reset(), 2000);
    },
    onSuccess: () => {
      setTimeout(() => reset(), 2000);
    },
  });
  const totalQuotes = getTotalQuotes(fiis);

  const actualPercents = fiis?.map((fii) => ({
    id: fii.id,
    name: fii.name,
    actualPercent: parseFloat(((100 * fii.quantity) / totalQuotes).toFixed(1)),
    expected: expectedPercents[fii.name],
    qty: fii.quantity,
    quote: fii.quotationValue,
  }));

  const handleCalculateNextPurchases = (percents: Percent[], budget: number, totalQuotes: number) => {
    if (!budget) return;
    setIsLoading(true);

    let fiisDiffsOrderedToLowest =
      percents
        ?.map((percent) => ({
          ...percent,
          diff: percent.expected - percent.actualPercent,
        }))
        .filter((percent) => percent.diff > 0)
        .sort((a, b) => b.diff - a.diff) ?? [];

    const fiiWithBiggestDiff = fiisDiffsOrderedToLowest[0];

    const buyForFii = Math.floor((totalQuotes * fiiWithBiggestDiff.diff) / 100);
    const updatedTotalQuotes = totalQuotes + buyForFii;

    const budgetLeft = budget - (fiiWithBiggestDiff.qty + buyForFii * fiiWithBiggestDiff.quote);

    if (budgetLeft < 0) {
      console.log(fiisDiffsOrderedToLowest);
      setPercents(fiisDiffsOrderedToLowest);
      setIsLoading(false);
      return;
    }

    fiisDiffsOrderedToLowest?.forEach((fii) => {
      if (fii.name === fiiWithBiggestDiff.name) {
        const newQty = fii.qty + buyForFii;
        fii.qty = newQty;
        fii.actualPercent = parseFloat(((100 * newQty) / updatedTotalQuotes).toFixed(1));
      }
    });
    handleCalculateNextPurchases(fiisDiffsOrderedToLowest, budgetLeft, updatedTotalQuotes);
  };


  return (
    <Dialog>
      <DialogTrigger asChild>
        <p className="cursor-pointer text-lg w-[90px] text-center tracking-wider text-zinc-400">Wallet</p>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <h1 className="text-center uppercase text-2xl tracking-widest">Wallet</h1>
        <div className="no-scrollbar h-[400px] overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]"></TableHead>
                <TableHead className="w-[100px]">Expected</TableHead>
                <TableHead className="w-[100px]">Actual</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {actualPercents?.map((fii) => {
                return (
                  <TableRow className="cursor-pointer" key={fii.name}>
                    <TableCell className="font-medium">{fii.name}</TableCell>
                    <TableCell className="font-medium">{fii.expected}%</TableCell>
                    <TableCell className="font-medium">{fii.actualPercent}%</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        <div className="flex gap-4 justify-center mt-6">
          The next purchase to reach wallet balance given
          <Input
            onChange={(e) => setBudget(e.target.value)}
            onKeyDown={(e) => {
              if (!(e.key === "Enter")) return;
              // handleCalculateNextPurchases(actualPercents ?? [], parseFloat(budget), totalQuotes);
            }}
            value={budget}
            className="w-[60px] p-0 text-center rounded-none h-6 boder-none border-b-2 border-t-0 border-r-0 border-l-0"
          />
          is:
        </div>
        {isLoading && (
          <div className="flex justify-center mt-12 mb-4">
            <BarLoader color="#adfa1d" width={300} />
          </div>
        )}
        {/* {!isLoading && percents.length > 0 && (
          <div>
            <div className="grid grid-cols-4 justify-center items-center mx-8">
              {percents.map((percent) => {
                const previousQty = data?.find((fii) => fii.name === percent.name)?.qty ?? 0;
                const diff = percent.qty - previousQty;
                if (diff < 1) return;
                return (
                  <div className="">
                    <p className="text-[#adfa1d]" key={percent.name}>
                      {percent.name}:<span className="text-white">+{diff}</span>
                    </p>
                    <span className="text-sm">{BRL.format((percent.qty - previousQty) * percent.quote)}</span>
                  </div>
                );
              })}
            </div>
            <Button onClick={handleApplySugestions} className="flex mx-auto  mt-6 w-full">
              Apply suggestions
            </Button>
            {updateResponse?.status === 200 && <p className="text-center success-text mt-4">Success updated your FII'S</p>}
            {updateResponse?.status && updateResponse.status !== 200 && <p className="text-center error-text mt-4">Fail when trying update FII's</p>}
          </div>
        )} */}
      </DialogContent>
    </Dialog>
  );
}
