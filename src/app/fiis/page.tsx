'use client'
import { useFiisSummary } from '@/queries/use-fiis-summary'
import FiisTable from '@/components/fiis-table'
import { Button } from '@/components/ui/button'

import { Tabs, TabsContent } from '@/components/ui/tabs'
import { Skeleton as ShadSkeleton } from '@/components/ui/skeleton'
import { useState } from 'react'
import FiiDetails from '@/components/fii-details'
import { useWindowSize } from '@/hooks/use-window-size'
import { ChevronRight } from 'lucide-react'

export default function Fiis() {
  const [tab, setTab] = useState('general')

  const [selectedFiiName, setSelectedFiiName] = useState<string>()
  const { data: summary, isLoading } = useFiisSummary()
  const window = useWindowSize()

  const selectedFii = summary?.find((fii) => fii.fiiName === selectedFiiName)

  return (
    <main className="w-[90%] mx-auto mt-6 overflow-hidden lg:w-[calc(100%-48px)] lg:max-w-[1400px] pb-20">
      <div className="flex items-center gap-2 lg:text-lg">
        <h1
          className={`cursor-pointer ${tab === 'details' && 'text-muted-foreground '}`}
          onClick={() => setTab('general')}
        >
          Fundos Imobiliários
        </h1>
        {tab === 'details' && (
          <div className="flex items-center gap-2">
            <ChevronRight className="shrink-0" size={24} />
            {selectedFiiName}
          </div>
        )}
      </div>
      <Tabs
        value={tab}
        onValueChange={(value: string) => {
          setTab(value)
        }}
        defaultValue="general"
      >
        <TabsContent value="general" className="mt-4">
          <div className="bg-zinc-900 p-6 rounded-md">
            <p className="text-2xl font-semibold">Seus FIIs</p>
            <p className="mt-2">
              Para verificar detalhes como: quotação, histórico de compras, P/VP
              basta clicar na linha da tabela referente ao FII que deseja ver
              mais informações.
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
              onClickTableRow={(value) => {
                setSelectedFiiName(value)
                setTab('details')
              }}
            />
          )}
        </TabsContent>
        <TabsContent value="details">
          {isLoading || !summary ? (
            <div>
              <ShadSkeleton className="mt-6 h-[30px] w-[110px]" />
              <ShadSkeleton className="mt-2 h-[30px] w-full max-w-[300px]" />
              <ShadSkeleton className="mt-2 h-[40px] w-[160px]" />
            </div>
          ) : (
            <div>
              {selectedFii && (
                <FiiDetails
                  windowWidth={window?.width ?? 0}
                  fiisLength={summary.length}
                  fii={selectedFii}
                  operations={selectedFii.operations}
                />
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </main>
  )
}
