/* eslint-disable no-useless-escape */
'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { ClipLoader } from 'react-spinners'
import { toast } from 'sonner'
import { z } from 'zod'

export type SignInFormData = {
  email: string
  password: string
}

export const SignInSchema: z.ZodType<SignInFormData> = z.object({
  email: z
    .string()
    .min(4, { message: 'Mínimo de 4 caracteres' })
    .max(31, { message: 'Máximo de 31 caracteres' })
    .regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, {
      message: 'Email inválido',
    }),
  password: z
    .string()
    .min(8, { message: 'Mínimo de 8 caracteres' })
    .max(255, { message: 'Máximo de 255 caracteres' }),
})

export default function Home() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(SignInSchema),
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  })

  const { mutateAsync: signUpMutation, isLoading: isSigningUp } = useMutation({
    mutationFn: async (data: SignInFormData) =>
      await fetch('api/sign-up', {
        method: 'POST',
        body: JSON.stringify(data),
      }).then((res) => res.json()),
  })

  const onSubmit = async (data: SignInFormData) => {
    const response = await signUpMutation(data)
    if (response?.status !== 200) {
      return toast.error(response?.message)
    }
    router.push('/dashboard')
  }

  return (
    <main className="fixed left-[50%] top-[50%] w-full max-w-lg translate-x-[-50%] translate-y-[-50%]">
      <h1 className="text-center text-2xl font-semibold">Crie sua conta</h1>
      <p className="text-center text-muted-foreground mt-1">
        Preencha os campos abaixo para criar sua conta
      </p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4 max-w-[80%] mx-auto mt-6">
          <div>
            <Input placeholder="name@example.com" {...register('email')} />
            <AnimatePresence>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="text-red-500 text-sm pt-2 pl-1"
                >
                  {errors.email.message}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
          <div>
            <Input
              placeholder="your_password@123"
              {...register('password')}
              type="password"
            />
            <AnimatePresence>
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="text-red-500 text-sm pt-2 pl-1"
                >
                  {errors.password.message}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
          <Button className="w-full">
            {isSigningUp ? <ClipLoader size={20} /> : 'Criar conta'}
          </Button>
          <p className="text-muted-foreground text-center text-sm pt-4 w-[80%] mx-auto">
            Ao continuar você concorda com nossos Termos de Serviço e Politica
            de Privacidade.
          </p>
        </div>
      </form>
    </main>
  )
}
