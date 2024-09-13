/* eslint-disable react-hooks/exhaustive-deps */
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import * as React from "react";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ptBR } from "date-fns/locale";
import { Calendar } from "./ui/calendar";
import { IntervalsValueType } from "@/types/statements";

const months = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Maio",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];
const days = ["1 dia", "7 dias", "15 dias", "30 dias", "60 dias"];
const currenyYear = new Date().getFullYear().toString();

interface Props {
  interval: "Dias" | "Mês" | "Ano" | "Todos" | "Personalizado";
  setIntervalValue: React.Dispatch<
    React.SetStateAction<IntervalsValueType | undefined>
  >;
}

export type DateInRangeModeType = {
  from?: Date;
  to?: Date;
};

export default function SelectInterval({ interval, setIntervalValue }: Props) {
  const fifteenDaysAgo = new Date(
    new Date().setDate(new Date().getDate() - 15),
  );
  const [customInterval, setCustomInterval] = useState<
    DateInRangeModeType | undefined
  >({
    from: fifteenDaysAgo,
    to: new Date(),
  });
  const [daysInterval, setDaysInterval] = useState<string>("15 dias");
  const [yearInterval, setYearInterval] = useState<string>(currenyYear);
  const [monthDate, setMonthDate] = useState(new Date());

  const handleSelectMonth = (month: number) => {
    const newDate = new Date(monthDate);
    newDate.setMonth(month);
    setMonthDate(newDate);
  };

  const handleDecreaseMonthDateYear = () => {
    const newDate = new Date(monthDate);
    newDate.setFullYear(newDate.getFullYear() - 1);
    setMonthDate(newDate);
  };

  const handleIncreaseMonthDateYear = () => {
    const newDate = new Date(monthDate);
    newDate.setFullYear(newDate.getFullYear() + 1);
    setMonthDate(newDate);
  };

  React.useEffect(() => {
    if (
      interval === "Personalizado" &&
      customInterval?.from &&
      customInterval?.to
    )
      setIntervalValue(customInterval);
    else if (interval === "Dias") setIntervalValue(daysInterval);
    else if (interval === "Ano") setIntervalValue(yearInterval);
    else if (interval === "Mês") setIntervalValue(monthDate);
  }, [customInterval, daysInterval, yearInterval, monthDate, interval]);

  const years = Array.from({ length: 4 }, (_, i) =>
    (new Date().getFullYear() - i).toString(),
  );

  switch (interval) {
    case "Personalizado": {
      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "justify-start w-full lg:w-[180px] max-w-[300px] text-left font-normal",
                !customInterval && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {customInterval && customInterval.from && customInterval.to ? (
                <span>
                  {format(customInterval.from, "d MMM yy ", { locale: ptBR })} -{" "}
                  {format(customInterval.to, "d MMM yy", { locale: ptBR })}
                </span>
              ) : (
                <span>Selecione duas datas</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              locale={ptBR}
              mode="range"
              selected={{
                from: customInterval?.from,
                to: customInterval?.to,
              }}
              onSelect={setCustomInterval}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      );
    }
    case "Todos": {
      return null;
    }
    case "Ano": {
      return (
        <Select
          defaultValue={years[0]}
          onValueChange={(value) => setYearInterval(value)}
          value={yearInterval}
        >
          <SelectTrigger
            className="w-full max-w-[300px] lg:w-[180px] rounded-lg focus:ring-0 focus:ring-offset-0"
            aria-label="Select a value"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {years.map((option) => (
              <SelectItem key={option} value={option} className="rounded-lg">
                {option.split(".SA")[0]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }
    case "Dias": {
      return (
        <Select
          defaultValue="15 dias"
          onValueChange={(value) => setDaysInterval(value)}
          value={daysInterval}
        >
          <SelectTrigger
            className="w-full lg:w-[180px] max-w-[300px] rounded-lg focus:ring-0 focus:ring-offset-0"
            aria-label="Select a value"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {days.map((option) => (
              <SelectItem key={option} value={option} className="rounded-lg">
                {option.split(".SA")[0]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }
    case "Mês": {
      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "justify-start max-w-[300px] lg:w-[180px] text-left font-normal w-full capitalize",
                !monthDate && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {monthDate ? (
                format(monthDate, "MMMM", { locale: ptBR })
              ) : (
                <span>Selecione um mês</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[210px] max-w-[300px] lg:w-[180px] p-0">
            <div className="p-4">
              <div className="flex items-center justify-between ">
                <Button
                  onClick={handleDecreaseMonthDateYear}
                  className="h-7 w-7 p-0 bg-background group border-input group border-[1px] hover:bg-muted"
                >
                  <ChevronLeft
                    className="shrink-0 text-input group-hover:text-white"
                    size={16}
                  />
                </Button>
                <h1>{monthDate.getFullYear()}</h1>
                <Button
                  onClick={handleIncreaseMonthDateYear}
                  className="h-7 w-7 p-0 bg-background group border-muted group border-[1px] hover:bg-muted"
                >
                  <ChevronRight
                    className="shrink-0 text-input group-hover:text-white"
                    size={16}
                  />
                </Button>
              </div>
              <div className="grid grid-cols-3 text-center gap-3 mt-4">
                {months.map((month) => (
                  <div
                    onClick={() => handleSelectMonth(months.indexOf(month))}
                    key={month}
                    data-active={monthDate.getMonth() === months.indexOf(month)}
                    className="hover:bg-muted rounded-md p-1 cursor-pointer data-[active=true]:bg-white data-[active=true]:text-black"
                  >
                    <p className="text-base">{month}</p>
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      );
    }
  }
}
