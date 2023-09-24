import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
export const revalidate = 0;

export async function GET() {
  try {
    const history = await prisma.paymentHistory.findMany();
    return NextResponse.json({ status: 200, history });
  } catch (err) {
    return NextResponse.json({ message: "Interal error", status: 500 });
  }
}
