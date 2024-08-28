import { z } from 'zod'

const cnpjValidation = z
  .string({
    required_error: 'CPF/CNPJ é obrigatório.',
  })
  .refine((doc) => {
    const replacedDoc = doc.replace(/\D/g, '')
    return replacedDoc.length >= 11
  }, 'CNPJ deve conter no mínimo 11 caracteres.')
  .refine((doc) => {
    const replacedDoc = doc.replace(/\D/g, '')
    return replacedDoc.length <= 14
  }, 'CNPJ deve conter no máximo 14 caracteres.')
  .refine((doc) => {
    const replacedDoc = doc.replace(/\D/g, '')
    return !!Number(replacedDoc)
  }, 'CNPJ deve conter apenas números.')

const formSchema = z.object({
  name: z
    .string({
      required_error: 'O nome do ativo é obrigatório.',
    })
    .min(2, {
      message: 'O nome precisa ter pelo menos 4 caracteres.',
    }),
  price: z
    .string({
      required_error: 'O preço é obrigatório.',
    })
    .transform((val) => {
      const withComma = val.replace(/[^\d.,-]/g, '')
      return Number(withComma.replace(',', '.'))
    }),
  quotes: z
    .string()
    .refine((val) => {
      return val.length > 0
    }, 'O número de cotas é obrigatório.')
    .transform((val) => {
      return parseFloat(val)
    })
    .refine((val) => {
      return val > 0
    }, 'O número de cotas deve ser maior que 0.'),
  cnpj: cnpjValidation,
})

const outputFormSchema = z.object({
  name: z
    .string({
      required_error: 'O nome do ativo é obrigatório.',
    })
    .min(2, {
      message: 'O nome precisa ter pelo menos 4 caracteres.',
    }),
  date: z.string().refine((val) => {
    return !!new Date(val)
  }, 'Informe uma data válida.'),
  operationType: z.enum(['sale', 'purchase', 'unfolding']),
  price: z
    .number({
      required_error: 'O preço é obrigatório.',
    })
    .min(1, {
      message: 'O preço deve ser maior que 0.',
    }),
  quotes: z
    .number({
      required_error: 'O preço é obrigatório.',
    })
    .min(1, {
      message: 'O preço deve ser maior que 0.',
    }),
  cnpj: cnpjValidation,
})

type FormInputData = z.input<typeof formSchema>

export { formSchema, outputFormSchema, type FormInputData }
