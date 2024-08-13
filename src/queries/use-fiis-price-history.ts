import { useQuery } from '@tanstack/react-query'
import { FiisHistory } from '@/types/fiis'
import { toast } from 'sonner'
import { api } from '@/lib/axios'
import { YahooApiInternalError } from '@/lib/exceptions'

export const useFiisPriceHistory = () => {
  const query = useQuery(['get-fiis-price-history'], async () => {
    const response = await api.get('fiis/price-history')
    if (response?.data.status !== 200) {
      toast.error(response?.data?.message)
      throw new YahooApiInternalError()
    }
    return response.data.results as FiisHistory[]
  })
  return query
}
