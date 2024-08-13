import { FiiDividends } from '@/queries/use-fiis-dividends'
import { FiisHistory, FiisOperation } from '@/types/fiis'

export class FiisController {
  public history: FiisHistory[] = []
  public operations: FiisOperation[] = []
  public dividends: FiiDividends[] = []

  constructor(data: Partial<FiisController>) {
    Object.assign(this, data)
  }

  getTotalValueInvested() {
    return this.operations.reduce((acc, fiiOperations) => {
      const total = fiiOperations.operations.reduce(
        (operationAcc, operation) => {
          if (operation.type === 'sale') {
            operationAcc -= operation.qty * operation.quotationValue
          } else {
            operationAcc += operation.qty * operation.quotationValue
          }
          return operationAcc
        },
        0,
      )
      acc += total
      return acc
    }, 0)
  }

  getTotalDividends() {
    return this.dividends.reduce((acc, fiiDividends) => {
      const months = Object.keys(fiiDividends.monthlyDividends)
      const totalFiiDividends = months.reduce((acc, month) => {
        acc += fiiDividends.monthlyDividends[month]
        return acc
      }, 0)

      acc += totalFiiDividends
      return acc
    }, 0)
  }
}
