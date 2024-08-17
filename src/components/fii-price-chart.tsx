'use client'
import { FiisHistory } from '@/types/fiis'
import React from 'react'
import { FiisController } from '@/controllers/fii'
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'
import { parse } from 'date-fns'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { BRL } from '@/utils/intlBr'
import { FiisPriceChartOptions } from './fiis-price-chart'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Props {
  history?: FiisHistory[]
  isLoading: boolean
  fiiFilter?: string
  setFiiFilter: (value: string) => void
}

export function FiisPriceChart({
  history,
  isLoading,
  fiiFilter,
  setFiiFilter,
}: Props) {
  if (isLoading || !history) return <h1>Loading</h1>

  const fiisController = new FiisController({
    history,
  })

  const { chartData, yAxisDomain } =
    fiisController.formatHistoryToChartData(fiiFilter)

  const selectOptions = [
    FiisPriceChartOptions.AllBaseTen,
    FiisPriceChartOptions.AllBaseOneHundred,
    FiisPriceChartOptions.AllBaseNinety,
    ...history.map((fii) => fii.fiiName),
  ]

  return (
    <div className="mt-8 mb-20 max-w-[760px] lg:w-full">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-semibold text-lg lg:text-xl">
            Histórico de Preços
          </h1>
          <p className="text-muted-foreground w-[85%] text-sm lg:text-base lg:w-full">
            Preço dos FIIS nos ultimos 12 meses
          </p>
        </div>
        <Select
          defaultValue={selectOptions[3]}
          value={fiiFilter}
          onValueChange={(value) => {
            setFiiFilter(value)
          }}
        >
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto focus:ring-0 focus:ring-offset-0"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {selectOptions.map((option) => (
              <SelectItem key={option} value={option} className="rounded-lg">
                {option.split('.SA')[0]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
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
            tickFormatter={() => ``}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                itemValueFormatter={(item) =>
                  BRL.format(parseFloat((item.value as number)?.toFixed(2)))
                }
              />
            }
          />
          {history?.map((fii, index) => (
            <Line
              key={fii.fiiName}
              dataKey={fii.fiiName}
              name={fii.fiiName.split('.SA')[0] + ' '}
              type="monotone"
              stroke={`hsl(var(--chart-${index + 1}))`}
              strokeWidth={2}
              dot={false}
            />
          ))}
        </LineChart>
      </ChartContainer>
    </div>
  )
}
