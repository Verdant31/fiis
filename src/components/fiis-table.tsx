import { FiiSummary } from '@/types/fiis'
import React from 'react'
import { DataTable } from './table'
import { columns } from '@/app/fiis/columns'
import { Skeleton as ShadSkeleton } from './ui/skeleton'

interface Props {
  summary?: FiiSummary[]
  isLoading: boolean
  onClickRow: (fiiName: string) => void
}

export default function FiisTable({ summary, isLoading, onClickRow }: Props) {
  if (isLoading) return <Skeleton />
  return (
    <div className="my-6">
      {summary && (
        <DataTable
          onClickRow={(data) => onClickRow(data.fiiName + '.SA')}
          columns={columns}
          data={summary.filter((fii) => fii.quotes > 0)}
        />
      )}
    </div>
  )
}

const Skeleton = () => {
  return <ShadSkeleton className="my-6 h-[600px] w-full" />
}
