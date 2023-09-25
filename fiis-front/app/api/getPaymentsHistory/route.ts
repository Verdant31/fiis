import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
export const revalidate = 0;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const history = await prisma.paymentHistory.findMany({});
    return NextResponse.json({ status: 200, history });
  } catch (err) {
    return NextResponse.json({ message: "Interal error", status: 500 });
  }
}
