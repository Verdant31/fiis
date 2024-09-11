"use server";
import { run } from "@/lib/cloudflare";
import { validateRequest } from "@/lib/validate-request";
import { addHours } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

const formatMonth = (month: number) => (month < 10 ? `0${month}` : month);

export async function POST(req: NextRequest) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized", status: 401 });
    }
    const { modelInput } = await req.json();
    const currentMonth = addHours(new Date(), 3).getMonth() + 1;
    const message = `
      Você é assistente pessoal de fundos de investimento. Você receberá a pergunta do usuário e deverá retornar um JSON com as seguintes perguntas respondidas: 
      {
        context: a resposta deve ser "price history" ou “dividends",
        funds: quais são os fundos a serem mostrados, deve ser um array de strings,
        period: o período deve conter um array de strings com as datas que correspondem ao período informado pelo usuário, CASO tenha sido informado, se não foi informado considere a informação util numero 2. Por exemplo, o periodo "últimos 3 meses" deve ser "${formatMonth(currentMonth)}/2024", "${formatMonth(currentMonth - 1)}/2024", "${formatMonth(currentMonth - 2)}/2024". 
      }

      REQUISITOS: 
      1. Se nenhum fundo for especificado, considere a resposta “todos” 
      2. Se nenhum tipo de informação em relação as datas for informado, coloque como periodo os ulimos 12 meses.
      3. As datas devem estar no formato “mês/ano”
      4. O mês atual é: ${formatMonth(currentMonth)}
      5. NÃO ADICIONE QUALQUER INFORMAÇÃO/TEXTO QUE NÃO SEJA REFERENTE AO JSON.

      Exemplo de perguntas e qual seria a resposta esperada:
      Pergunta: "Dividendos"
      Mes atual: 09
      Resposta: { contexto: "dividends", funds: ["todos"], period: ["01/2024", "02/2024", "03/2024","04/2024", "05/2024", "06/2024","07/2024", "08/2024", "09/2024"] }

      Pergunta: "Dividendos dos ultimos 3 meses
      Mes atual: 09
      Resposta: { contexto: "dividends", funds: ["todos"], period: ["07/2024", "08/2024", "09/2024"] }

      Pergunta: "preço do XPML11"
      Mes atual: 09
      Resposta: { contexto: "price history", funds: ["XPML11"], period: ["01/2024", "02/2024", "03/2024","04/2024", "05/2024", "06/2024","07/2024", "08/2024", "09/2024"] }
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
