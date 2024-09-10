/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn } from "@/lib/utils";
import { Control, Controller } from "react-hook-form";
import { NumericFormat } from "react-number-format";

type DolarInputProps = {
  name: string;
  control: Control<any, any> | undefined;
  className?: string;
};

export function CurrencyInput({ name, control, className }: DolarInputProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { ref, ...rest } }) => {
        return (
          <NumericFormat
            className={cn(
              "flex h-10 rounded-[6px] border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-zinc-800  placeholder:text-zinc-400 focus-visible:outline-ring focus-visible:outline-1 ",
              className,
            )}
            decimalSeparator=","
            thousandSeparator="."
            prefix="R$ "
            placeholder="R$59,99"
            decimalScale={2}
            allowLeadingZeros
            getInputRef={ref}
            {...rest}
          />
        );
      }}
    />
  );
}
