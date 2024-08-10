import { api } from '@/lib/axios'
import { FiisHistory } from '@/types/fiis'
import { toast } from 'sonner'

export const getFiisHistory = async () => {
  const response = await api.get('fiis-price-history')
  if (response?.data.status !== 200) {
    toast.error(response?.data?.message)
    return []
  }
  return response.data.results as FiisHistory[]
}
