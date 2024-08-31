import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Operation } from '@prisma/client'
import { useState } from 'react'
import OperationTypeCard from './operation-type-card'
import { DatePicker } from './date-picker'
import { CurrencyInput } from './currency-input'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { formatCnpj } from '@/utils/format-cnpj'
import { FormInputData, formSchema } from '../lib/forms/create-fii-operation'
import { api } from '@/lib/axios'
import { toast } from 'sonner'
import { ClipLoader } from 'react-spinners'

export function CreateFiiOperation() {
  const [modal, setModal] = useState({ isOpen: false, isLoading: false })
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [operationType, setOperationType] = useState<Operation>(
    Operation.purchase,
  )

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm<FormInputData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: 'XPML11.SA',
      price: (60.48).toString(),
      quotes: '24',
      cnpj: '28.757.546/0001-00',
    },
  })

  const onSubmit = async (formData: FormInputData) => {
    setModal((p) => ({ ...p, isLoading: true }))

    const { data } = await api.post('/fiis/create-operation', {
      ...formData,
      operationType,
      date,
    })
    if (data?.status !== 200) {
      return toast.error(data?.message)
    }
    toast.success(data?.message)
    setModal({ isOpen: false, isLoading: false })
  }

  return (
    <Dialog
      open={modal.isOpen}
      onOpenChange={(isOpen) => setModal({ isOpen, isLoading: false })}
    >
      <DialogTrigger asChild>
        <Button className="mt-4" size="sm">
          Nova operação
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95%]">
        <DialogHeader>
          <DialogTitle>Cadastrar operação</DialogTitle>
          <DialogDescription>
            Cadastre operações como compras, vendas e desdobramentos dos seus
            fundos.
          </DialogDescription>
        </DialogHeader>
        <div>
          <div className="flex items-center justify-between">
            <OperationTypeCard
              onChange={setOperationType}
              currentType={operationType}
              type={Operation.purchase}
            />
            <OperationTypeCard
              currentType={operationType}
              onChange={setOperationType}
              type={Operation.unfolding}
            />
            <OperationTypeCard
              onChange={setOperationType}
              currentType={operationType}
              type={Operation.sale}
            />
          </div>
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4">
                <Label htmlFor="name" className="w-[40px]">
                  Ativo
                </Label>
                <Input
                  {...register('name')}
                  placeholder="XPML11.SA"
                  className="w-[135px]"
                />
              </div>
              <div className="flex items-center gap-4">
                <Label htmlFor="username" className="w-[40px]">
                  Preço
                </Label>
                <CurrencyInput
                  className="w-[95px]"
                  control={control}
                  name="price"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4">
                <Label htmlFor="name" className="w-[40px]">
                  Data
                </Label>
                <DatePicker
                  date={date}
                  setDate={setDate}
                  placeholder="Data da operação"
                  showIcon={false}
                  className="w-[160px]"
                />
              </div>
              <div className="flex items-center gap-4">
                <Label htmlFor="username" className="w-[40px]">
                  Cotas
                </Label>
                <Input
                  {...register('quotes')}
                  id="username"
                  placeholder="24"
                  className="w-12"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Label htmlFor="name" className="w-[40px] shrink-0">
                CNPJ
              </Label>
              <Controller
                name="cnpj"
                control={control}
                render={({ field: { onChange, ...rest } }) => {
                  return (
                    <Input
                      {...rest}
                      onChange={(e) => {
                        const { value } = e.target
                        e.target.value = formatCnpj(value)
                        onChange(e)
                      }}
                      maxLength={18}
                      placeholder="XXX.XXX/XXXX-XX"
                    />
                  )
                }}
              />
            </div>
          </div>
          {/* Display errors messages from react hook form */}
          {Object.values(errors).map((error) => {
            return (
              <p className=" text-red-500 text-sm" key={error.message}>
                * {error.message}
              </p>
            )
          })}
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit(onSubmit)} type="submit">
            {modal.isLoading ? (
              <div className="flex gap-2 items-center">
                <ClipLoader size={18} />
                <span>Salvando...</span>
              </div>
            ) : (
              'Salvar'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
