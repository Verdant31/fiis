import { cn } from "@/lib/utils";

interface Props {
  label: string;
  value: string | number;
  className?: string;
  color: string;
}

export const StockDetailsCard = ({ label, value, className, color }: Props) => {
  return (
    <div className={cn("space-y-2 w-[85%]", className)}>
      <p
        style={{ backgroundColor: color }}
        className="py-1 pl-2  font-medium rounded-[2px] "
      >
        {label}
      </p>
      <p>{value}</p>
    </div>
  );
};
