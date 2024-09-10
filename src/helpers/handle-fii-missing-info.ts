"use server";
import { prisma } from "@/lib/prisma";
import JSZip from "jszip";
import csvToJson from "convert-csv-to-json";
import { FiiCVMRawData } from "@/types/fiis";
import yahooFinance from "yahoo-finance2";
import { subMonths } from "date-fns";
import { chartToDividendsMapper } from "./chart-to-dividends-mapper";

type MIssingFiiInfo = {
  fiiName: string;
  fiiCnpj: string | null;
  operations: {
    date: string;
    id: string;
    fiiName: string;
    fiiCnpj: string | null;
    type: string;
    qty: number;
    quotationValue: number;
    pvp: number | null;
  }[];
  currentQuotePrice: number;
};

export const handleFiiMissingInfos = async (fii: MIssingFiiInfo) => {
  const alreadyUpdatedToday = await prisma.extraFiisInfos.findFirst({
    where: {
      fiiCnpj: fii.fiiCnpj ?? "",
      updatedAt: {
        gte: new Date(new Date().setHours(0, 0, 0, 0)),
        lte: new Date(new Date().setHours(23, 59, 59, 999)),
      },
    },
  });

  if (alreadyUpdatedToday) return alreadyUpdatedToday;

  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  const chartData = await yahooFinance.chart(fii.fiiName, {
    period1: subMonths(oneYearAgo, 1),
    period2: new Date(),
    events: "dividends",
  });
  const dividends = chartToDividendsMapper(chartData);

  const formatedDividends = dividends.reduce((acc, dividend) => {
    return (acc += dividend.dividends);
  }, 0);

  const annualYield = (formatedDividends / fii.currentQuotePrice) * 100;

  const fileName = "inf_mensal_fii_complemento_2024.csv";
  const response = await fetch(
    "https://dados.cvm.gov.br/dados/FII/DOC/INF_MENSAL/DADOS/inf_mensal_fii_2024.zip",
  );
  const arrayBuffer = await response.arrayBuffer();

  const jszip = new JSZip();
  const zip = await jszip.loadAsync(arrayBuffer);
  const fileContent = await zip.files[fileName].async("string");
  const parsedContent = csvToJson.csvStringToJson(
    fileContent,
  ) as FiiCVMRawData[];

  const filteredContent = parsedContent.filter(
    (fiiInfo) => fiiInfo.CNPJ_Fundo === fii?.fiiCnpj,
  );
  if (filteredContent.length === 0) return;

  const freshInfo = filteredContent.at(-1);

  const pvp =
    fii.currentQuotePrice /
    parseFloat(freshInfo?.Valor_Patrimonial_Cotas ?? "0.0");
  const patrimonyQuoteValue = parseFloat(
    freshInfo?.Valor_Patrimonial_Cotas ?? "0.0",
  );
  const sentQuotes = parseInt(freshInfo?.Cotas_Emitidas ?? "0");
  const totalPatrimony = parseFloat(freshInfo?.Patrimonio_Liquido ?? "0.0");

  if (parsedContent) {
    const info = await prisma.extraFiisInfos.upsert({
      where: {
        fiiCnpj: fii.fiiCnpj ?? "",
      },
      update: {
        updatedAt: new Date(),
        annualYield,
        pvp,
        patrimonyQuoteValue,
        sentQuotes,
        totalPatrimony,
      },
      create: {
        fiiCnpj: fii.fiiCnpj ?? "",
        annualYield,
        patrimonyQuoteValue,
        pvp,
        sentQuotes,
        totalPatrimony,
      },
    });
    return info;
  }
};
