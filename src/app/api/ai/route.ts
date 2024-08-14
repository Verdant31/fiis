'use server'
import { run } from '@/lib/cloudflare'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { modelInput } = await req.json()
    const message = `
      You are a personal assistant for investment funds. You will receive the user's question and must return a JSON with the following questions answered: Context: The answer must be "price history" or "dividends", the second is Funds: which are the funds to be shown, and the third Period: the period must contain an array with the dates that correspond to the period entered by the user. Example: "last 3 months" would be "2024/08", "2024/07","2024/06". Useful information: 1. If no fund is specified, consider the answer "all" 2. If no date is provided, consider the last 12 months. 3. Dates must be in the "year/month" format
    `
    const response = await run('@cf/meta/llama-3-8b-instruct', {
      messages: [
        {
          role: 'system',
          content: message,
        },
        {
          role: 'user',
          content: modelInput,
        },
      ],
    })
    return NextResponse.json({
      response: { ...response },
      status: 200,
    })
  } catch (err) {
    return NextResponse.json({ message: (err as Error)?.message, status: 500 })
  }
}
