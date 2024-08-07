'use client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { insertFii } from '@/queries/insertFii'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { useState } from 'react'
import { ClipLoader } from 'react-spinners'

export type Field = {
  name: string
  qty: string
  purchaseDate: string
  quotationValue: string
}

const FIELD_IV = {
  name: '',
  qty: '',
  purchaseDate: format(new Date(), 'dd/MM/yyyy'),
  quotationValue: '',
}

export function InsertFiiModal() {
  const [mode, setMode] = useState<'single' | 'multiple'>('single')
  const [fields, setFields] = useState<Field[]>([FIELD_IV])

  const queryClient = useQueryClient()

  const { mutateAsync: insertFiiMutation, isLoading } = useMutation({
    mutationFn: async () => insertFii(fields),
  })

  const handleSubmit = async () => {
    const isAllFieldsEmpty = fields.every(
      (field) => field.name === '' && field.qty === '',
    )
    if (isAllFieldsEmpty) return

    await insertFiiMutation().then(() =>
      queryClient.invalidateQueries(['get-fiis-key']),
    )
  }

  const handleAddFields = () => {
    setFields((prev) => [...prev, FIELD_IV])
  }

  const handleChangeField = (
    index: number,
    key: 'name' | 'qty' | 'purchaseDate' | 'quotationValue',
    value: string,
  ) => {
    setFields((prev) => {
      const newFields = [...prev]
      return newFields.map((field, idx) => {
        if (index === idx) {
          return { ...field, [key]: value }
        }
        return field
      })
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <p className="cursor-pointer text-lg w-[90px] text-center tracking-wider text-zinc-400">
          Insert(FII)
        </p>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[660px]">
        <div className="mx-auto flex gap-4 mb-2">
          <h1
            onClick={() => {
              setMode('single')
              setFields((prev) => [prev[0]])
            }}
            className={`tracking-widest cursor-pointer ${mode === 'single' && 'font-bold border-b-2'}`}
          >
            SINGLE
          </h1>
          <h1
            onClick={() => setMode('multiple')}
            className={`tracking-widest cursor-pointer ${mode === 'multiple' && 'font-bold border-b-2'}`}
          >
            MULTIPLE
          </h1>
        </div>
        <DialogHeader>
          <DialogTitle>Insert new FII</DialogTitle>
          <DialogDescription>
            Save to the database a new purchased FII.
          </DialogDescription>
        </DialogHeader>
        <div>
          {fields.map((field, index) => {
            return (
              <div key={index} className="flex items-center gap-4 pt-2 pb-2">
                <Input
                  placeholder="Examle: MXRF11"
                  onChange={(e) =>
                    handleChangeField(index, 'name', e.target.value)
                  }
                  value={field.name}
                  className="w-44"
                />
                <Input
                  placeholder="Qty"
                  onChange={(e) =>
                    handleChangeField(index, 'qty', e.target.value)
                  }
                  value={field.qty}
                  className="w-16 flex pl-3"
                />
                <Input
                  placeholder="Ex: 29/04/2023"
                  onChange={(e) =>
                    handleChangeField(index, 'purchaseDate', e.target.value)
                  }
                  value={field.purchaseDate}
                  className="w-[140px] flex pl-3"
                />
                <Input
                  placeholder="R$87,55"
                  onChange={(e) =>
                    handleChangeField(index, 'quotationValue', e.target.value)
                  }
                  value={field.quotationValue}
                  className="w-[90px] flex pl-3"
                />
                <ClipLoader color="#fff" loading={isLoading} />
                {mode === 'single' ? (
                  <Button
                    disabled={isLoading}
                    onClick={handleSubmit}
                    type="button"
                  >
                    Insert
                  </Button>
                ) : (
                  <svg
                    onClick={handleAddFields}
                    className="cursor-pointer"
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    fill="#ffffff"
                    viewBox="0 0 256 256"
                  >
                    <path d="M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM184,136H136v48a8,8,0,0,1-16,0V136H72a8,8,0,0,1,0-16h48V72a8,8,0,0,1,16,0v48h48a8,8,0,0,1,0,16Z"></path>
                  </svg>
                )}
              </div>
            )
          })}
          {mode === 'multiple' && (
            <div className="flex mt-4 justify-end">
              <Button disabled={isLoading} onClick={handleSubmit} type="button">
                Insert
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
