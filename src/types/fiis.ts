import { ExtraFiisInfos, FiisOperations } from "@prisma/client";

export type FiisHistory = {
  fiiName: string;
  history: {
    date: Date;
    close: number;
  }[];
};

export type FiiGroupedOperations = {
  fiiName: string;
  operations: FiisOperations[];
};

export type Dividend = {
  date: string;
  paymentPerQuote: number;
  quotesAtPayment: number;
  total: number;
  fiiName: string;
};

export type FiiDividends = {
  fiiName: string;
  monthlyDividends: Record<string, Dividend>;
};

export type FiiSummary = {
  fiiName: string;
  monthlyYield?: number;
  annualYield?: number;
  price: number;
  pvp?: number | undefined;
  operations: FiisOperations[];
  valueAtFirstPurchase: number;
  type:
    | "CRYPTOCURRENCY"
    | "CURRENCY"
    | "ETF"
    | "EQUITY"
    | "FUTURE"
    | "INDEX"
    | "MUTUALFUND"
    | "OPTION";

  quotes: number;
  high: number | undefined;
  low: number | undefined;
  extraInfo?: ExtraFiisInfos;
};

export type Article = {
  uuid: string;
  title: string;
  publisher: string;
  link: string;
  providerPublishTime: Date;
  type: string;
  thumbnail: {
    resolutions: {
      url: string;
      width: number;
      height: number;
      tag: string;
    }[];
  };
  relatedTickers: string[];
};

export enum DividendPeriods {
  "1M" = 1,
  "3M" = 3,
  "6M" = 6,
  "12M" = 12,
  "Total" = 99,
}

export type FiiCVMRawData = {
  CNPJ_Fundo: string;
  Cotas_Emitidas: string;
  Data_Informacao_Numero_Cotistas: string;
  Data_Referencia: string;
  Numero_Cotistas_Banco_Comercial: string;
  Numero_Cotistas_Corretora_Distribuidora: string;
  Numero_Cotistas_Distribuidores_Fundo: string;
  Numero_Cotistas_Entidade_Aberta_Previdencia_Complementar: string;
  Numero_Cotistas_Entidade_Fechada_Previdencia_Complementar: string;
  Numero_Cotistas_FII: string;
  Numero_Cotistas_Investidores_Nao_Residentes: string;
  Numero_Cotistas_Outras_Pessoas_Juridicas_Financeira: string;
  Numero_Cotistas_Outros_Fundos: string;
  Numero_Cotistas_Outros_Tipos: string;
  Numero_Cotistas_Pessoa_Fisica: string;
  Numero_Cotistas_Pessoa_Juridica_Nao_Financeira: string;
  Numero_Cotistas_Regime_Proprio_Previdencia_Servidores_Publicos: string;
  Numero_Cotistas_Sociedade_Capitalizacao_Arrendamento_Mercantil: string;
  Numero_Cotistas_Sociedade_Seguradora_Resseguradora: string;
  Patrimonio_Liquido: string;
  Percentual_Amortizacao_Cotas_Mes: string;
  Percentual_Despesas_Agente_Custodiante: string;
  Percentual_Despesas_Taxa_Administracao: string;
  Percentual_Dividend_Yield_Mes: string;
  Percentual_Rentabilidade_Efetiva_Mes: string;
  Percentual_Rentabilidade_Patrimonial_Mes: string;
  Total_Numero_Cotistas: string;
  Valor_Ativo: string;
  Valor_Patrimonial_Cotas: string;
  Versao: string;
};
