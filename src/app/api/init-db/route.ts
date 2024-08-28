'use server'
import { NextResponse } from 'next/server'
import data from '../../../OPERATIONS.json'
import { prisma } from '@/lib/prisma'
import { Operation } from '@prisma/client'
import { dateToEnFormat } from '@/utils/date-to-en-format'

export async function GET() {
  try {
    const response = await prisma.fiisOperations.createMany({
      data: data.map((purchase) => ({
        fiiCnpj: purchase.cnpj,
        type:
          purchase.operation === 'sale'
            ? Operation.sale
            : purchase.operation === 'unfolding'
              ? Operation.unfolding
              : Operation.purchase,
        fiiName: purchase.asset_name,
        date: dateToEnFormat(purchase.purchase_date),
        qty: purchase.quantity_purchased,
        quotationValue: purchase.price_paid,
        unfoldingProportion: purchase?.unfoldingProportion,
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
