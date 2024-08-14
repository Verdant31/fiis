/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/lib/axios'
import { FiisHistory, FiiSummary } from '@/types/fiis'
import { Dispatch, SetStateAction } from 'react'

interface UseCloudflareModelProps {
  modelInput?: string
  summary?: FiiSummary[]
  fiisHistory?: FiisHistory[]
  setModelInput?: Dispatch<SetStateAction<string>>
}

export interface CloudflareModelResponse {
  result: {
    response: string
  }
  success: boolean
  errors: any[]
  messages: any[]
}

export const useCloudflareModel = ({
  modelInput,
  summary,
  fiisHistory,
  setModelInput,
}: UseCloudflareModelProps) => {
  const query = useQuery(
    ['cloudflare'],
    async () => {
      const { data, status } = await api.post('ai', {
        modelInput,
        summary,
        fiisHistory,
      })

      if (status !== 200 || data?.errors?.length > 0) {
        toast.error(
          'Houve um erro ao tentar converter sua query, tente reformula-lá ou contate o administrador',
        )
        return undefined
      }

      setModelInput && setModelInput('')
      return data?.response as CloudflareModelResponse
    },
    {
      refetchOnWindowFocus: false,
      enabled:
        Boolean((summary ?? [])?.length > 0) &&
        Boolean((fiisHistory ?? [])?.length > 0) &&
        Boolean(modelInput && modelInput.length > 0),
    },
  )
  return query
}
