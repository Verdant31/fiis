const yahooApiErrorMessage =
  'Houve um erro ao tentar se comunicar com a API do Yahoo Finance, isso pode indicar instabilidade ou um problema interno.'

export class YahooApiInternalError extends Error {
  constructor(message = yahooApiErrorMessage) {
    super(message)
    this.name = 'YahooApiInternalError'
  }
}
