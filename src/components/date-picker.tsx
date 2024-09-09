'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar, CalendarProps } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ptBR } from 'date-fns/locale'

interface Props {
  className?: string
  showIcon?: boolean
  placeholder?: string
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  dateFormat?: string
  calendarProps?: CalendarProps
}

export function DatePicker({
  date,
  setDate,
  className,
  placeholder,
  showIcon = true,
  dateFormat = 'PPP',
  calendarProps,
}: Props) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            className,
            'justify-start text-left font-normal',
            !date && 'text-muted-foreground',
          )}
        >
          {showIcon && <CalendarIcon className="mr-2 h-4 w-4" />}
          {date ? (
            format(date, dateFormat, { locale: ptBR })
          ) : (
            <span>{placeholder ?? 'Pick a date'}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          {...calendarProps}
          locale={ptBR}
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
