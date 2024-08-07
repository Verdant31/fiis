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
import { BRL } from "@/utils/intlBr";

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
  id: string;
  name: string;
  actualPercent: number;
  expected: number;
  qty: number;
  quote: number;
  totalSpent: number
};

export function FiiWallet() {
  const [budget, setBudget] = useState("");
  const [percents, setPercents] = useState<Percent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const { data: fiis } = useQuery(["get-fiis-key-wallet"], {
    queryFn: async () => (await getFiis()).filter(f => f.name.includes("11") && f.name !== "MXRF11"),
    cacheTime: 0,
    refetchOnWindowFocus: true,
  });

  const totalSpent =  fiis?.reduce((acc, fii) => {
    const totalPurchaseOfFii = fii.purchases?.reduce((purchaseAcc, purchase) => {
      return purchaseAcc + (purchase.qty * purchase.quotationValue)
    }, 0);
    return acc + (totalPurchaseOfFii ?? 0);
  }, 0) ?? 0;

  const actualPercents = fiis?.map((fii) => {
    const purchases = fii.purchases?.reduce((purchaseAcc, purchase) => {
      return purchaseAcc + (purchase.qty * purchase.quotationValue)
    }, 0);

    return {
      id: fii.id,
      name: fii.name,
      actualPercent: parseFloat(((100 * purchases) / totalSpent).toFixed(1)),
      totalSpent: purchases,
      expected: expectedPercents[fii.name],
      qty: fii.quantity,
      quote: fii.quotationValue,
    }
  });
  
  const handleCalculateNextPurchases = (percents: Percent[], budget: number, totalSpent: number) => {
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
    const expectedSpentValue = Math.floor((fiiWithBiggestDiff.totalSpent * fiiWithBiggestDiff.expected)/fiiWithBiggestDiff.actualPercent)
    const remainingValue = expectedSpentValue - fiiWithBiggestDiff.totalSpent;

    const quotesToBuy = Math.floor(remainingValue/fiiWithBiggestDiff.quote)
    if(quotesToBuy === 0) {
      setPercents(fiisDiffsOrderedToLowest);
      setIsLoading(false);
      return;    
    }
    
    console.log(fiisDiffsOrderedToLowest)
    console.log("Current spent value: ", Math.floor(fiiWithBiggestDiff.totalSpent))
    console.log("Expected spent value: ", expectedSpentValue)
    console.log("Expected percent: ", fiiWithBiggestDiff.expected, "%")
    console.log("Value to spent to achieve percent: ", remainingValue)
    console.log("FIi quote: ", fiiWithBiggestDiff.quote)
    console.log("Quotes to by to achieve percent: ", Math.floor(remainingValue/fiiWithBiggestDiff.quote))

    const updatedTotalSpent = totalSpent + remainingValue;
    const budgetLeft = budget - remainingValue;

    if (budgetLeft < 0) {
      setPercents(fiisDiffsOrderedToLowest);
      setIsLoading(false);
      return;
    }

    fiisDiffsOrderedToLowest?.forEach((fii) => {
      if (fii.name === fiiWithBiggestDiff.name) {
        const newQty = fii.qty + quotesToBuy;
        const updatedPercent = (expectedSpentValue * 100)/updatedTotalSpent;
        console.log("New percent after purchases: ", updatedPercent)
        fii.qty = newQty;
        fii.actualPercent = parseFloat(((expectedSpentValue * 100)/updatedTotalSpent).toFixed(1));
      }
    });
    console.log("\n")
    handleCalculateNextPurchases(fiisDiffsOrderedToLowest, budgetLeft, updatedTotalSpent);
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
                    <TableCell className="font-medium flex">
                      <div className="w-[50px]">
                      {fii.actualPercent}%
                      </div>
                    ({BRL.format(fii.totalSpent)})
                    </TableCell>
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
              handleCalculateNextPurchases(actualPercents ?? [], parseFloat(budget), totalSpent);
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
        {!isLoading && percents.length > 0 && (
          <div>
            <div className="grid grid-cols-4 justify-center items-center mx-8">
              {percents.map((percent) => {
                const previousQty = fiis?.find((fii) => fii.name === percent.name)?.quantity ?? 0;
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
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}