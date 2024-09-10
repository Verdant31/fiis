import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Operation } from "@prisma/client";
import { useState } from "react";
import OperationTypeCard from "./operation-type-card";
import { DatePicker } from "./date-picker";
import { CurrencyInput } from "./currency-input";
import { Controller, useFormContext } from "react-hook-form";
import { formatCnpj } from "@/utils/format-cnpj";
import { FormInputData } from "../lib/forms/create-fii-operation";
import { Button } from "./ui/button";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { ClipLoader } from "react-spinners";

export function RegisterFiiOperationForm() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isLoading, setIsLoading] = useState(false);

  const {
    handleSubmit,
    register,
    watch,
    control,
    clearErrors,
    formState: { errors },
  } = useFormContext<FormInputData>();

  const onSubmit = async (formData: FormInputData) => {
    setIsLoading(true);
    const { data } = await api.post("/fiis/create-operation", {
      ...formData,
      date,
    });
    setIsLoading(false);

    if (data?.status !== 200) {
      return toast.error(data?.message);
    }
    toast.success(data?.message);
  };

  const operationTtype = watch("operationType");

  return (
    <div className="mt-4">
      <Controller
        name="operationType"
        control={control}
        render={({ field: { value, onChange } }) => {
          const onChangeOperationType = (value: Operation) => {
            onChange(value);
            clearErrors();
          };
          return (
            <div className="flex items-center justify-between">
              <OperationTypeCard
                onChange={onChangeOperationType}
                currentType={value}
                type={Operation.purchase}
              />
              <OperationTypeCard
                currentType={value}
                onChange={onChangeOperationType}
                type={Operation.unfolding}
              />
              <OperationTypeCard
                onChange={onChangeOperationType}
                currentType={value}
                type={Operation.sale}
              />
            </div>
          );
        }}
      />
      <div className="grid gap-4 py-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4">
            <Label htmlFor="name" className="w-[40px]">
              Ativo
            </Label>
            <Input
              {...register("name")}
              placeholder="XPML11.SA"
              className="w-[135px]"
            />
          </div>
          {operationTtype === "unfolding" ? (
            <div className="flex items-center gap-4">
              <Label htmlFor="username">Proporção</Label>
              <Input {...register("unfoldingProportion")} placeholder="10" />
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Label htmlFor="username" className="w-[40px]">
                Preço
              </Label>
              <CurrencyInput
                className="w-[95px]"
                control={control}
                name="price"
              />
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4">
            <Label htmlFor="name" className="w-[40px]">
              Data
            </Label>
            <DatePicker
              dateFormat={operationTtype !== "unfolding" ? "PP" : "PPP"}
              date={date}
              setDate={setDate}
              placeholder="Data da operação"
              showIcon={false}
              className={
                operationTtype !== "unfolding" ? "w-[160px]" : "w-[328px]"
              }
            />
          </div>
          {operationTtype !== "unfolding" && (
            <div className="flex items-center gap-4">
              <Label htmlFor="username" className="w-[40px]">
                Cotas
              </Label>
              <Input
                {...register("quotes")}
                id="username"
                placeholder="24"
                className="w-14"
              />
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
          <Label htmlFor="name" className="w-[40px] shrink-0">
            CNPJ
          </Label>
          <Controller
            name="cnpj"
            control={control}
            render={({ field: { onChange, ...rest } }) => {
              return (
                <Input
                  {...rest}
                  onChange={(e) => {
                    const { value } = e.target;
                    e.target.value = formatCnpj(value);
                    onChange(e);
                  }}
                  maxLength={18}
                  placeholder="XXX.XXX/XXXX-XX"
                />
              );
            }}
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
