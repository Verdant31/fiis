import { DividendPeriods, FiisOperation, FiiSummary } from '@/types/fiis'
import React, { useState } from 'react'
import { DataTable } from './table'
import { fiisSummaryColumns } from '@/app/fiis/columns'
import { Skeleton as ShadSkeleton } from './ui/skeleton'
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { useFiisDividends } from '@/queries/use-fiis-dividends'
import { FiisController } from '@/controllers/fii'
import { CartesianGrid, XAxis, Bar, BarChart, YAxis } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from './ui/chart'
import { currencyFormatter } from '@/utils/currency-formatter'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useWindowSize } from '@/hooks/use-window-size'
interface Props {
  summary: FiiSummary[]
  operations: FiisOperation[]
  isLoading: boolean
  onClickTableRow: (fiiName: string) => void
}

export default function FiisTable({
  summary,
  isLoading,
  operations,
  onClickTableRow,
}: Props) {
  const [summarySorting, setSummarySorting] = useState<SortingState>([])
  const [selectedPeriod, setSelectedPeriod] = useState<DividendPeriods>(
    DividendPeriods['6M'],
  )

  const { data: dividends, isLoading: isLoadingDividends } = useFiisDividends()
  const windowSize = useWindowSize()
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
    initialState: {},
  })

  if (isLoading || isLoadingDividends || !summary) return <Skeleton />

  const fiiController = new FiisController({ dividends, operations })

  const dividendsChartData =
    fiiController.getTotalDividendsPerMonth(selectedPeriod)

  return (
    <div className="flex mt-6 flex-col gap-4 lg:gap-12 lg:flex-row-reverse">
      <div className="lg:basis-[50%] ">
        <div className="flex mb-4  justify-between items-end">
          <div className="w-[65%]">
            <h1 className="text-xl font-semibold ">Dividendos</h1>
            <p className="text-muted-foreground text-sm">
              Valores de dividendos pagos pelos fundos nos ultimos meses
            </p>
          </div>
          <Select
            onValueChange={(value) => {
              console.log({ value })
              setSelectedPeriod(
                DividendPeriods[value as keyof typeof DividendPeriods],
              )
            }}
            defaultValue="6M"
          >
            <SelectTrigger
              className="w-[90px] rounded-lg sm:ml-auto focus:ring-0 focus:ring-offset-0"
              aria-label="Select a value"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {['1M', '3M', '6M', '12M', 'Total'].map((option) => (
                <SelectItem key={option} value={option} className="rounded-lg">
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <ChartContainer
          {...(windowSize.width &&
            windowSize.width > 1024 && {
              responsiveContainerWidth: '100%',
              responsiveContainerHeight: 500,
            })}
          config={{}}
        >
          <BarChart accessibilityLayer data={dividendsChartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              label="Dividendo"
              content={
                <ChartTooltipContent
                  itemValueFormatter={(item) =>
                    currencyFormatter(item.value as number)
                  }
                  hideLabel
                />
              }
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              domain={[0, 'dataMax + 100']}
              type="number"
              hide
            />
            <Bar
              name="Dividendo"
              dataKey="total"
              fill="hsl(var(--chart-1))"
              radius={8}
              amplitude={300}
            />
          </BarChart>
        </ChartContainer>
      </div>
      <div className="lg:basis-[50%]">
        <div className="flex mb-4  justify-between items-end">
          <div className="w-[90%] lg:w-full">
            <h1 className="text-xl font-semibold ">Lista</h1>
            <p className="text-muted-foreground text-sm">
              Tabela com todos os seus fundos (incluindo os que estão com as
              cotas zeradas)
            </p>
          </div>
        </div>
        <DataTable
          onClickRow={(row) => onClickTableRow(row.fiiName)}
          className="max-h-[630px] md:h-[540px] lg:h-[490px]"
          table={summaryTable}
        />
      </div>
    </div>
  )
}

const Skeleton = () => {
  return <ShadSkeleton className="my-6 h-[600px] w-full" />
}
