import { Operation } from "@prisma/client";
import React from "react";

export enum OperationText {
  "purchase" = "Compra",
  "sale" = "Venda",
  "unfolding" = "Desdobramento",
}

export default function OperationTypeCard({
  currentType,
  type,
  onChange,
}: {
  type: Operation;
  currentType: Operation;
  onChange: (type: Operation) => void;
}) {
  return (
    <div
      data-active={type === currentType}
      onClick={() => onChange(type)}
      className="operation-type-card sm:px-10"
    >
      {OperationText[type]}
    </div>
  );
}
