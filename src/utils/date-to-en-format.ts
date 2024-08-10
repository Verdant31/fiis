import { parse } from 'date-fns'

export const dateToEnFormat = (date: string) => {
  return parse(date, 'dd/MM/yyyy HH:mm', new Date()).toString()
}
