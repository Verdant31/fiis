import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export const extractMonthFromDate = (date: Date) => {
  return format(date, 'LLLL', { locale: ptBR })
}
