import { isValid } from "date-fns";
import { z } from "zod";

const formSchema = z
  .object({
    creationType: z.enum(["unique", "multiple"]),
    incomes: z.array(
      z.object({
        value: z.number(),
        type: z.enum(["cdi", "inflation", "fixed"]),
      }),
    ),
    purchaseDate: z.date({
      required_error: "A data de compra é obrigatória.",
    }),
    dueDate: z.date({
      required_error: "A data de vencimento é obrigatória.",
    }),
    companyName: z
      .string({
        required_error: "O nome da empresa é obrigatório.",
      })
      .min(2, {
        message: "O nome precisa ter pelo menos 4 caracteres.",
      }),
    investedValue: z
      .string()
      .optional()
      .transform((val) => {
        if (!val) return 0;
        const withComma = val?.replace(/[^\d.,-]/g, "");
        return parseFloat(withComma?.replace(",", "."));
      }),
    file: z
      .object({
        name: z.string({
          required_error:
            "Please upload a valid file type. (MP3/MP4, JPG, JPEG, PNG)",
        }),
        lastModified: z.number(),
        size: z.number(),
        type: z.string(),
      })
      .optional(),
    unfoldingProportion: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.creationType === "multiple" && !data.file) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "O arquivo é obrigatório.",
        path: ["file"],
      });
    }
  });

const outputFormSchema = z.object({
  companyName: z
    .string({
      required_error: "O nome da empresa é obrigatório.",
    })
    .min(2, {
      message: "O nome precisa ter pelo menos 3 caracteres.",
    }),
  dueDate: z.string().refine((val) => {
    return isValid(new Date(val));
  }, "Informe uma data válida."),
  purchaseDate: z.string().refine((val) => {
    return isValid(new Date(val));
  }, "Informe uma data válida."),
  investedValue: z.number(),
  incomes: z.array(
    z.object({
      value: z.number(),
      type: z.enum(["cdi", "inflation", "fixed"]),
    }),
  ),
});

type FormInputData = z.input<typeof formSchema>;
type FormOutputData = z.input<typeof outputFormSchema>;

export {
  formSchema,
  outputFormSchema,
  type FormInputData,
  type FormOutputData,
};
