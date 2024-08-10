export type FiisHistory = {
  fiiName: string
  history: {
    date: Date
    close: number
  }[]
}

export type Dividend = {
  date: Date
  dividends: number
}
