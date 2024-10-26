import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Dividend, FiiGroupedOperations } from "@/types/fiis";
import { Checkbox } from "../ui/checkbox";
import { saveAs } from "file-saver";
import { pdf } from "@react-pdf/renderer";
import { FiisExtractsPdf } from "../pdf/fiis-extracts";
import { useStatementsFilterContext } from "@/contexts/StatementsFilters";
import { FiisOperations } from "@prisma/client";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { FixedIncomeWithEvolution } from "@/types/fixed-income";
import { FixedIncomeExtractsPdf } from "../pdf/fixed-income-extracts";

interface Props {
  data: Dividend[] | FiisOperations[] | FixedIncomeWithEvolution[];
  operations: FiiGroupedOperations[] | FixedIncomeWithEvolution[];
}

export default function ExtractOptionModal({ data, operations }: Props) {
  const [modal, setModal] = useState(false);
  const [sendToEmail, setSendToEmail] = useState(false);

  const { filters } = useStatementsFilterContext();

  const handleStartExtract = async () => {
    const fileName = "test.pdf";
    const { data: session } = await api.get("/me");

    if (!session?.user?.email) {
      toast.info("Você precisa estar logado para baixar o extrato");
      return;
    }

    const component =
      "companyName" in operations[0] ? (
        <FixedIncomeExtractsPdf
          userEmail={session.user.email as string}
          operations={operations as FixedIncomeWithEvolution[]}
          extractedData={data as FixedIncomeWithEvolution[]}
          filters={filters}
        />
      ) : (
        <FiisExtractsPdf
          userEmail={session.user.email as string}
          operations={operations as FiiGroupedOperations[]}
          extractedData={data as Dividend[] | FiisOperations[]}
          filters={filters}
        />
      );

    const blob = await pdf(component).toBlob();

    saveAs(blob, fileName);
    setModal(false);
  };

  return (
    <Dialog open={modal} onOpenChange={setModal}>
      <DialogTrigger asChild>
        <Button className="items-center w-[50%] shrink-0 flex gap-4 max-w-[225px] lg:w-auto">
          <Download size={20} />
          Extrair
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm z-50">
        <div className="flex items-center space-x-3">
          <Checkbox
            checked={sendToEmail}
            onClick={() => setSendToEmail(!sendToEmail)}
            id="terms"
          />
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Desejo que meu orçamento também seja enviado para o meu email.
          </label>
        </div>
        <Button
          onClick={handleStartExtract}
          className="items-center w-full mt-3 shrink-0 flex"
        >
          Confirmar
        </Button>
      </DialogContent>
    </Dialog>
  );
}
