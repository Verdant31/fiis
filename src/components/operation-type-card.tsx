import { $Enums, Operation } from '@prisma/client'
import React, { Dispatch, SetStateAction } from 'react'

enum OperationText {
  'purchase' = 'Compra',
  'sale' = 'Venda',
  'unfolding' = 'Desdobramento',
}

export default function OperationTypeCard({
  currentType,
  type,
  onChange,
}: {
  type: Operation
  currentType: Operation
  onChange: Dispatch<SetStateAction<$Enums.Operation>>
}) {
  return (
    <div
      data-active={type === currentType}
      onClick={() => onChange(type)}
      className="operation-type-card sm:px-10"
    >
      {OperationText[type]}
    </div>
  )
}
