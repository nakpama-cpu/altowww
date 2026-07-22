import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function displaySpiritName(row: {
  spirit_name?: string | null;
  distillery_name?: string | null;
  distilleries?: { name?: string | null } | null;
}): string {
  return row?.spirit_name?.trim() || row?.distilleries?.name || row?.distillery_name || "—";
}
