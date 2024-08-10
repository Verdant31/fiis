'use client'
import { Bar, BarChart, XAxis, YAxis } from 'recharts'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { FiiDividends } from '@/queries/get-fiis-dividends'
import { BRL } from '@/utils/intlBr'

const chartConfig = {
  dividends: {
    label: 'Dividends',
  },
} satisfies ChartConfig

interface Props {
  fiisDividends: FiiDividends[]
}

export function FiisDividendsChart({ fiisDividends }: Props) {
  const chartData = fiisDividends
    .map((fiiDividends) => {
      const months = Object.keys(fiiDividends.monthlyDividends)
      return {
        fii: fiiDividends.fiiName.split('11.SA')[0],
        dividends: months.reduce((acc, month) => {
          acc += fiiDividends.monthlyDividends[month]
          return acc
        }, 0),
      }
    })
    .sort((a, b) => b.dividends - a.dividends)
    .slice(0, 5)

  return (
    <div className="mt-8 max-w-[760px]">
      <div>
        <h1 className="font-semibold text-lg">Pagamento de dividendos</h1>
        <p className="text-muted-foreground w-[85%]">
          Top 5 maiores pagadores da carteira
        </p>
      </div>
      <ChartContainer className="mt-4 max-w-[95%]" config={chartConfig}>
        <BarChart
          accessibilityLayer
          data={chartData.map((fii, index) => ({
            ...fii,
            fill: `hsl(var(--chart-${index + 1}))`,
          }))}
          layout="vertical"
          margin={{
            left: 0,
          }}
        >
          <YAxis
            dataKey="fii"
            type="category"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value}
          />
          <XAxis dataKey="dividends" type="number" hide />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                itemValueFormatter={(item) =>
                  BRL.format(parseFloat((item.value as number)?.toFixed(2)))
                }
                hideLabel
              />
            }
          />
          <Bar dataKey="dividends" layout="vertical" radius={5} />
        </BarChart>
      </ChartContainer>
    </div>
  )
}
