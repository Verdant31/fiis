import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { useState } from 'react'
import { ExpandIcon } from 'lucide-react'
import { DataTable } from './table'
import { TableOptions, useReactTable } from '@tanstack/react-table'
import { FiiSummary } from '@/types/fiis'
import { fiisSummaryColumnsMobile } from '@/app/fiis/general/columns'

interface Props {
  summarryTableProps: TableOptions<FiiSummary>
}

export function ExpandedFiisTableMobile({ summarryTableProps }: Props) {
  const [modal, setModal] = useState({ isOpen: false, isLoading: false })

  const summaryTableMobile = useReactTable({
    ...summarryTableProps,
    columns: fiisSummaryColumnsMobile,
    state: {
      sorting: summarryTableProps?.state?.sorting,
    },
  })

  return (
    <Dialog
      open={modal.isOpen}
      onOpenChange={(isOpen) => setModal({ isOpen, isLoading: false })}
    >
      <DialogTrigger asChild className="mini-sm:hidden">
        <Button className="p-2">
          <ExpandIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95%] border-none p-0">
        <div className="h-[500px]">
          <DataTable table={summaryTableMobile} className="h-full" />
        </div>
      </DialogContent>
    </Dialog>
  )
}
