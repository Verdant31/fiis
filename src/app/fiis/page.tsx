'use client'
import { useFiisSummary } from '@/queries/use-fiis-summary'
import FiisTable from '@/components/fiis-table'
import { Button } from '@/components/ui/button'
import { useRef, useState } from 'react'
import { useFiisPriceHistory } from '@/queries/use-fiis-price-history'

import { FiisPriceChart } from '@/components/fii-price-chart'

export default function Fiis() {
  const [fiiFilter, setFiiFilter] = useState<string>()

  const { data: summary, isLoading } = useFiisSummary()
  const { data: fiisHistory } = useFiisPriceHistory()

  const chartDivRef = useRef<HTMLDivElement>(null)

  return (
    <main className="w-[90%] mx-auto mt-6 overflow-hidden lg:w-[calc(100%-48px)] lg:max-w-[1400px]">
      <div className="bg-zinc-900 p-6 rounded-md">
        <p className="text-2xl font-semibold">Seus FIIs</p>
        <p className="mt-2">
          Aqui você tem acesso à algumas informações sobre todos seus fundos,
          como: quotação, histórico de compras, P/VP.
        </p>
        <Button className="mt-4 ">Cadastrar nova operação</Button>
      </div>
      <FiisTable
        onClickRow={(fiiName) => {
          setFiiFilter(fiiName)
          chartDivRef.current?.scrollIntoView({ behavior: 'smooth' })
        }}
        summary={summary}
        isLoading={isLoading}
      />
      <div ref={chartDivRef}>
        <FiisPriceChart
          isLoading={isLoading}
          setFiiFilter={setFiiFilter}
          fiiFilter={fiiFilter}
          history={fiisHistory}
        />
      </div>
    </main>
  )
}
