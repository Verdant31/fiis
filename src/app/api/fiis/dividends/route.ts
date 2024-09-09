'use server'
import { prisma } from '@/lib/prisma'
import { FiisOperations } from '@prisma/client'
import _ from 'lodash'
import { NextResponse } from 'next/server'
import yahooFinance from 'yahoo-finance2'
import { format, addHours } from 'date-fns'
import { handleUnfoldings } from '@/helpers/handle-unfoldings'
import { chartToDividendsMapper } from '@/helpers/chart-to-dividends-mapper'

type FiiDividendObject = {
  date: Date
  paymentPerQuote: number
  quotesAtPayment: number
  total: number
}

export async function GET() {
  try {
    const fiisOperations = await prisma.fiisOperations.findMany({})
    const fiisAsKeys = _.groupBy(fiisOperations, 'fiiName')

    const fiis = Object.keys(fiisAsKeys).map((fiiName) => ({
      fiiName: fiiName + '.SA',
      operations: fiisAsKeys[fiiName],
    }))

    const calculateMonthlyDividends = (
      fiiOperations: FiisOperations[],
      dividends: {
        date: Date
        dividends: number
      }[],
    ) => {
      const monthlyDividends: Record<string, FiiDividendObject> = {}
      for (const dividend of dividends) {
        const { quotesOwnedAtPayment, dividendsReceived } = handleUnfoldings({
          fiiOperations,
          dividends,
          dividend,
        })

        const monthKey = format(addHours(dividend.date, 3), 'MM/yyyy')
        if (!monthlyDividends[monthKey]) {
          monthlyDividends[monthKey] = {
            date: addHours(dividend.date, 3),
            paymentPerQuote: dividend.dividends,
            quotesAtPayment: quotesOwnedAtPayment,
            total: dividendsReceived,
          }
        }
        monthlyDividends[monthKey].total = dividendsReceived
      }

      return monthlyDividends
    }

    const promises = fiis.map(async (fii) => {
      const chartData = await yahooFinance.chart(fii.fiiName, {
        period1: '2023-01-01',
        period2: new Date(),
        events: 'dividends',
      })
      const dividends = chartToDividendsMapper(chartData)

      return {
        fiiName: fii.fiiName,
        monthlyDividends: calculateMonthlyDividends(fii.operations, dividends),
      }
    })

    const results = await Promise.all(promises)
    // for (const a of results) {
    //   console.log(a.monthlyDividends)
    // }
    return NextResponse.json({
      results: results ?? [],
      status: 200,
    })
  } catch (err) {
    console.log(err)
    return NextResponse.json({ message: (err as Error)?.message, status: 500 })
  }
}
