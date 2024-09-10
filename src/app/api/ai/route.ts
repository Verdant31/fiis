"use server";
import { run } from "@/lib/cloudflare";
import { addHours } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

const formatMonth = (month: number) => (month < 10 ? `0${month}` : month);

export async function POST(req: NextRequest) {
  try {
    const { modelInput } = await req.json();
    const currentMonth = addHours(new Date(), 3).getMonth() + 1;
    const message = `
      You are a personal assistant for investment funds. You will receive the user's question and must return a JSON with the following questions answered: 
      {
        context: The answer must be "price history" or "dividends",
        funds: which are the funds to be shown, must be a array of strings,
        period: the period must contain an array of strings with the dates that correspond to the period entered by the user. For example, "last 3 months" should be "${formatMonth(currentMonth)}/2024", "${formatMonth(currentMonth - 1)}/2024", "${formatMonth(currentMonth - 2)}/2024". 
      }
      Useful information: 
      1. If no fund is specified, consider the answer "all" 
      2. If no date is provided, consider the last 12 months.
      3. Dates must be in the "month/year" format
      4. The current month is: ${formatMonth(currentMonth)}
    `;
    const response = await run("@hf/thebloke/llama-2-13b-chat-awq", {
      messages: [
        {
          role: "system",
          content: message,
        },
        {
          role: "user",
          content: modelInput,
        },
      ],
    });
    return NextResponse.json({
      response: { ...response },
      status: 200,
    });
  } catch (err) {
    return NextResponse.json({ message: (err as Error)?.message, status: 500 });
  }
}
