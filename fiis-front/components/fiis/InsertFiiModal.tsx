"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { executeLocalScript } from "@/queries/executeLocalScript";
import { insertFii } from "@/queries/insertFii";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { ClipLoader } from "react-spinners";

type Field = {
  name: string;
  qty: string;
};

export function InsertFiiModal() {
  const [mode, setMode] = useState<"single" | "multiple">("single");
  const [reloadAfterInsert, setReloadAfterInsert] = useState(false);
  const [fields, setFields] = useState<Field[]>([{ name: "", qty: "" }]);

  const fiiNameRef = useRef<HTMLInputElement>(null);
  const fiiQtyRef = useRef<HTMLInputElement>(null);

  const queryClient = useQueryClient();

  const {
    data: insertionResponse,
    mutateAsync: insertFiiMutation,
    isLoading: isInserting,
    reset: resetInsertion,
  } = useMutation({
    mutationFn: insertFii,
    onSuccess: () =>
      setTimeout(() => {
        resetInsertion();
      }, 2000),
    onError: () =>
      setTimeout(() => {
        resetInsertion();
      }, 2000),
  });

  const {
    data: scriptExecutionResponse,
    mutateAsync: executeLocalScriptMutation,
    isLoading: isExecuting,
    reset: resetExecution,
  } = useMutation({
    mutationFn: async () => executeLocalScript(),
    onSuccess: () =>
      setTimeout(() => {
        resetExecution();
      }, 2000),
    onError: () =>
      setTimeout(() => {
        resetExecution();
      }, 2000),
  });

  const handleSubmit = async () => {
    const isAllFieldsEmpty = fields.every((field) => field.name === "" && field.qty === "");
    if (isAllFieldsEmpty) return;

    await insertFiiMutation({
      fiis: fields,
    }).then(async (res) => {
      if (!reloadAfterInsert || res?.status !== 200) return;
      await executeLocalScriptMutation().then(() => {
        queryClient.invalidateQueries(["get-fiis-key"]);
      });
    });
  };

  const handleAddFields = () => {
    setFields((prev) => [...prev, { name: "", qty: "" }]);
  };

  const handleChangeField = (index: number, key: "name" | "qty", value: string) => {
    const found = fields.find((field) => field.name === fiiNameRef.current?.value);
    if (found) return;
    setFields((prev) => {
      const newFields = [...prev];
      newFields[index][key] = value;
      return newFields;
    });
  };

  const hasError = (insertionResponse && insertionResponse?.status === 500) || (scriptExecutionResponse && scriptExecutionResponse?.status === 500);
  const hasSuccess = (insertionResponse && insertionResponse?.status === 200) || (scriptExecutionResponse && scriptExecutionResponse?.status === 200);

  const isLoading = isExecuting || isInserting;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <p className="cursor-pointer text-lg w-[90px] text-center tracking-wider text-zinc-400">Insert(FII)</p>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <div className="mx-auto flex gap-4 mb-2">
          <h1 onClick={() => setMode("single")} className={`tracking-widest cursor-pointer ${mode === "single" && "font-bold border-b-2"}`}>
            SINGLE
          </h1>
          <h1 onClick={() => setMode("multiple")} className={`tracking-widest cursor-pointer ${mode === "multiple" && "font-bold border-b-2"}`}>
            MULTIPLE
          </h1>
        </div>
        <DialogHeader>
          <DialogTitle>Insert new FII</DialogTitle>
          <DialogDescription>Save to the database a new purchased FII.</DialogDescription>
          <div className="flex items-center space-x-2 pt-2">
            <Checkbox checked={reloadAfterInsert} onCheckedChange={() => setReloadAfterInsert(!reloadAfterInsert)} className="outline-none" id="terms" />
            <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Reload FIIS after insert
            </label>
          </div>
        </DialogHeader>
        <div>
          {fields.map((field, index) => {
            return (
              <div key={index} className="flex items-center gap-4 pt-2 pb-2">
                <Input placeholder="Examle: MXRF11" onChange={(e) => handleChangeField(index, "name", e.target.value)} value={field.name} className="w-44" />
                <Input placeholder="Qty" onChange={(e) => handleChangeField(index, "qty", e.target.value)} value={field.qty} className="w-16 flex pl-5" />
                <ClipLoader color="#fff" loading={isLoading} />
                {mode === "single" ? (
                  <Button disabled={isLoading} onClick={handleSubmit} type="button">
                    Insert
                  </Button>
                ) : (
                  <svg onClick={handleAddFields} className="cursor-pointer" xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="#ffffff" viewBox="0 0 256 256">
                    <path d="M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM184,136H136v48a8,8,0,0,1-16,0V136H72a8,8,0,0,1,0-16h48V72a8,8,0,0,1,16,0v48h48a8,8,0,0,1,0,16Z"></path>
                  </svg>
                )}
              </div>
            );
          })}
          {mode === "multiple" && (
            <div className="flex mt-4 justify-end">
              <Button disabled={isLoading} onClick={handleSubmit} type="button">
                Insert
              </Button>
            </div>
          )}
          {hasError && <span className="error-text ml-1">Error at FII insertion</span>}
          {hasSuccess && <span className="success-text ml-1">{isExecuting ? "FII inserted with success" : "Script executed"}</span>}
        </div>
      </DialogContent>
    </Dialog>
  );
}
