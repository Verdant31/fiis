import { ChartResultArray } from '@/../yahoo-finance2/dist/esm/src/modules/chart'

export const chartToDividendsMapper = (response: ChartResultArray) => {
  const dividends = response?.events?.dividends ?? []
  return (
    dividends.map(({ amount: dividends, date }) => ({ date, dividends })) ?? []
  )
}
