import { FiisOperations } from '@prisma/client'

export type FiisHistory = {
  fiiName: string
  history: {
    date: Date
    close: number
  }[]
}

export type FiiSummary = {
  fiiName: string
  monthlyYield: number
  annualYield: number
  price: number | undefined
  pvp: string | undefined
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

export type FiisOperation = {
  fiiName: string
  operations: FiisOperations[]
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
