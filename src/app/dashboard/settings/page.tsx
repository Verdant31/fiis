"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { api } from "@/lib/axios";
import { SessionUser } from "@/types/auth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { toast } from "sonner";

interface UpdateSettingsProps {
  displayExpiredIncomes?: boolean;
  displayZeroedFunds?: boolean;
}

export default function Settings() {
  const [displayZeroedFunds, setDisplayZeroedFunds] = useState(false);
  const [displayExpiredIncomes, setDisplayExpiredIncomes] = useState(false);

  const { data: user, isLoading } = useQuery(["me"], {
    queryFn: async () => {
      const { data: session } = await api.get("/me");
      return session.user as SessionUser;
    },
  });

  const { mutateAsync, isLoading: isLoadingMutation } = useMutation({
    mutationFn: async (props: UpdateSettingsProps) =>
      await api.post("/update-settings", { ...props }),
  });

  useEffect(() => {
    if (!user) return;
    setDisplayZeroedFunds(user.displayZeroedFunds);
    setDisplayExpiredIncomes(user.displayExpiredIncomes);
  }, [user]);

  if (isLoading) return null;

  const handleDisplayZeroedFunds = async () => {
    const { data } = await mutateAsync({
      displayZeroedFunds: !displayZeroedFunds,
    });
    if (data.status !== 200) {
      return toast.error("Houve um erro ao tentar alterar suas configurações");
    }
    setDisplayZeroedFunds(!displayZeroedFunds);
    toast.success(data.message);
  };

  const handleDisplayExpiredIncomes = async () => {
    const { data } = await mutateAsync({
      displayExpiredIncomes: !displayExpiredIncomes,
    });
    if (data.status !== 200) {
      return toast.error("Houve um erro ao tentar alterar suas configurações");
    }
    setDisplayExpiredIncomes(!displayExpiredIncomes);
    toast.success(data.message);
  };

  return (
    <div className="max-w-[384px] mt-12 mx-auto space-y-6 ">
      <div>
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-extrabold">Configurações</h1>
          {isLoadingMutation && <ClipLoader size={24} color="#fff" />}
        </div>
        <div className="flex items-center space-x-3 mt-4">
          <Checkbox
            id="dispalyZeroedFunds"
            checked={displayZeroedFunds}
            onCheckedChange={handleDisplayZeroedFunds}
          />
          <label
            htmlFor="dispalyZeroedFunds"
            className="text-sm font-medium items-center flex gap-2 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Mostrar fundos que estão com as cotas zeradas.
          </label>
        </div>
        <div className="flex items-center space-x-3 mt-4">
          <Checkbox
            id="displayZeroedIncomes"
            checked={displayExpiredIncomes}
            onCheckedChange={handleDisplayExpiredIncomes}
          />
          <label
            htmlFor="displayZeroedIncomes"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Mostrar títulos que ja venceram.
          </label>
        </div>
      </div>
    </div>
  );
}
