'use client'
import Articles from '@/components/articles'
import FiisCarousel from '@/components/fiis-carousel'
import { FiisDividendsChart } from '@/components/fiis-dividends-chart'
import { FiisPriceChart } from '@/components/fiis-price-chart'

export default function Home() {
  return (
    <main className="w-[90%] mx-auto mt-6 overflow-hidden lg:w-[calc(100%-48px)] lg:max-w-[1400px]">
      <FiisCarousel />
      <div className="lg:flex lg:items-start lg:gap-16 lg:mt-4 2xl:gap-24">
        <FiisPriceChart />
        <FiisDividendsChart />
      </div>
      <Articles />
    </main>
  )
}
