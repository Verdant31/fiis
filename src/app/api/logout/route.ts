"use server";
import { lucia } from "@/lib/lucia";
import { validateRequest } from "@/lib/validate-request";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { session } = await validateRequest();

    if (!session) {
      return NextResponse.json({
        message: "Sem autorização.",
        status: 400,
      });
    }
    await lucia.invalidateSession(session.id);

    const sessionCookie = lucia.createBlankSessionCookie();
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    return NextResponse.json({
      message: "Sucessfull sign out",
      status: 200,
    });
  } catch (err) {
    return NextResponse.json({ message: (err as Error)?.message, status: 500 });
  }
}
