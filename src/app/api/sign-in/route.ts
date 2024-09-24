"use server";
import { lucia } from "@/lib/lucia";
import { prisma } from "@/lib/prisma";
import { SignInFormData } from "@/types/auth";
import { verify } from "@node-rs/argon2";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body: SignInFormData = await req.json();

    const user = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (!user) {
      return NextResponse.json({
        message: "Usuário ou senha incorretos.",
        status: 400,
      });
    }

    const validPassword = await verify(user.password_hash, body.password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    if (!validPassword) {
      return NextResponse.json({
        message: "Usuário ou senha incorretos.",
        status: 400,
      });
    }

    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    return NextResponse.json({
      message: "Sucessfull sign in",
      status: 200,
    });
  } catch (err) {
    return NextResponse.json({ message: (err as Error)?.message, status: 500 });
  }
}
