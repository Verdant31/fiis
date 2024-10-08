import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { ClipLoader } from "react-spinners";
import { client } from "@/app/providers";

interface Props {
  stockType: "fixed" | "fii";
  id: string;
}

export default function DeleteOperationModal({ id, stockType }: Props) {
  const [modal, setModal] = useState(false);

  const { mutateAsync, isLoading } = useMutation([`delete-stock-${id}`], {
    mutationFn: async () => {
      const route = stockType === "fii" ? "fiis" : "fixed-income";
      const { data } = await api.delete(route + "/delete-operation", {
        params: {
          id,
        },
      });
      return data;
    },
  });

  const handleDelete = async () => {
    const response = await mutateAsync();
    if (response?.status !== 200) {
      return toast.error(
        "Não foi possível excluir seu título, tente novamente mais tarde.",
      );
    }
    toast.success("Título excluido com sucesso.");
    setModal(false);
    if (stockType === "fixed") {
      client.refetchQueries(["get-fixed-income-operations"]);
    } else {
      client.refetchQueries(["get-fiis-summary"]);
    }
  };

  return (
    <Dialog open={modal} onOpenChange={setModal}>
      <DialogTrigger asChild>
        <Button className="text-white bg-red-500 w-full mt-8 items-center shrink-0 flex gap-4  lg:w-auto">
          <TrashIcon size={20} />
          Excluir {stockType === "fii" ? "fundo" : "titulo"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm z-50">
        <div className="space-y-2">
          <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Tem certeza que deseja excluir seu{" "}
            {stockType === "fii" ? "fundo" : "titulo"}?
          </p>
          <p className="text-muted-foreground text-sm">
            Todas as informações referentes a ele serão excluidas.
          </p>
        </div>
        <Button
          onClick={handleDelete}
          className="items-center w-full gap-4 mt-3 shrink-0 flex"
        >
          {isLoading && <ClipLoader size={20} />}
          Confirmar
        </Button>
      </DialogContent>
    </Dialog>
  );
}
