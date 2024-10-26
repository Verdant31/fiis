/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-useless-rename */
import React, { ReactNode, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { RegisterFiiOperationForm } from "./fiis/register-fii-form";
import {
  FormInputData as FiiFormInputData,
  formSchema as fiiFormSchema,
} from "@/lib/forms/create-fii-operation";
import {
  FormInputData as FixedIncomeFormInputData,
  formSchema as fixedIncomeFormSchema,
} from "@/lib/forms/create-fixed-income-operation";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { ChevronLeft } from "lucide-react";
import { RegisterFixedIncomeForm } from "./register-fixed-income-form";
import { addYears, subYears } from "date-fns";

export function Onboard() {
  const [step, setStep] = useState<ReactNode>();

  const InitialStep = () => {
    return (
      <div className="max-w-[350px] mx-auto mt-44">
        <h1 className="text-4xl font-black">BEM VINDO AO STOCKS.TR!</h1>
        <p className="text-lg text-zinc-100 font-medium mt-2">
          Seu primeiro passo foi dado 🚀.
        </p>
        <p className="text text-muted-foreground font-medium mt-2">
          Para começar a usar nossa plataforma, é necessário ja ter algum tipo
          de investimento seja ele renda fixa ou cotas de fundo imobiliário.
        </p>
        <div className="flex flex-col gap-4 mt-6">
          <Button onClick={() => setStep(<FixedIncomeForm />)}>
            Cadastrar renda fixa
          </Button>
          <Button onClick={() => setStep(<FiisForm />)}>Cadastrar fundo</Button>
        </div>
      </div>
    );
  };

  const FiisForm = () => {
    const methods = useForm<FiiFormInputData>({
      resolver: zodResolver(fiiFormSchema),
      defaultValues: {
        operationType: "purchase",
        creationType: "unique",
        name: "XPML11.SA",
        price: (60.48).toString(),
        quotes: "24",
        cnpj: "28.757.546/0001-00",
      },
    });

    return (
      <FormProvider {...methods}>
        <div className="max-w-sm mx-auto mt-8">
          <ChevronLeft onClick={() => setStep(<InitialStep />)} />
          <h1 className="mt-6 text-2xl font-semibold ">
            Cadastrar nova operação
          </h1>
          <p className="text-sm text-muted-foreground ">
            Aqui você deve cadastrar sua primeira operação para poder desfrutar
            das funcionalidades da plataforma.
          </p>{" "}
          <RegisterFiiOperationForm
            redirectAfterRegister={() =>
              (window.location.href = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/home`)
            }
          />
        </div>
      </FormProvider>
    );
  };

  const FixedIncomeForm = () => {
    const methods = useForm<FixedIncomeFormInputData>({
      resolver: zodResolver(fixedIncomeFormSchema),
      shouldFocusError: false,
      defaultValues: {
        creationType: "unique",
        companyName: "Stocks.tr LTDA",
        investedValue: "5000",
        purchaseDate: subYears(new Date(), 1),
        dueDate: addYears(new Date(), 1),
        incomes: [
          {
            type: "cdi",
            value: 120,
          },
        ],
      },
    });
    return (
      <FormProvider {...methods}>
        <div className="max-w-sm mx-auto mt-8">
          <ChevronLeft onClick={() => setStep(<InitialStep />)} />
          <h1 className="mt-6 text-2xl font-semibold ">
            Cadastrar nova operação
          </h1>
          <p className="text-sm text-muted-foreground ">
            Aqui você deve cadastrar sua primeira operação para poder desfrutar
            das funcionalidades da plataforma.
          </p>{" "}
          <RegisterFixedIncomeForm
            redirectAfterRegister={() =>
              (window.location.href = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/fixed-income/general`)
            }
          />
        </div>
      </FormProvider>
    );
  };

  useEffect(() => {
    if (!step) setStep(<InitialStep />);
  }, [step]);

  return <main className="w-full h-[100vh] ">{step}</main>;
}
