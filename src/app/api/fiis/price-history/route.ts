'use server'
import { prisma } from '@/lib/prisma'
import _ from 'lodash'
import { NextResponse } from 'next/server'
import yahooFinance from 'yahoo-finance2'

export async function GET() {
  try {
    const fiisPurchases = await prisma.fiisOperations.findMany({})
    const fiis = _.uniqBy(fiisPurchases, 'fiiName').map(
      (purchase) => purchase.fiiName + '.SA',
    )

    const now = new Date()
    const period1 = new Date(
      now.getFullYear() - 1,
      now.getMonth(),
      now.getDate(),
    )
    const period2 = now.toISOString().split('T')[0]
    const queryInterval = {
      period1: period1.toISOString().split('T')[0],
      period2,
    }

    const promises = fiis.map(async (fiiName) => ({
      history: await yahooFinance
        .historical(fiiName, queryInterval)
        .then((response) =>
          response.map((day) => ({
            date: day.date,
            close: day.close,
          })),
        ),
      fiiName,
    }))

    const results = await Promise.all(promises)

    return NextResponse.json({
      results: results ?? [],
      status: 200,
    })
  } catch (err) {
    return NextResponse.json({ message: (err as Error)?.message, status: 500 })
  }
}
