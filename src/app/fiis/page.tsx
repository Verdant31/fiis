'use client'
import { useFiisSummary } from '@/queries/use-fiis-summary'
import FiisTable from '@/components/fiis-table'
import { Button } from '@/components/ui/button'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton as ShadSkeleton } from '@/components/ui/skeleton'

export default function Fiis() {
  const { data: summary, isLoading } = useFiisSummary()

  return (
    <main className="w-[90%] mx-auto mt-6 overflow-hidden lg:w-[calc(100%-48px)] lg:max-w-[1400px]">
      <Tabs defaultValue="account">
        <TabsList className="grid grid-cols-2 w-[400px] mb-4">
          <TabsTrigger value="general">Visão geral</TabsTrigger>
          <TabsTrigger value="details">Detalhes</TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          <div className="bg-zinc-900 p-6 rounded-md">
            <p className="text-2xl font-semibold">Seus FIIs</p>
            <p className="mt-2">
              Aqui você tem acesso à algumas informações sobre todos seus
              fundos, como: quotação, histórico de compras, P/VP.
            </p>
            <Button className="mt-4 ">Cadastrar nova operação</Button>
          </div>
          {isLoading || !summary ? (
            <ShadSkeleton className="my-6 h-[600px] w-full" />
          ) : (
            <FiisTable
              operations={summary.map((fii) => fii.operations).flat()}
              summary={summary.filter((fii) => fii.quotes > 0)}
              isLoading={isLoading}
            />
          )}
        </TabsContent>
        <TabsContent value="details">details tab</TabsContent>
      </Tabs>
    </main>
  )
}
