"use server";
import { validateRequest } from "@/lib/validate-request";
import { NextResponse } from "next/server";
import yahooFinance from "yahoo-finance2";

export async function GET() {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized", status: 401 });
    }

    const articles = await yahooFinance
      .search("AMZN, TSLA, NVDA", { newsCount: 10 })
      .then((res) => res?.news);

    return NextResponse.json({
      articles: articles ?? [],
      status: 200,
    });
  } catch (err) {
    return NextResponse.json({ message: (err as Error)?.message, status: 500 });
  }
}
