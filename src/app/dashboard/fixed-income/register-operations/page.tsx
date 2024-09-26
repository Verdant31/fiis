"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormInputData,
  formSchema,
} from "@/lib/forms/create-fixed-income-operation";
import { RegisterFixedIncomeForm } from "@/components/register-fixed-income-form";
import { UploadOperationsModelForm } from "@/components/upload-fiis-model-form";
import { addYears } from "date-fns";

export default function RegisterOperations() {
  const methods = useForm<FormInputData>({
    resolver: zodResolver(formSchema),
    shouldFocusError: false,
    defaultValues: {
      creationType: "unique",
      companyName: "Stocks.tr LTDA",
      investedValue: "5000",
      dueDate: new Date(),
      purchaseDate: addYears(new Date(), 1),
      incomes: [
        {
          type: "cdi",
          value: 120,
        },
      ],
    },
  });

  return (
    <div className="w-[100vw] flex flex-col items-center px-6 my-6">
      <FormProvider {...methods}>
        <div>
          <h1 className="text-2xl font-semibold ">Cadastrar nova operação</h1>
          <p className="text-sm text-muted-foreground ">
            Aqui você pode cadastrar suas operações uma por uma ou utilizar um{" "}
            <a className="underline" href="./modelo_fiis.csv">
              modelo CSV
            </a>{" "}
            para cadastrar multiplas operações de uma vez.
          </p>
          <Controller
            name="creationType"
            control={methods.control}
            render={({ field: { onChange, value } }) => {
              return (
                <Tabs
                  value={value}
                  onValueChange={(value) => {
                    onChange(value);
                    methods.clearErrors();
                    methods.resetField("file");
                  }}
                  defaultValue="unique"
                  className="mt-4"
                >
                  <TabsList className="lg:mb-8 grid grid-cols-2  lg:w-[400px] mb-4">
                    <TabsTrigger value="unique">Individual</TabsTrigger>
                    <TabsTrigger value="multiple">Mutiplos</TabsTrigger>
                  </TabsList>
                  <TabsContent value="unique">
                    <RegisterFixedIncomeForm />
                  </TabsContent>
                  <TabsContent value="multiple">
                    <UploadOperationsModelForm stockType="fixed-income" />
                  </TabsContent>
                </Tabs>
              );
            }}
          />
        </div>
      </FormProvider>
    </div>
  );
}
