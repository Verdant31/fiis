import { FiisPurchases, Payment } from "@prisma/client"

export type Fii = {
  id             :string
  name           :string
  quantity       :number
  purchases      :FiisPurchases[]
  payments: Payment[]
  quotationValue :number
  initialValue   :number
}
