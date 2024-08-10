'use client'
import FiisCarousel from '@/components/fiis-carousel'
import { FiisDividendsChart } from '@/components/fiis-dividends-chart'
import { FiisPriceChart } from '@/components/fiis-price-chart'
import { getFiisDividends } from '@/queries/get-fiis-dividends'
import { getFiisHistory } from '@/queries/get-fiis-history'
import { useQuery } from '@tanstack/react-query'

export default function Home() {
  const { data: fiisHistory, isLoading } = useQuery(
    ['get-fiis-price-history'],
    {
      queryFn: async () => await getFiisHistory(),
      // enabled: false,
    },
  )

  const { data } = useQuery(['get-fiis-dividends'], {
    queryFn: async () => await getFiisDividends(),
  })

  if (!isLoading && fiisHistory?.length === 0) return <div>no fiisHistory</div>

  return (
    <main className="w-[90%] mx-auto mt-6 overflow-hidden lg:w-full lg:ml-12">
      <FiisCarousel />
      {fiisHistory && (
        <div>
          <FiisPriceChart
            fiisHistory={fiisHistory.filter((fii) =>
              fii.history.every((payment) => payment.close > 20),
            )}
          />
        </div>
      )}
      {data && <FiisDividendsChart fiisDividends={data} />}

      {/* <div className="flex items-center justify-between mb-8">
        <div className="w-[450px ml-5">
          <h1 className="text-white text-4xl font-bold tracking-wide">
            ROAD TO THE 300K
          </h1>
          <h1 className="text-white text-sm font-thin tracking-wide w-[400px]">
            Analytical web dashboard to help me reach my goal of R$30000,00 by
            2025
          </h1>
        </div>
        <AnalyticsCards fiis={fiis} isLoading={isLoading} />
      </div>
      <div className="flex items-center justify-between gap-[60px] pt-4 ">
        <MinimalFiisList fiis={fiis} isLoading={isLoading} />
      </div> */}
    </main>
  )
}
