import { FiisOperations } from '@prisma/client'

import { isBefore } from 'date-fns'

interface Props {
  fiiOperations: FiisOperations[]
  dividends: {
    date: Date
    dividends: number
  }[]
  dividend: {
    date: Date
    dividends: number
  }
}
const yahooReturnedBrokenFormat = ({
  dividends,
  fiiOperations,
}: Omit<Props, 'dividend'>) => {
  const unfoldingOperations = fiiOperations.filter(
    (op) => op.type === 'unfolding',
  )

  let returnedWrongFormat = false
  for (const unfolding of unfoldingOperations) {
    if (!unfolding.unfoldingProportion) return
    const firstDividendWithUnfoldIndex = dividends.findIndex(
      (dividend) => dividend.date > new Date(unfolding.date),
    )
    const lastDiviendWithoutUnfold = dividends[firstDividendWithUnfoldIndex - 1]
    const firstDiviendWithUnfol = dividends[firstDividendWithUnfoldIndex]

    if (
      lastDiviendWithoutUnfold.dividends / unfolding.unfoldingProportion ===
      firstDiviendWithUnfol.dividends
    ) {
      returnedWrongFormat = true
    }
  }
  return returnedWrongFormat
}

export const handleUnfoldings = ({
  fiiOperations,
  dividends,
  dividend,
}: Props) => {
  const wrongDividendsFormat = yahooReturnedBrokenFormat({
    fiiOperations,
    dividends,
  })

  const unfoldOperations = fiiOperations.filter((op) => op.type === 'unfolding')
  if (wrongDividendsFormat) {
    let quotesOwnedAtPayment = 0

    for (const operation of fiiOperations) {
      const purchaseWasBeforeOrSameDayAsPayment =
        new Date(operation.date) <= dividend.date

      if (purchaseWasBeforeOrSameDayAsPayment) {
        if (operation.type === 'purchase' || operation.type === 'unfolding') {
          quotesOwnedAtPayment += operation.qty
        } else if (operation.type === 'sale') {
          quotesOwnedAtPayment -= operation.qty
        }
      }
    }

    if (quotesOwnedAtPayment < 0) quotesOwnedAtPayment = 0

    const dividendsReceived = quotesOwnedAtPayment * dividend.dividends
    return { dividendsReceived, quotesOwnedAtPayment }
  } else {
    let quotesOwnedAtPayment = 0

    for (const operation of fiiOperations) {
      const purchaseWasBeforeOrSameDayAsPayment =
        new Date(operation.date) <= dividend.date

      if (purchaseWasBeforeOrSameDayAsPayment) {
        if (operation.type === 'purchase') {
          const operations = unfoldOperations.filter((op) => {
            const purchaseIsBeforeUnfold = isBefore(
              new Date(operation.date),
              new Date(op.date),
            )
            return purchaseIsBeforeUnfold
          })
          if (operations.length === 0) {
            quotesOwnedAtPayment += operation.qty
          } else {
            operations.forEach((op) => {
              quotesOwnedAtPayment +=
                (op.unfoldingProportion as number) * operation.qty
            })
          }
        } else if (operation.type === 'sale') {
          quotesOwnedAtPayment -= operation.qty
        }
      }
    }

    if (quotesOwnedAtPayment < 0) quotesOwnedAtPayment = 0

    const dividendsReceived = quotesOwnedAtPayment * dividend.dividends
    return { dividendsReceived, quotesOwnedAtPayment }
  }
}
