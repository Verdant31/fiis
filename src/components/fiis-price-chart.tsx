'use client'
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'
import { parse, format } from 'date-fns'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { FiisHistory } from '@/types/fiis'
import { BRL } from '@/utils/intlBr'
import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import _ from 'lodash'

interface Props {
  fiisHistory: FiisHistory[]
}

export function FiisPriceChart({ fiisHistory }: Props) {
  const [fiiFilter, setFiiFilter] = useState(fiisHistory[0].fiiName)

  const flatDates = fiisHistory[0].history.map((h) =>
    format(new Date(h.date), 'dd/MM/yyyy'),
  )

  const filteredHistory = fiisHistory.filter((fii) => fii.fiiName === fiiFilter)

  const chartData = flatDates.map((date) => {
    const dateIndex = flatDates.indexOf(date)

    const fiisPricingAtDateIndex = filteredHistory.reduce(
      (acc: { [key: string]: number }, fii) => {
        acc[fii.fiiName] = fii.history[dateIndex]?.close
        return acc
      },
      {},
    )
    return { date, ...fiisPricingAtDateIndex }
  })

  const yAxisDomain = [
    (_.min(_.map(filteredHistory[0].history, (h) => h.close)) ?? 0) - 1,
    (_.max(_.map(filteredHistory[0].history, (h) => h.close)) ?? 0) + 1,
  ]
  return (
    <div className="mt-6 max-w-[760px]">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-semibold text-lg">Histórico de Preços</h1>
          <p className="text-muted-foreground w-[85%]">
            Preço dos FIIS nos ultimos 12 meses
          </p>
        </div>
        <Select value={fiiFilter} onValueChange={setFiiFilter}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {fiisHistory.map((fii) => (
              <SelectItem
                key={fii.fiiName}
                value={fii.fiiName}
                className="rounded-lg"
              >
                {fii.fiiName.split('.SA')[0]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <ChartContainer className=" mt-6" config={{} satisfies ChartConfig}>
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
          {fiisHistory.map((fii, index) => (
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