'use client'

import { DataTableColumnHeader } from '@/components/table'
import { FiisOperation, FiiSummary } from '@/types/fiis'
import { currencyFormatter } from '@/utils/currency-formatter'
import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'

export const fiisSummaryColumns: ColumnDef<FiiSummary>[] = [
  {
    accessorKey: 'fiiName',
    header: 'Nome',
    cell: ({ row }) => {
      return <div className=" font-medium">{row.getValue('fiiName')}</div>
    },
  },
  {
    accessorKey: 'quotes',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Cotas" />
    },
    cell: ({ row }) => {
      return <div className=" font-medium">{row.getValue('quotes')}</div>
    },
  },
  {
    accessorKey: 'price',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Preço" />
    },
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
        <div className="font-medium flex flex-col md:block">
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

export const operationsSummaryColumns: ColumnDef<FiisOperation>[] = [
  {
    accessorKey: 'fiiName',
    header: 'Nome',
    cell: ({ row }) => {
      return <div className=" font-medium">{row.getValue('fiiName')}</div>
    },
  },
  {
    accessorKey: 'qty',
    header: 'Cotas',
    cell: ({ row }) => {
      return <div className=" font-medium">{row.getValue('qty')}</div>
    },
  },
  {
    accessorKey: 'quotationValue',
    header: 'Preço',
    cell: ({ row }) => {
      return (
        <div className=" font-medium">
          {currencyFormatter(row.getValue('quotationValue'))}
        </div>
      )
    },
  },
  {
    accessorKey: 'date',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Data" />
    },
    sortingFn: (a, b) => {
      const dateA = new Date(a.getValue('date'))
      const dateB = new Date(b.getValue('date'))

      if (dateA < dateB) {
        return -1
      }
      if (dateA > dateB) {
        return 1
      }
      return 0
    },
    cell: ({ row }) => {
      console.log()
      return (
        <div className="font-medium">
          {format(new Date(row.getValue('date')), 'dd/MM/yyyy')}
        </div>
      )
    },
  },
]
