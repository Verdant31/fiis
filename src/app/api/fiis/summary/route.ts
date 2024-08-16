'use server'
import { prisma } from '@/lib/prisma'
import { dateToEnFormat } from '@/utils/date-to-en-format'
import _ from 'lodash'
import { NextResponse } from 'next/server'
import yahooFinance from 'yahoo-finance2'

export async function GET() {
  try {
    const fiisOperations = await prisma.fiisOperations.findMany({})
    const fiisAsKeys = _.groupBy(fiisOperations, 'fiiName')

    const fiis = Object.keys(fiisAsKeys).map((fiiName) => ({
      fiiName: fiiName + '.SA',
      operations: fiisAsKeys[fiiName].map((operation) => ({
        ...operation,
        date: dateToEnFormat(operation.date),
      })),
    }))

    const promises = fiis.map(async (fii) => {
      const summary = await yahooFinance.quote(fii.fiiName)
      const quotes = fii.operations.reduce((acc, operation) => {
        if (operation.type === 'purchase') {
          acc += operation.qty
        } else if (operation.type === 'sale') {
          acc -= operation.qty
        }
        return acc
      }, 0)

      return {
        fiiName: fii.fiiName,
        quotes,
        monthlyYield: summary.dividendRate,
        annualYield: summary.dividendYield,
        price: summary.regularMarketPrice,
        pvp: summary.priceToBook?.toFixed(2),
        type: summary.quoteType,
        high: summary.regularMarketDayHigh,
        low: summary.regularMarketDayLow,
      }
    })

    const results = await Promise.all(promises)
    return NextResponse.json({
      results: results ?? [],
      status: 200,
    })
  } catch (err) {
    console.log(err)
    return NextResponse.json({ message: (err as Error)?.message, status: 500 })
  }
}
