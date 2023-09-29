"use client";
import { AnalyticsCards } from "@/components/AnalyticsCards";
import { FiisChart } from "@/components/FiisChart";
import MinimalFiisList from "@/components/MinimalFiisList";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createUser } from "@/queries/createUser";
import { getFiis } from "@/queries/getFiis";
import { getPurchases } from "@/queries/getPurchases";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";

export default function Home() {
  const [userId, setUserId] = useState(localStorage.getItem("userId") ?? "");
  const usernameRef = useRef<HTMLInputElement>(null);

  const { mutate: createUserMutation } = useMutation({
    mutationFn: createUser,
  });

  const { data: fiis, isLoading } = useQuery(["get-fiis-key"], {
    queryFn: async () => getFiis(),
    cacheTime: 0,
    refetchOnWindowFocus: false,
  });

  const { data: purchasesResponse, isLoading: isLoadingPurchases } = useQuery(["get-purchases-key"], {
    queryFn: async () => getPurchases(),
    cacheTime: 0,
    refetchOnWindowFocus: false,
  });

  const totalQuotes =
    purchasesResponse?.purchases?.reduce((acc, fii) => {
      return acc + fii.qty;
    }, 0) ?? 0;

  const handleCreateUser = () => {
    if (!usernameRef?.current?.value) return;
    localStorage.setItem("userId", usernameRef?.current?.value);
    setUserId(usernameRef?.current?.value);
    createUserMutation(usernameRef?.current?.value);
    usernameRef.current.value = "";
  };

  return (
    <main className="w-full mt-12">
      <Dialog open={userId ? false : true}>
        <DialogContent className="sm:max-w-[350px]">
          <Label htmlFor="name">Username</Label>
          <div className="flex gap-4">
            <Input placeholder="Ex: Renato" ref={usernameRef} type="text" id="name" />
            <Button onClick={handleCreateUser}>Create</Button>
          </div>
        </DialogContent>
      </Dialog>
      <div className="flex items-center justify-between mb-8">
        <div className="w-[450px ml-5">
          <h1 className="text-white text-4xl font-bold tracking-wide">ROAD TO THE 300K</h1>
          <h1 className="text-white text-sm font-thin tracking-wide w-[400px]">Analytical web dashboard to help me reach my goal of R$30000,00 by 2025</h1>
        </div>
        <AnalyticsCards flatHistory={purchasesResponse?.flatHistory} totalQuotes={totalQuotes} purchases={purchasesResponse?.purchases} fiis={fiis} isLoading={isLoading || isLoadingPurchases} />
      </div>
      <div className="flex items-center justify-between gap-[60px] ">
        <FiisChart fiis={fiis} isLoading={isLoading} />
        <MinimalFiisList fiis={fiis} isLoading={isLoading} />
      </div>
    </main>
  );
}
