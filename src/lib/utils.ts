import { FiisPurchases, Payment } from "@prisma/client";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function compareDates(a: Payment, b: Payment) {
  const dateA : any = new Date(a.date);
  const dateB : any = new Date(b.date);
  return dateA - dateB;
}