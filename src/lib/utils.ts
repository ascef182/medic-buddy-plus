import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Supabase (and most thrown values here) are Error-shaped, but `catch`
// clauses are typed `unknown` in strict TS — this narrows safely instead of
// falling back to `catch (error: any)` + unchecked `error.message` access.
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  return String(error)
}
