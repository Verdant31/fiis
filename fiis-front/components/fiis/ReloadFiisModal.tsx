"use client";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { executeLocalScript } from "@/queries/executeLocalScript";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { BarLoader } from "react-spinners";

export function ReloadFiisModal() {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const { mutateAsync: executeLocalScriptMutation } = useMutation({
    mutationFn: async () => executeLocalScript(),
  });

  const handleReload = async () => {
    setIsOpen(true);
    await executeLocalScriptMutation().then(() => {
      setIsOpen(false);
      queryClient.invalidateQueries(["get-fiis-key"]);
    });
  };

  return (
    <Dialog open={isOpen}>
      <DialogTrigger onClick={handleReload} asChild>
        <p className="cursor-pointer text-lg w-[90px] text-center tracking-wider text-zinc-400">Reload</p>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="h-20 flex items-center justify-center">
          <DialogDescription className="mb-4">Await while we retrieve the new values of your FII's...</DialogDescription>
          <BarLoader width={300} color="#fff" />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
