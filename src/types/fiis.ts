import { FiisOperations } from '@prisma/client'

export type FiisHistory = {
  fiiName: string
  history: {
    date: Date
    close: number
  }[]
}

export type FiisOperation = {
  fiiName: string
  operations: FiisOperations[]
}

export type FiiSummary = {
  fiiName: string
  monthlyYield?: number
  annualYield?: number
  price: number
  pvp?: string | undefined
  operations: FiisOperation[]
  valueAtFirstPurchase: number
  type:
    | 'CRYPTOCURRENCY'
    | 'CURRENCY'
    | 'ETF'
    | 'EQUITY'
    | 'FUTURE'
    | 'INDEX'
    | 'MUTUALFUND'
    | 'OPTION'

  quotes: number
  high: number | undefined
  low: number | undefined
}

export type Dividend = {
  date: Date
  dividends: number
}

export type Article = {
  uuid: string
  title: string
  publisher: string
  link: string
  providerPublishTime: Date
  type: string
  thumbnail: {
    resolutions: {
      url: string
      width: number
      height: number
      tag: string
    }[]
  }
  relatedTickers: string[]
}
