import { Income } from "@prisma/client";

export type IncomeType = "cdi" | "inflation" | "fixed";

export const incomes = ["cdi", "inflation", "fixed"];

export enum IncomeEnum {
  cdi = "CDI",
  inflation = "IPCA",
  fixed = "Fixo",
}

export type RawInflationData = {
  "@odata.context": string;
  value: {
    SERCODIGO: string;
    VALDATA: string;
    VALVALOR: number;
    NIVNOME: string;
    TERCODIGO: string;
  }[];
};

export type RawCdbData = {
  data: string;
  valor: string;
}[];
export type FixedIncomeEvolution = {
  date: Date;
  percentEvolution: number;
  value: number;
};

export type FixedIncomeWithEvolution = {
  incomes: Income[];
  id: string;
  companyName: string;
  dueDate: string;
  purchaseDate: string;
  investedValue: number;
  latestValue: number;
  userId: string;
  investmentEvolution: FixedIncomeEvolution[];
};
