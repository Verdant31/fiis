import { isValid } from 'date-fns'
import { z } from 'zod'

const cnpjValidation = z
  .string({
    required_error: 'CPF/CNPJ é obrigatório.',
  })
  .refine((doc) => {
    const replacedDoc = doc.replace(/\D/g, '')
    return replacedDoc.length === 14
  }, 'CNPJ deve conter 14 caracteres.')
  .refine((doc) => {
    const replacedDoc = doc.replace(/\D/g, '')
    return !!Number(replacedDoc)
  }, 'CNPJ deve conter apenas números.')

const formSchema = z
  .object({
    creationType: z.enum(['unique', 'multiple']),
    operationType: z.enum(['purchase', 'sale', 'unfolding']),
    name: z
      .string({
        required_error: 'O nome do ativo é obrigatório.',
      })
      .min(2, {
        message: 'O nome precisa ter pelo menos 4 caracteres.',
      }),
    price: z
      .string()
      .optional()
      .transform((val) => {
        if (!val) return 0
        const withComma = val?.replace(/[^\d.,-]/g, '')
        return parseFloat(withComma?.replace(',', '.'))
      }),
    quotes: z
      .string()
      .optional()
      .transform((v) => parseInt(v ?? '0')),
    cnpj: cnpjValidation,
    file: z
      .object({
        name: z.string({
          required_error:
            'Please upload a valid file type. (MP3/MP4, JPG, JPEG, PNG)',
        }),
        lastModified: z.number(),
        size: z.number(),
        type: z.string(),
      })
      .optional(),
    unfoldingProportion: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.creationType === 'multiple' && !data.file) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'O arquivo é obrigatório.',
        path: ['file'],
      })
    }
    if (data.operationType === 'unfolding' && !data.unfoldingProportion) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Informe a proporção do desdobramento.',
        path: ['unfoldingProportion'],
      })
    }
    if (data.operationType === 'purchase' || data.operationType === 'sale') {
      if (data.price <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'O preço deve ser maior que 0.',
          path: ['price'],
        })
      }
      if (!data.quotes) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'A quantidade de cotas é obrigatória.',
          path: ['quotes'],
        })
      } else if (data.quotes === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'A quantidade de cotas deve ser maior que 0.',
          path: ['quotes'],
        })
      }
    }
  })

const outputFormSchema = z
  .object({
    name: z
      .string({
        required_error: 'O nome do ativo é obrigatório.',
      })
      .min(2, {
        message: 'O nome precisa ter pelo menos 4 caracteres.',
      }),
    date: z.string().refine((val) => {
      return isValid(new Date(val))
    }, 'Informe uma data válida.'),
    operationType: z.enum(['sale', 'purchase', 'unfolding']),
    price: z.number().optional(),
    quotes: z.number().optional(),
    cnpj: cnpjValidation,
    unfoldingProportion: z
      .number({
        invalid_type_error: 'A proporção deve ser um numero valido.',
      })
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.operationType === 'unfolding' && !data.unfoldingProportion) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Informe a proporção do desdobramento.',
        path: ['unfoldingProportion'],
      })
    }
    if (data.operationType === 'purchase' || data.operationType === 'sale') {
      if (data?.price && data.price <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'O preço deve ser maior que 0.',
          path: ['price'],
        })
      }
      if (!data.quotes) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'A quantidade de cotas é obrigatória.',
          path: ['quotes'],
        })
      } else if (data.quotes === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'A quantidade de cotas deve ser maior que 0.',
          path: ['quotes'],
        })
      }
    }
  })

type FormInputData = z.input<typeof formSchema>
type FormOutputData = z.input<typeof outputFormSchema>

export { formSchema, outputFormSchema, type FormInputData, type FormOutputData }
