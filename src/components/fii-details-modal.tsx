import { Dialog, DialogContent } from '@/components/ui/dialog'
import { FiiSummary } from '@/types/fiis'

interface Props {
  onClose: (value: boolean) => void
  details?: FiiSummary
}

export function FiiDetailsModal({ onClose, details }: Props) {
  console.log(details)
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent
        title="Fii details"
        className="sm:max-w-[425px] bg-zinc-950 border-zinc-800 w-[90%]"
        style={{ borderRadius: 6 }}
      >
        <div>
          <h1 className="text-xl font-semibold">{details?.fiiName}</h1>
          <p className="text-muted-foreground mt-2 text-sm w-[80%]">
            Este fundo ocupa o 5° lugar entre os fundos que você mais investiu.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
