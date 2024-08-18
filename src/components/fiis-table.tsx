import { FiisOperation, FiiSummary } from '@/types/fiis'
import React, { useState } from 'react'
import { DataTable } from './table'
import {
  fiisSummaryColumns,
  operationsSummaryColumns,
} from '@/app/fiis/columns'
import { Skeleton as ShadSkeleton } from './ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'

interface Props {
  summary: FiiSummary[]
  operations: FiisOperation[]
  isLoading: boolean
}

export default function FiisTable({ summary, isLoading, operations }: Props) {
  const [summarySorting, setSummarySorting] = useState<SortingState>([])
  const [operationsSorting, setOperationsSorting] = useState<SortingState>([])

  const summaryTable = useReactTable({
    data: summary,
    columns: fiisSummaryColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSummarySorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting: summarySorting,
    },
    initialState: {
      pagination: {
        pageSize: 8,
      },
    },
  })

  const operationsTable = useReactTable({
    data: operations,
    columns: operationsSummaryColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setOperationsSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting: operationsSorting,
    },
    initialState: {
      pagination: {
        pageSize: 11,
      },
    },
  })

  if (isLoading || !summary) return <Skeleton />

  return (
    <div className="lg:basis-[50%] mb-4 mt-6">
      <div>
        <Tabs defaultValue="fiis">
          <TabsList className="grid grid-cols-2 w-[200px] mb-4">
            <TabsTrigger value="fiis">FIis</TabsTrigger>
            <TabsTrigger value="operations">Operações</TabsTrigger>
          </TabsList>
          <TabsContent value="fiis">
            <DataTable className="h-[720px]" table={summaryTable} />
          </TabsContent>
          <TabsContent value="operations">
            <DataTable className="h-[720px]" table={operationsTable} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

const Skeleton = () => {
  return <ShadSkeleton className="my-6 h-[600px] w-full" />
}
