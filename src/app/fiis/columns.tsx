'use client'

import { FiiSummary } from '@/types/fiis'
import { currencyFormatter } from '@/utils/currency-formatter'
import { ColumnDef } from '@tanstack/react-table'

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  id: string
  amount: number
  status: 'pending' | 'processing' | 'success' | 'failed'
  email: string
}

export const columns: ColumnDef<FiiSummary>[] = [
  {
    accessorKey: 'fiiName',
    header: 'Nome',
    cell: ({ row }) => {
      return <div className=" font-medium">{row.getValue('fiiName')}</div>
    },
  },
  {
    accessorKey: 'quotes',
    header: 'Cotas',
    cell: ({ row }) => {
      return <div className=" font-medium">{row.getValue('quotes')}</div>
    },
  },
  {
    accessorKey: 'price',
    header: 'Preço',
    cell: ({ row }) => {
      const price = row.getValue('price') as number
      const changedValue =
        100 - (row.original.valueAtFirstPurchase * 100) / price

      return (
        <div className=" font-medium">
          {currencyFormatter(row.getValue('price'))}
          {changedValue > 0 ? (
            <span className="font-semibold text-green-500">
              {' '}
              ({changedValue.toFixed(1)}%)
            </span>
          ) : (
            <span className="font-semibold text-[#ed2846]">
              {' '}
              ({changedValue.toFixed(1)}%)
            </span>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'high/low',
    header: 'High/Low',
    cell: ({ row }) => {
      if (!row.original.high || !row.original.low) {
        return <p className="font-medium">Sem informações</p>
      }
      return (
        <div className=" font-medium">
          <span className="font-semibold ">
            {currencyFormatter(row.original.high)} /{' '}
          </span>
          <span className="font-semibold ">
            {currencyFormatter(row.original.low)}
          </span>
        </div>
      )
    },
  },
]
