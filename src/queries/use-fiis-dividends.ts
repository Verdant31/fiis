import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/lib/axios'
import { YahooApiInternalError } from '@/lib/exceptions'

export type Dividend = {
  date: string
  paymentPerQuote: number
  quotesAtPayment: number
  total: number
}

export type FiiDividends = {
  fiiName: string
  monthlyDividends: Record<string, Dividend>
}

export const useFiisDividends = () => {
  const query = useQuery(['get-fiis-dividends'], async () => {
    const response = await api.get('fiis/dividends')
    if (response?.data.status !== 200) {
      toast.error(response?.data?.message)
      throw new YahooApiInternalError()
    }
    return response.data.results as FiiDividends[]
  })

  return query
}
