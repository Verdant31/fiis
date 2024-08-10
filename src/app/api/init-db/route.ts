'use server'
import { NextResponse } from 'next/server'
import data from '../../../OPERATIONS.json'
import { prisma } from '@/lib/prisma'
import { Operation } from '@prisma/client'

export async function GET() {
  try {
    const response = await prisma.fiisOperations.createMany({
      data: data.map((purchase) => ({
        type:
          purchase.operation === 'sale' ? Operation.sale : Operation.purchase,
        fiiName: purchase.asset_name,
        date: purchase.purchase_date,
        qty: purchase.quantity_purchased,
        quotationValue: purchase.price_paid,
      })),
    })
    return NextResponse.json({
      message: 'DB sucessfuly initiated',
      status: 200,
      response,
    })
  } catch (err) {
    console.log({ err })
    return NextResponse.json({ message: (err as Error)?.message, status: 500 })
  }
}
