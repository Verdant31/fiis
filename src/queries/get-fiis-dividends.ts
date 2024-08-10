import { api } from '@/lib/axios'
import { toast } from 'sonner'

export type FiiDividends = {
  fiiName: string
  monthlyDividends: Record<string, number>
}

export const getFiisDividends = async () => {
  const response = await api.get('fiis-dividends')
  if (response?.data.status !== 200) {
    toast.error(response?.data?.message)
    return []
  }
  return response.data.results as FiiDividends[]
}
