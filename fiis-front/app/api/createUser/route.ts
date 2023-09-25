import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log(body);
    const name: string = body.name;
    console.log("name", name);
    const newUser = await prisma.user.create({
      data: { name },
    });
    return NextResponse.json({ message: "User created", status: 200, newUser });
  } catch (err) {
    return NextResponse.json({ message: (err as Error)?.message, status: 500 });
  }
}
