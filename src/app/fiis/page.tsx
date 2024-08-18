'use client'
import { useFiisSummary } from '@/queries/use-fiis-summary'
import FiisTable from '@/components/fiis-table'
import { Button } from '@/components/ui/button'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton as ShadSkeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useState } from 'react'
import FiiDetails from '@/components/fii-details'

export default function Fiis() {
  const [selectedFiiName, setSelectedFiiName] = useState<string>()
  const { data: summary, isLoading } = useFiisSummary()

  const selectedFii = summary?.find((fii) => fii.fiiName === selectedFiiName)
  return (
    <main className="w-[90%] mx-auto mt-6 overflow-hidden lg:w-[calc(100%-48px)] lg:max-w-[1400px]">
      <Tabs defaultValue="details">
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
        <TabsContent value="details">
          {summary && (
            <div>
              <h1 className="text-xl font-semibold pl-1 ">Fundo</h1>
              <p className="text-sm text-muted-foreground pl-1 w-[90%] mt-1">
                Escolha o fundo entre o seu portifólio que deseja ver mais
                informações sobre.
              </p>
              <Select
                value={selectedFiiName}
                onValueChange={(value) => {
                  setSelectedFiiName(value)
                }}
              >
                <SelectTrigger
                  className="w-[200px] rounded-lg mt-2 sm:ml-auto focus:ring-0 focus:ring-offset-0"
                  aria-label="Select a value"
                >
                  <SelectValue placeholder="Selecione um fundo" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {summary
                    .map((fii) => fii.fiiName)
                    .map((option) => (
                      <SelectItem
                        key={option}
                        value={option}
                        className="rounded-lg"
                      >
                        {option.split('.SA')[0]}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {selectedFii && <FiiDetails fii={selectedFii} />}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </main>
  )
}
