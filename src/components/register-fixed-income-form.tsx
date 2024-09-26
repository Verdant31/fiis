/* eslint-disable @typescript-eslint/no-unused-vars */
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { DatePicker } from "./date-picker";
import { CurrencyInput } from "./currency-input";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { FormInputData } from "../lib/forms/create-fixed-income-operation";
import { Button } from "./ui/button";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { ClipLoader } from "react-spinners";
import { IncomeEnum, incomes } from "@/types/fixed-income";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TrashIcon } from "lucide-react";

export function RegisterFixedIncomeForm() {
  const [isLoading, setIsLoading] = useState(false);

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useFormContext<FormInputData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "incomes",
  });

  const onSubmit = async (formData: FormInputData) => {
    setIsLoading(true);
    const { creationType, ...rest } = formData;
    const { data } = await api.post("/fixed-income/create-operation", {
      ...rest,
    });
    setIsLoading(false);

    if (data?.status !== 200) {
      return toast.error(data?.message);
    }

    toast.success(data.message);
  };

  return (
    <div className="mt-4">
      <div className="space-y-4">
        {fields.map((item, index) => (
          <div className="flex gap-4 w-full" key={item.id}>
            <div className="flex items-center basis-[45%] gap-2">
              <Label htmlFor="username">Tipo</Label>
              <Controller
                name={`incomes.${index}.type`}
                control={control}
                render={({ field: { value, onChange } }) => {
                  return (
                    <Select
                      value={value}
                      onValueChange={(value) => onChange(value)}
                    >
                      <SelectTrigger
                        className="w-full rounded-lg sm:ml-auto focus:ring-0 focus:ring-offset-0"
                        aria-label="Select a value"
                      >
                        <SelectValue placeholder="CDI" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {incomes.map((option) => (
                          <SelectItem
                            key={option}
                            value={option}
                            className="rounded-lg"
                          >
                            {IncomeEnum[option as keyof typeof IncomeEnum]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  );
                }}
              />
            </div>
            <div className="flex items-center basis-[50%] gap-2">
              <Label htmlFor="username">Valor</Label>
              <div className="relative">
                <Input
                  type="number"
                  {...register(`incomes.${index}.value`, {
                    valueAsNumber: true,
                  })}
                  placeholder="120"
                  className="pr-8"
                />
                <span className="absolute right-3 top-[50%] translate-y-[-50%]">
                  %
                </span>
              </div>
              {index > 0 && (
                <TrashIcon
                  onClick={() => remove(index)}
                  size={18}
                  className="text-red-500 ml-1 shrink-0"
                />
              )}
            </div>
          </div>
        ))}
      </div>
      <p
        onClick={() =>
          append({ type: "cdi", value: 120 }, { shouldFocus: false })
        }
        className="mt-4 w-fit underline text-sm text-muted-foreground"
      >
        Adicionar rendimento (hibrido)
      </p>
      <div className="grid gap-4 py-4">
        <div className="flex w-full items-center gap-4">
          <Label htmlFor="name" className="w-[90px] shrink-0">
            Empresa
          </Label>
          <Input {...register("companyName")} placeholder="Stocks.tr LTDA" />
        </div>
        <div className="flex items-center gap-4">
          <Label htmlFor="name" className="w-[90px] shrink-0">
            Vencimento
          </Label>
          <Controller
            control={control}
            name="dueDate"
            render={({ field: { onChange, value } }) => (
              <DatePicker
                date={value}
                setDate={onChange}
                placeholder="Data da operação"
                showIcon={false}
                className={"w-full"}
              />
            )}
          />
        </div>
        <div className="flex items-center gap-4">
          <Label htmlFor="name" className="w-[90px] shrink-0">
            Data
          </Label>
          <Controller
            control={control}
            name="purchaseDate"
            render={({ field: { onChange, value } }) => (
              <DatePicker
                date={value}
                setDate={onChange}
                placeholder="Data da operação"
                showIcon={false}
                className={"w-full"}
              />
            )}
          />
        </div>
        <div className="flex items-center gap-4">
          <Label className="w-[90px] shrink-0">Investido</Label>
          <CurrencyInput
            control={control}
            className="w-full"
            name={"investedValue"}
          />
        </div>
      </div>
      {Object.values(errors).map((error) => {
        return (
          <p className=" text-red-500 text-sm" key={error.message}>
            * {error.message}
          </p>
        );
      })}
      <Button
        className="w-full mt-4"
        onClick={handleSubmit(onSubmit)}
        type={"submit"}
      >
        {isLoading ? <ClipLoader size={20} /> : "Salvar"}
      </Button>
    </div>
  );
}
