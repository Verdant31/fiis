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
import { getPaymentsHistory } from "@/queries/getPaymentsHistory";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";

export default function Home() {
  const [userId, setUserId] = useState(localStorage.getItem("userId") ?? "");
  const usernameRef = useRef<HTMLInputElement>(null);

  const { mutate: createUserMutation } = useMutation({
    mutationFn: createUser,
  });

  const { data, isLoading } = useQuery(["get-fiis-key"], {
    queryFn: async () => getFiis(),
    cacheTime: 0,
    refetchOnWindowFocus: false,
  });

  const { data: history, isLoading: isLoadingHistory } = useQuery(["get-fiis-history-key"], {
    queryFn: async () => getPaymentsHistory(),
    cacheTime: 0,
    refetchOnWindowFocus: false,
  });

  const totalQuotes =
    data?.reduce((acc, fii) => {
      return acc + fii.qty;
    }, 0) ?? 0;

  const handleCreateUser = () => {
    if (!usernameRef?.current?.value) return;
    localStorage.setItem("userId", usernameRef?.current?.value);
    setUserId(usernameRef?.current?.value);
    createUserMutation(usernameRef?.current?.value);
    usernameRef.current.value = "";
  };

  const filteredHistory = history?.filter((history) => {
    return data?.find((fii) => fii.id === history.fiiId);
  });

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
        <AnalyticsCards totalQuotes={totalQuotes} history={filteredHistory} fiis={data} isLoading={isLoading || isLoadingHistory} />
      </div>
      <div className="flex items-center justify-between gap-[60px] ">
        <FiisChart fiis={data} isLoading={isLoading} />
        <MinimalFiisList fiis={data} isLoading={isLoading} />
      </div>
    </main>
  );
}
