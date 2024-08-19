/* eslint-disable react-hooks/exhaustive-deps */
import { FiisController } from '@/controllers/fii'
import { useFiisPriceHistory } from '@/queries/use-fiis-price-history'
import { FiiSummary } from '@/types/fiis'
import { currencyFormatter } from '@/utils/currency-formatter'
import React, { useMemo } from 'react'
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from './ui/chart'
import { parse } from 'date-fns'
import { Skeleton as ShadSkeleton } from './ui/skeleton'
import { operationsSummaryColumns } from '@/app/fiis/columns'
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
} from '@tanstack/react-table'
import { DataTable } from './table'

interface Props {
  fii: FiiSummary
  fiisLength: number
}

export default function FiiDetails({ fii, fiisLength }: Props) {
  const { data: priceHistory, isLoading } = useFiisPriceHistory()

  const fiisController = new FiisController({ history: priceHistory ?? [] })
  const { chartData, yAxisDomain } = fiisController.formatHistoryToChartData(
    fii.fiiName + '.SA',
  )

  const randomChartColorIndex = useMemo(
    () => Math.floor(Math.random() * fiisLength + 1),
    [fii],
  )
  const fiiColor = `hsl(var(--chart-${randomChartColorIndex}))`
  const operationsTable = useReactTable({
    data: fii.operations,
    columns: operationsSummaryColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 11,
      },
    },
  })

  return (
    <div>
      <div className="mt-6 grid grid-cols-3 gap-4 ">
        <div className="space-y-2">
          <p
            style={{ backgroundColor: fiiColor }}
            className="w-[80%] py-1 pl-2  font-medium rounded-[2px] "
          >
            Preço
          </p>
          <p>{currencyFormatter(fii.price)}</p>
        </div>
        <div className="space-y-2">
          <p
            style={{ backgroundColor: fiiColor }}
            className="w-[80%] py-1 pl-2  font-medium rounded-[2px] "
          >
            Cotas
          </p>
          <p>{fii.quotes}</p>
        </div>
        <div className="space-y-2">
          <p
            style={{ backgroundColor: fiiColor }}
            className="w-[80%] py-1 pl-2  font-medium rounded-[2px] "
          >
            P/VP
          </p>
          <p>{fii?.pvp ?? 'N/A'}</p>
        </div>
        <div className="space-y-2">
          <p
            style={{ backgroundColor: fiiColor }}
            className="w-[80%] py-1 pl-2  font-medium rounded-[2px] "
          >
            High/Low
          </p>
          {fii?.high && fii?.low ? (
            <p>
              {currencyFormatter(fii.low)} / {currencyFormatter(fii.high)}
            </p>
          ) : (
            <p>N/A</p>
          )}
        </div>
        <div className="space-y-2">
          <p
            style={{ backgroundColor: fiiColor }}
            className="w-[80%] py-1 pl-2  font-medium rounded-[2px] "
          >
            Yield (Mensal)
          </p>
          <p>{fii.monthlyYield ? fii.monthlyYield + '%' : 'N/A'}</p>
        </div>
        <div className="space-y-2">
          <p
            style={{ backgroundColor: fiiColor }}
            className="w-[80%] py-1 pl-2  font-medium rounded-[2px] "
          >
            Yield (Anual)
          </p>
          <p>{fii.annualYield ? fii.annualYield + '%' : 'N/A'}</p>
        </div>
      </div>

      {!priceHistory || isLoading ? (
        <ShadSkeleton className="w-full h-[300px] mt-4" />
      ) : (
        <ChartContainer className="mt-6" config={{} satisfies ChartConfig}>
          <LineChart accessibilityLayer data={chartData} margin={{}}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = parse(value, 'dd/MM/yyyy', new Date())
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })
              }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              type="number"
              domain={yAxisDomain}
              hide
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  itemValueFormatter={(item) =>
                    currencyFormatter(item.value as number)
                  }
                />
              }
            />
            <Line
              key={fii.fiiName + '.SA'}
              dataKey={fii.fiiName + '.SA'}
              name={fii.fiiName.split('.SA')[0] + ' '}
              type="monotone"
              stroke={fiiColor}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      )}
      <DataTable
        className={`h-[${170 + fii.operations.length * 52}px] mt-6`}
        table={operationsTable}
      />
    </div>
  )
}
