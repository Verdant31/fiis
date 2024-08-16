import { FiisPriceChartOptions } from '@/components/fiis-price-chart'
import { ParsedCloduflareResponse } from '@/queries/use-cloudflare-model'
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

  formatHistoryToChartData(
    fiiFilter?: string,
    cloudflareData?: ParsedCloduflareResponse,
  ) {
    let chartType = 'line'
    const filter = fiiFilter ?? this.history[0].fiiName
    const flatDates = this.history[0].history.map((h) =>
      format(new Date(h.date), 'dd/MM/yyyy'),
    )

    let filteredFiis = this.history.filter((fii) => fii.fiiName === filter)
    let filteredFlatDates = flatDates

    const filterIsCustomOption = Object.values(FiisPriceChartOptions).includes(
      filter as FiisPriceChartOptions,
    )

    if (cloudflareData) {
      filteredFiis =
        cloudflareData.funds[0] === 'all'
          ? this.history
          : this.history.filter((fii) =>
              cloudflareData?.funds.includes(fii.fiiName),
            )
      switch (cloudflareData?.context) {
        case 'price history': {
          filteredFlatDates = flatDates.filter((date) =>
            cloudflareData?.period.includes(date.slice(3, 10)),
          )
          break
        }
        case 'dividends': {
          filteredFlatDates = cloudflareData.period
          const filteredDividends =
            cloudflareData.funds[0] === 'all'
              ? this.dividends
              : this.dividends.filter((fii) =>
                  cloudflareData?.funds.includes(fii.fiiName),
                )
          filteredFiis = filteredDividends.map((fiiDividend) => {
            return {
              fiiName: fiiDividend.fiiName,
              history: cloudflareData.period.map((month) => ({
                close: fiiDividend.monthlyDividends[month],
                date: new Date(),
              })),
            }
          })
          chartType = 'bar'
        }
      }
    } else if (filterIsCustomOption) {
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

    const chartData = filteredFlatDates.map((date, index) => {
      const fiisPricingAtDateIndex = filteredFiis.reduce(
        (acc: { [key: string]: number }, fii) => {
          const close = fii.history[index]?.close
          if (close && close > 0) {
            acc[fii.fiiName] = close
          }
          return acc
        },
        {},
      )
      Object.keys(fiisPricingAtDateIndex).forEach((fii) => {
        if (
          fiisPricingAtDateIndex[fii] === undefined ||
          fiisPricingAtDateIndex[fii] === 0
        ) {
          delete fiisPricingAtDateIndex[fii]
        }
      })
      return { date, ...fiisPricingAtDateIndex }
    })

    const yAxisDomain = [
      (_.min(
        _.map(
          filteredFiis[0].history.filter((h) =>
            filteredFlatDates.includes(format(h.date, 'dd/MM/yyyy')),
          ),
          (h) => h.close,
        ),
      ) ?? 0) - 1,
      (_.max(
        _.map(
          filteredFiis[0].history.filter((h) =>
            filteredFlatDates.includes(format(h.date, 'dd/MM/yyyy')),
          ),
          (h) => h.close,
        ),
      ) ?? 0) + 1,
    ]

    return {
      yAxisDomain,
      chartData,
      chartType,
    }
  }

  nextMonthDividends() {
    return this.dividends.reduce((acc, fiiDividends) => {
      const monthKey = format(subMonths(new Date(), 1), 'MM', { locale: ptBR })
      const lastMonth = `${monthKey}/${new Date().getFullYear()}`
      acc += fiiDividends.monthlyDividends[lastMonth]
      return acc
    }, 0)
  }
}
