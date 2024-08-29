import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/lib/axios'
import { YahooApiInternalError } from '@/lib/exceptions'
import { FiiSummary } from '@/types/fiis'

export const useFiisSummary = () => {
  const query = useQuery(['get-fiis-summary'], async () => {
    const response = await api.get('fiis/summary')
    if (response?.data.status !== 200) {
      toast.error(response?.data?.message)
      throw new YahooApiInternalError()
    }
    //  sort by quotes quantity
    const sortedResults = (response.data.results as FiiSummary[]).toSorted(
      (a, b) => b.quotes - a.quotes,
    )
    return sortedResults
  })

  return query
}
