/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { FormEvent, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Papa from 'papaparse'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/axios'
import { toast } from 'sonner'
import { ClipLoader } from 'react-spinners'

export default function UploadFiisModelForm() {
  const [errors, setErrors] = useState<string[]>()
  const [isLoading, setIsLoading] = useState(false)
  const [file, setFile] = useState<File>()

  const handleUploadFile = async () => {
    if (!file || file?.length === 0) {
      setErrors(['Um arquivo deve ser selecionado.'])

      return
    }
    if (file.type !== 'text/csv' && file.type !== 'application/vnd.ms-excel') {
      setErrors(['Apenas arquivos CSV são permitidos.'])
      return
    }
    setIsLoading(true)
    Papa.parse(file, {
      complete: async function (results) {
        const { data } = await api.post('/fiis/upload-operations-file', {
          parsingResults: results.data,
        })
        setIsLoading(false)
        if (data.status !== 200) {
          return Array.isArray(data?.error)
            ? setErrors(data?.error)
            : toast.error(data?.error)
        }
        toast.success(data?.message)
      },
    })
  }

  const onChange = (e: FormEvent) => {
    const files = (e.target as HTMLInputElement).files
    if (files && files.length > 0) {
      setFile(files[0])
    }
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-2">
        <Label htmlFor="picture">Arquivo</Label>
        <Input
          className="file:text-muted-foreground max-w-[330px] mt-2"
          type="file"
          onChange={onChange}
        />
      </div>
      {errors &&
        errors.map((err) => (
          <p className=" text-red-500 text-sm" key={err}>
            * {err}
          </p>
        ))}
      <Button className="w-full mt-4" onClick={() => handleUploadFile()}>
        {isLoading ? <ClipLoader size={20} /> : 'Upload'}
      </Button>
    </div>
  )
}
