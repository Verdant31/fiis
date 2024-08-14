import { FiisPriceChartOptions } from '@/components/fiis-price-chart'
import { CloudflareModelResponse } from '@/queries/use-cloudflare-model'
import { FiiDividends } from '@/queries/use-fiis-dividends'
import { FiisHistory, FiisOperation, FiiSummary } from '@/types/fiis'
import { format, subMonths } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import _ from 'lodash'

export class FiisController {
  public history: FiisHistory[] = []
  public operations: FiisOperation[] = []
  public dividends: FiiDividends[] = []
  public summary: FiiSummary[] = []

  constructor(data: Partial<FiisController>) {
    Object.assign(this, data)
  }

  getTotalValueInvested() {
    return this.operations.reduce((acc, fiiOperations) => {
      const total = fiiOperations.operations.reduce(
        (operationAcc, operation) => {
          if (operation.type === 'sale') {
            operationAcc -= operation.qty * operation.quotationValue
          } else {
            operationAcc += operation.qty * operation.quotationValue
          }
          return operationAcc
        },
        0,
      )
      acc += total
      return acc
    }, 0)
  }

  getTotalDividends() {
    return this.dividends.reduce((acc, fiiDividends) => {
      const months = Object.keys(fiiDividends.monthlyDividends)
      const totalFiiDividends = months.reduce((acc, month) => {
        acc += fiiDividends.monthlyDividends[month]
        return acc
      }, 0)

      acc += totalFiiDividends
      return acc
    }, 0)
  }

  formatHistoryToChartData(fiiFilter?: string, data?: CloudflareModelResponse) {
    if (data && data.errors.length === 0) {
      const message = data?.result.response
      const startIndex = message.indexOf('{')
      const endIndex = message.lastIndexOf('}') + 1

      const jsonString = message.substring(startIndex, endIndex)
      const jsonObject = JSON.parse(jsonString)
      console.log(data, jsonObject)
    }
    const filter = fiiFilter ?? this.history[0].fiiName
    const flatDates = this.history[0].history.map((h) =>
      format(new Date(h.date), 'dd/MM/yyyy'),
    )

    const filterIsCustomOption = Object.values(FiisPriceChartOptions).includes(
      filter as FiisPriceChartOptions,
    )

    let filteredFiis = this.history.filter((fii) => fii.fiiName === filter)

    if (filterIsCustomOption) {
      switch (filter) {
        case FiisPriceChartOptions.AllBaseTen:
          filteredFiis = this.history.filter((fii) => fii.history[0].close < 30)
          break
        case FiisPriceChartOptions.AllBaseOneHundred:
          filteredFiis = this.history.filter(
            (fii) => fii.history[0].close >= 100,
          )
          break
        case FiisPriceChartOptions.AllBaseNinety:
          filteredFiis = this.history.filter(
            (fii) => fii.history[0].close > 30 && fii.history[0].close < 100,
          )
          break
      }
    }

    const chartData = flatDates.map((date) => {
      const dateIndex = flatDates.indexOf(date)

      const fiisPricingAtDateIndex = filteredFiis.reduce(
        (acc: { [key: string]: number }, fii) => {
          acc[fii.fiiName] = fii.history[dateIndex]?.close
          return acc
        },
        {},
      )
      return { date, ...fiisPricingAtDateIndex }
    })

    const yAxisDomain = [
      (_.min(_.map(filteredFiis[0].history, (h) => h.close)) ?? 0) - 1,
      (_.max(_.map(filteredFiis[0].history, (h) => h.close)) ?? 0) + 1,
    ]

    return {
      yAxisDomain,
      chartData,
    }
  }

  nextMonthDividends() {
    return this.dividends.reduce((acc, fiiDividends) => {
      const monthKey = format(subMonths(new Date(), 1), 'MM', { locale: ptBR })
      const lastMonth = `${new Date().getFullYear()}/${monthKey}`
      acc += fiiDividends.monthlyDividends[lastMonth]
      return acc
    }, 0)
  }
}
