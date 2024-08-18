import { useFiisPriceHistory } from '@/queries/use-fiis-price-history'
import { FiiSummary } from '@/types/fiis'
import { currencyFormatter } from '@/utils/currency-formatter'
import React from 'react'

interface Props {
  fii: FiiSummary
}

export default function FiiDetails({ fii }: Props) {
  const { data: priceHistory } = useFiisPriceHistory()
  const fiiPriceHistory = priceHistory?.find(
    (fiiHistory) => fiiHistory.fiiName === fii.fiiName + '.SA',
  )?.history
  console.log({ fiiPriceHistory })
  return (
    <div>
      <div className="mt-4 grid grid-cols-3 gap-4 ">
        <div className="space-y-2">
          <p className="bg-[#65a30d] w-[80%] py-1 pl-2  font-medium ">Preço</p>
          <p>{currencyFormatter(fii.price)}</p>
        </div>
        <div className="space-y-2">
          <p className="bg-[#65a30d] w-[80%] py-1 pl-2  font-medium ">Cotas</p>
          <p>{fii.quotes}</p>
        </div>
        <div className="space-y-2">
          <p className="bg-[#65a30d] w-[80%] py-1 pl-2  font-medium ">P/VP</p>
          <p>{fii?.pvp ?? 'N/A'}</p>
        </div>
        <div className="space-y-2">
          <p className="bg-[#65a30d] w-[80%] py-1 pl-2  font-medium ">
            High/Low
          </p>
          {fii?.high && fii?.low ? (
            <p>
              {currencyFormatter(fii.low)} / {currencyFormatter(fii.high)}
            </p>
          ) : (
            <p>N/A</p>
          )}
        </div>
        <div className="space-y-2">
          <p className="bg-[#65a30d] w-[80%] py-1 pl-2  font-medium ">
            Yield (Mensal)
          </p>
          <p>{fii.monthlyYield ? fii.monthlyYield + '%' : 'N/A'}</p>
        </div>
        <div className="space-y-2">
          <p className="bg-[#65a30d] w-[80%] py-1 pl-2  font-medium ">
            Yield (Anual)
          </p>
          <p>{fii.annualYield ? fii.annualYield + '%' : 'N/A'}</p>
        </div>
      </div>
    </div>
  )
}
