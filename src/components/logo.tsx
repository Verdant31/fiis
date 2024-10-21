import { cn } from "@/lib/utils";

export function Logo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      className={cn("lucide lucide-chart-candlestick", props.className)}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 16v5" />
      <path d="M16 14v7" />
      <path d="M20 10v11" />
      <path d="m22 3-8.646 8.646a.5.5 0 0 1-.708 0L9.354 8.354a.5.5 0 0 0-.707 0L2 15" />
      <path d="M4 18v3" />
      <path d="M8 14v7" />
    </svg>
  );
}
