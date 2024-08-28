'use server'
import { lucia } from '@/lib/lucia'
import { prisma } from '@/lib/prisma'
import { SignInFormData } from '@/types/auth'
import { hash } from '@node-rs/argon2'
import { generateIdFromEntropySize } from 'lucia'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body: SignInFormData = await req.json()

    const user = await prisma.user.findUnique({
      where: { email: body.email },
    })

    if (user) {
      return NextResponse.json({
        message: 'Email already in use.',
        status: 400,
      })
    }

    const passwordHash = await hash(body.password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    })
    const userId = generateIdFromEntropySize(10)

    const session = await lucia.createSession(userId, {})
    const sessionCookie = lucia.createSessionCookie(session.id)
    await prisma.user.create({
      data: {
        id: userId,
        email: body.email,
        password_hash: passwordHash,
      },
    })

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    )
    return NextResponse.json({
      message: 'User created successfully',
      status: 200,
    })
  } catch (err) {
    return NextResponse.json({ message: (err as Error)?.message, status: 500 })
  }
}
