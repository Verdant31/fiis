'use client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormInputData, formSchema } from '@/lib/forms/create-fii-operation'
import { RegisterFiiOperationForm } from '@/components/register-fii-operation-form'
import UploadFiisModelForm from '@/components/upload-fiis-model-form'

export default function RegisterOperations() {
  const methods = useForm<FormInputData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      creationType: 'unique',
      operationType: 'purchase',
      name: 'XPML11.SA',
      price: (60.48).toString(),
      quotes: '24',
      cnpj: '28.757.546/0001-00',
    },
  })

  return (
    <FormProvider {...methods}>
      <main className="max-w-sm mx-auto mt-6">
        <h1 className="text-2xl font-semibold ">Cadastrar nova operação</h1>
        <p className="text-sm text-muted-foreground ">
          Aqui você pode cadastrar suas operações uma por uma ou utilizar um{' '}
          <a className="underline" href="./modelo.csv">
            modelo CSV
          </a>{' '}
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
                  onChange(value)
                  methods.clearErrors()
                  methods.resetField('file')
                }}
                defaultValue="unique"
                className="mt-4"
              >
                <TabsList className="lg:mb-8 grid grid-cols-2  lg:w-[400px] mb-4">
                  <TabsTrigger value="unique">Individual</TabsTrigger>
                  <TabsTrigger value="multiple">Mutiplos</TabsTrigger>
                </TabsList>
                <TabsContent value="unique">
                  <RegisterFiiOperationForm />
                </TabsContent>
                <TabsContent value="multiple">
                  <UploadFiisModelForm />
                </TabsContent>
              </Tabs>
            )
          }}
        />
      </main>
    </FormProvider>
  )
}