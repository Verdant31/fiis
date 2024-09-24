/* eslint-disable no-useless-escape */
import { z } from "zod";

export type SignInFormData = {
  email: string;
  password: string;
};

export const SignInSchema: z.ZodType<SignInFormData> = z.object({
  email: z
    .string()
    .min(4, { message: "Mínimo de 4 caracteres" })
    .max(31, { message: "Máximo de 31 caracteres" })
    .regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, {
      message: "Email inválido",
    }),
  password: z.string().min(1, { message: "Campo obrigatório" }),
});

export type SignUpFormData = {
  email: string;
  password: string;
};

export const SignUpSchema: z.ZodType<SignUpFormData> = z.object({
  email: z
    .string()
    .min(4, { message: "Mínimo de 4 caracteres" })
    .max(31, { message: "Máximo de 31 caracteres" })
    .regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, {
      message: "Email inválido",
    }),
  password: z
    .string()
    .min(8, { message: "Mínimo de 8 caracteres" })
    .max(255, { message: "Máximo de 255 caracteres" }),
});
